# Deploy to Google Cloud Run

This guide explains how to deploy your Next.js blog to Google Cloud Run with authentication support.

## Why Cloud Run?

- **Scales to zero**: No charges when not in use
- **Free tier**: 2M requests + 360K GB-seconds per month
- **Authentication works**: Full support for NextAuth and API routes
- **Static optimization**: Next.js automatically caches static pages
- **Cost for 10k visits/month**: $0 (within free tier)

## Prerequisites

1. Google Cloud account with billing enabled
2. `gcloud` CLI installed ([install guide](https://cloud.google.com/sdk/docs/install))
3. A MongoDB database (e.g., MongoDB Atlas free tier)
4. Google OAuth credentials configured

## Quick Deploy

### 1. Set Environment Variables

```bash
# Copy the example file
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

### 2. Configure Deployment

```bash
# Set your project ID
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"  # or your preferred region

# Load environment variables for deployment
source .env.production
export DATABASE_URL GOOGLE_ID GOOGLE_SECRET FIREBASE NEXTAUTH_SECRET
```

### 3. Deploy

```bash
# Run the deployment script
./deploy-cloudrun.sh
```

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Enable APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Build Docker Image

```bash
# Build locally
docker build -t gcr.io/$GCP_PROJECT_ID/amplify-blog .

# Or use Cloud Build
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/amplify-blog .
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy amplify-blog \
  --image gcr.io/$GCP_PROJECT_ID/amplify-blog \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 100 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars DATABASE_URL=$DATABASE_URL \
  --set-env-vars GOOGLE_ID=$GOOGLE_ID \
  --set-env-vars GOOGLE_SECRET=$GOOGLE_SECRET \
  --set-env-vars FIREBASE=$FIREBASE \
  --set-env-vars NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
  --set-env-vars NEXTAUTH_URL=https://amplify-blog-$GCP_PROJECT_ID-us-central1.run.app
```

## Post-Deployment Setup

### 1. Update Google OAuth

Add your Cloud Run URL to authorized redirect URIs in Google Cloud Console:
- Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Select your OAuth 2.0 Client
- Add: `https://your-service-url.run.app/api/auth/callback/google`

### 2. Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service amplify-blog \
  --domain yourdomain.com \
  --region us-central1

# Update DNS records as instructed
```

### 3. Update Environment Variables

If using a custom domain, update NEXTAUTH_URL:

```bash
gcloud run services update amplify-blog \
  --update-env-vars NEXTAUTH_URL=https://yourdomain.com \
  --region us-central1
```

## Continuous Deployment

### Option 1: Cloud Build Triggers

Connect your GitHub repo:
```bash
# Create trigger
gcloud builds triggers create github \
  --repo-name=amplify-blog \
  --repo-owner=your-github-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Option 2: GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloud Run
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      - run: gcloud builds submit --config cloudbuild.yaml
```

## Cost Optimization

### Free Tier Limits
- **Requests**: 2 million/month
- **Compute**: 360,000 GB-seconds/month
- **Network**: 1 GB egress/month

### Tips to Stay Within Free Tier
1. **Min instances = 0**: Always scale to zero
2. **Memory = 256Mi**: Use minimum memory
3. **CPU = 1**: Single CPU is sufficient
4. **Cache static assets**: Use Cloud CDN for images/CSS/JS
5. **Optimize images**: Use WebP format and lazy loading

## Monitoring

View logs and metrics:
```bash
# View logs
gcloud run services logs read amplify-blog --region us-central1

# View metrics in Cloud Console
open https://console.cloud.google.com/run/detail/us-central1/amplify-blog/metrics
```

## Troubleshooting

### Authentication Not Working
- Verify NEXTAUTH_URL matches your service URL
- Check Google OAuth redirect URIs
- Ensure NEXTAUTH_SECRET is set

### High Memory Usage
- Reduce Next.js cache size
- Optimize images
- Use 256Mi memory limit

### Cold Starts
- Normal for Cloud Run
- First request after idle: ~2-3 seconds
- Subsequent requests: <100ms

## Rollback

If something goes wrong:
```bash
# List revisions
gcloud run revisions list --service amplify-blog --region us-central1

# Rollback to previous revision
gcloud run services update-traffic amplify-blog \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```

## Support

For issues or questions:
1. Check Cloud Run logs
2. Verify environment variables
3. Test locally with Docker first
4. Review [Cloud Run documentation](https://cloud.google.com/run/docs)
