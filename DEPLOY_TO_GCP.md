# Deploy to GCP - Cheapest Static Hosting

Your site is now ready for deployment! Follow these steps for the cheapest GCP hosting.

## ✅ What's Ready

- ✅ **Static Export**: Your site builds to `./out` directory
- ✅ **Zero Server Costs**: No Node.js server needed
- ✅ **Static Data**: All content pre-generated at build time
- ✅ **Firebase Images**: Images served from Firebase CDN
- ✅ **SEO Optimized**: All pages have proper metadata

## 🚀 Deployment Steps

### 1. Create GCP Storage Bucket

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export BUCKET_NAME="your-blog-bucket"

# Create bucket for website hosting
gsutil mb gs://$BUCKET_NAME

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Enable website configuration
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME
```

### 2. Deploy Static Files

```bash
# Build your site
npm run build

# Upload to GCP Storage
gsutil -m rsync -r -c -d ./out gs://$BUCKET_NAME

# Set cache headers for better performance
gsutil -m setmeta -h "Cache-Control:public,max-age=3600" "gs://$BUCKET_NAME/**/*.html"
gsutil -m setmeta -h "Cache-Control:public,max-age=31536000" "gs://$BUCKET_NAME/**/*.{css,js,png,jpg,jpeg,gif,ico,svg,woff,woff2}"
```

### 3. Setup Cloud CDN (Optional but recommended)

```bash
# Create load balancer for CDN
gcloud compute url-maps create your-blog-lb \
    --default-service=your-blog-backend

# Create backend bucket
gcloud compute backend-buckets create your-blog-backend \
    --gcs-bucket-name=$BUCKET_NAME

# Create HTTP(S) load balancer
gcloud compute target-http-proxies create your-blog-proxy \
    --url-map=your-blog-lb

# Reserve static IP
gcloud compute addresses create your-blog-ip --global

# Create forwarding rule
gcloud compute forwarding-rules create your-blog-rule \
    --address=your-blog-ip \
    --global \
    --target-http-proxy=your-blog-proxy \
    --ports=80
```

### 4. Setup Custom Domain (Optional)

```bash
# Point your domain to the reserved IP
gcloud compute addresses describe your-blog-ip --global

# Create SSL certificate
gcloud compute ssl-certificates create your-blog-ssl \
    --domains=yourdomain.com,www.yourdomain.com

# Update to HTTPS
gcloud compute target-https-proxies create your-blog-https-proxy \
    --url-map=your-blog-lb \
    --ssl-certificates=your-blog-ssl
```

## 💰 Cost Breakdown (Free Tier)

- **Storage**: 5GB free (your site is ~50MB)
- **Bandwidth**: 1GB free egress from US
- **CDN**: 10GB free cache (Cloud CDN)
- **Load Balancer**: Free for basic HTTP(S)

**Total Monthly Cost: $0** (within free tier limits)

## 🔄 Automated Deployment

Use the provided `cloudbuild.yaml` with Cloud Build:

```bash
# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Submit build
gcloud builds submit --config cloudbuild.yaml \
    --substitutions=_BUCKET_NAME=$BUCKET_NAME
```

## 📊 Performance Benefits

- **Static Files**: Served directly from CDN
- **Global CDN**: Fast worldwide delivery  
- **Firebase Images**: Optimized image delivery
- **Zero Server**: No server startup time
- **Pre-rendered**: All HTML generated at build time

## 🔧 Updates

To update your site:

1. Update content in `src/lib/staticData.js`
2. Run `npm run build`
3. Run `gsutil -m rsync -r -c -d ./out gs://$BUCKET_NAME`

Your site is now live at: `http://[your-bucket-name].storage.googleapis.com`

Or with CDN: `http://[your-ip-address]`

Or with custom domain: `https://yourdomain.com`
