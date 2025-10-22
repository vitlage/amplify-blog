# Deploy to GCP - Cloud Run (Production Method)

This is the correct deployment method for convertic.ai.

## ✅ What's Ready

- ✅ **Cloud Run**: Serverless container deployment
- ✅ **Auto-scaling**: Scales to zero when not in use
- ✅ **Static Data**: All content pre-generated at build time
- ✅ **Firebase Images**: Images served from Firebase CDN
- ✅ **SEO Optimized**: All pages have proper metadata

## 🚀 Quick Deployment

### Simple One-Command Deployment

```bash
# Set correct project
gcloud config set project convertic

# Deploy to Cloud Run
gcloud run deploy convertic-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 100 \
  --set-env-vars NODE_ENV=production

```

This will:
- Build your Docker container
- Deploy to Cloud Run
- Make it publicly accessible
- Auto-scale based on traffic

## 📊 Deployment Details

- **Project**: `convertic` (IMPORTANT: Use this project, not convertic-4dbfa)
- **Service**: `convertic-ai`
- **Region**: `us-central1`
- **URL**: https://convertic-ai-421564831118.us-central1.run.app
- **Domain**: https://convertic.ai (via Cloudflare)

## 💰 Cost Breakdown

- **Cloud Run**: Free tier includes 2 million requests/month
- **Memory**: 512Mi (sufficient for Next.js)
- **CPU**: 1 vCPU
- **Min Instances**: 0 (scales to zero = no cost when idle)
- **Max Instances**: 100 (auto-scales based on traffic)

**Estimated Monthly Cost: $0-5** (within free tier for normal traffic)

## 🔄 Automated Deployment Script

Use the provided script for easier deployment:

```bash
./DEPLOY_WITH_DOMAIN.sh
```

## 📊 Performance Benefits

- **Serverless**: No server management needed
- **Auto-scaling**: Handles traffic spikes automatically
- **Global CDN**: Cloudflare CDN for fast delivery
- **Container**: Consistent environment
- **Zero downtime**: Rolling updates

## 🔧 Updates

To update your site:

1. Make your code changes
2. Run: `gcloud config set project convertic`
3. Run: `gcloud run deploy convertic-ai --source . --platform managed --region us-central1 --allow-unauthenticated --memory 512Mi --cpu 1`
4. Purge Cloudflare cache if needed

Your site is now live at: https://convertic.ai

## ⚠️ Important Notes

- Always use project `convertic` (not convertic-4dbfa)
- Service name must be `convertic-ai`
- Region must be `us-central1`
- After deployment, purge Cloudflare cache to see changes immediately
