# Quick Deployment Guide

## Deploy to Production (convertic.ai)

### One Command Deployment

```bash
gcloud config set project convertic && gcloud run deploy convertic-ai --source . --platform managed --region us-central1 --allow-unauthenticated --memory 512Mi --cpu 1 --min-instances 0 --max-instances 100 --set-env-vars NODE_ENV=production
```

### Or use the script

```bash
./DEPLOY_WITH_DOMAIN.sh
```

## Important

- **Project**: `convertic` (NOT convertic-4dbfa)
- **Service**: `convertic-ai`
- **Region**: `us-central1`

## After Deployment

1. Changes are live at: https://convertic.ai
2. If you don't see changes, purge Cloudflare cache
3. Or hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

## Verify Deployment

```bash
gcloud run revisions list --service convertic-ai --region us-central1 --limit 5
```

You should see your new revision at the top with today's date.
