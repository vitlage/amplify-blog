# Complete Deployment Guide to Google Cloud Run

## Step 1: Install Google Cloud CLI

### For macOS:
```bash
# Download and install (choose one method):

# Method 1: Using Homebrew (easiest)
brew install google-cloud-sdk

# Method 2: Direct download
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

After installation, verify:
```bash
gcloud --version
```

## Step 2: Set Up Google Cloud Project

### 2.1 Initialize gcloud and login:
```bash
gcloud init
```
This will:
- Open browser for Google account login
- Let you create a new project or select existing one
- Set default region (choose `us-central1` for best free tier)

### 2.2 Note your project ID:
```bash
gcloud config get-value project
# Save this PROJECT_ID - you'll need it
```

### 2.3 Enable billing:
- Go to: https://console.cloud.google.com/billing
- Link a billing account (required but you'll stay in free tier)

## Step 3: Prepare Environment Variables

### 3.1 Copy the environment template:
```bash
cp .env.production.example .env.production
```

### 3.2 Get your existing values from .env:
```bash
cat .env
```

### 3.3 Edit .env.production with your values:
```bash
nano .env.production
```

You need:
- `DATABASE_URL` - Your MongoDB connection string
- `GOOGLE_ID` - Your Google OAuth client ID  
- `GOOGLE_SECRET` - Your Google OAuth client secret
- `FIREBASE` - Your Firebase API key
- `NEXTAUTH_SECRET` - Generate new one: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Leave as placeholder, will update after deployment

## Step 4: Deploy to Cloud Run

### 4.1 Set environment variables:
```bash
# Load your project ID
export GCP_PROJECT_ID=$(gcloud config get-value project)

# Load your env variables
source .env.production
```

### 4.2 Enable required Google Cloud APIs:
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 4.3 Build and deploy (single command):
```bash
# This builds in the cloud (no local Docker needed)
gcloud run deploy amplify-blog \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 100 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars DATABASE_URL="$DATABASE_URL" \
  --set-env-vars GOOGLE_ID="$GOOGLE_ID" \
  --set-env-vars GOOGLE_SECRET="$GOOGLE_SECRET" \
  --set-env-vars FIREBASE="$FIREBASE" \
  --set-env-vars NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
```

Wait 5-10 minutes for first deployment.

## Step 5: Post-Deployment Configuration

### 5.1 Get your service URL:
```bash
gcloud run services describe amplify-blog --region us-central1 --format 'value(status.url)'
# Example output: https://amplify-blog-abc123-uc.a.run.app
```

### 5.2 Update NEXTAUTH_URL:
```bash
# Replace YOUR_URL with the URL from step 5.1
gcloud run services update amplify-blog \
  --update-env-vars NEXTAUTH_URL=YOUR_URL \
  --region us-central1
```

### 5.3 Update Google OAuth settings:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://YOUR-SERVICE-URL/api/auth/callback/google
   ```
   (Replace YOUR-SERVICE-URL with your actual Cloud Run URL)
4. Save

## Step 6: Test Your Deployment

### 6.1 Visit your blog:
```bash
# Open in browser
open $(gcloud run services describe amplify-blog --region us-central1 --format 'value(status.url)')/blog
```

### 6.2 Test authentication:
- Click login
- Sign in with Google
- Should redirect back successfully

## Step 7: (Optional) Custom Domain

### 7.1 If you want convertic.ai:
```bash
# First, verify domain ownership
gcloud domains verify convertic.ai

# Then map it
gcloud run domain-mappings create \
  --service amplify-blog \
  --domain convertic.ai \
  --region us-central1
```

### 7.2 Update DNS:
Add the CNAME/A records shown by the command above to your domain's DNS.

### 7.3 Update NEXTAUTH_URL again:
```bash
gcloud run services update amplify-blog \
  --update-env-vars NEXTAUTH_URL=https://convertic.ai \
  --region us-central1
```

## Troubleshooting

### If deployment fails:
```bash
# Check build logs
gcloud builds list --limit=1
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')
```

### If authentication doesn't work:
1. Check NEXTAUTH_URL matches exactly
2. Verify Google OAuth redirect URIs
3. Check logs:
```bash
gcloud run services logs read amplify-blog --region us-central1 --limit=50
```

## Quick Deploy Script

Alternatively, after setting up gcloud and .env.production, run:
```bash
./deploy-cloudrun.sh
```

## Cost Reminder

With your configuration:
- **10,000 visits/month = $0**
- **50,000 visits/month = $0**  
- **100,000 visits/month = ~$2-5**

Free tier includes:
- 2 million requests/month
- 360,000 GB-seconds compute/month
- 1 GB network egress/month
