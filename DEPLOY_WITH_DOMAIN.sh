#!/bin/bash

# Deployment Script for convertic.ai (Landing + Blog)
# This deploys the entire site to Cloud Run and configures for Cloudflare

set -e

echo "🚀 Deploying convertic.ai to Google Cloud Run"
echo "============================================="
echo ""

# Step 1: Check gcloud installation
echo "Step 1: Checking if gcloud is installed..."
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found!"
    echo ""
    echo "Please install it first:"
    echo "  brew install google-cloud-sdk"
    echo ""
    echo "After installation, run this script again."
    exit 1
fi
echo "✅ gcloud is installed"
echo ""

# Step 2: Set correct project
echo "Step 2: Setting correct Google Cloud project..."
gcloud config set project convertic
PROJECT_ID=$(gcloud config get-value project)
echo "✅ Using project: $PROJECT_ID"
echo ""

# Step 3: Prepare environment file
echo "Step 3: Preparing environment variables..."
if [ ! -f .env.production ]; then
    echo "Creating .env.production from your existing .env..."
    cp .env .env.production
    # Update NEXTAUTH_URL to use convertic.ai
    sed -i '' 's|NEXTAUTH_URL.*|NEXTAUTH_URL=https://convertic.ai|' .env.production
    echo "✅ Created .env.production with convertic.ai domain"
else
    echo "✅ .env.production already exists"
fi
echo ""

# Step 4: Enable APIs
echo "Step 4: Enabling required Google Cloud APIs..."
echo "This may take a minute..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com
echo "✅ APIs enabled"
echo ""

# Step 5: Deploy
echo "Step 5: Building and deploying to Cloud Run..."
echo "⏰ This will take 5-10 minutes for the first deployment..."
echo ""

# Load environment variables
source .env.production

# Deploy with all environment variables
gcloud run deploy convertic-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 100 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars "DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars "GOOGLE_ID=${GOOGLE_ID}" \
  --set-env-vars "GOOGLE_SECRET=${GOOGLE_SECRET}" \
  --set-env-vars "FIREBASE=${FIREBASE}" \
  --set-env-vars "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" \
  --set-env-vars "NEXTAUTH_URL=https://convertic.ai" \
  --set-env-vars "HOST_URL=https://convertic.ai"

echo ""
echo "✅ Deployment complete!"
echo ""

# Step 6: Get service URL
SERVICE_URL=$(gcloud run services describe convertic-ai --region us-central1 --format 'value(status.url)')
echo "📍 Cloud Run URL: $SERVICE_URL"
echo ""

# Step 7: Instructions for DNS
echo "========================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "========================================="
echo ""
echo "📌 IMPORTANT: Update Cloudflare DNS"
echo "======================================"
echo ""
echo "1. Log in to Cloudflare Dashboard"
echo "2. Select convertic.ai"
echo "3. Go to DNS settings"
echo "4. Update/Add these records:"
echo ""
echo "   If using CNAME (recommended):"
echo "   -------------------------------"
echo "   Type: CNAME"
echo "   Name: @ (or convertic.ai)"
echo "   Target: ${SERVICE_URL#https://}"
echo "   Proxy: ✅ ON (orange cloud)"
echo ""
echo "   OR if using A record:"
echo "   -------------------------------"
echo "   You'll need the IP address of Cloud Run service."
echo "   Run: gcloud run services describe convertic-ai --region us-central1 --format='value(status.address.url)'"
echo ""
echo "5. Delete any existing A/CNAME records pointing to GCP Storage"
echo ""
echo "📌 UPDATE GOOGLE OAUTH"
echo "======================"
echo ""
echo "1. Go to: https://console.cloud.google.com/apis/credentials"
echo "2. Click on your OAuth 2.0 Client ID"
echo "3. Add these to 'Authorized redirect URIs':"
echo "   - https://convertic.ai/api/auth/callback/google"
echo "   - ${SERVICE_URL}/api/auth/callback/google (backup)"
echo "4. Click Save"
echo ""
echo "📌 VERIFY DEPLOYMENT"
echo "===================="
echo ""
echo "Test immediately (Cloud Run URL):"
echo "  open ${SERVICE_URL}"
echo ""
echo "After DNS propagation (5-30 minutes with Cloudflare):"
echo "  open https://convertic.ai"
echo "  open https://convertic.ai/blog"
echo ""
echo "⚠️  NOTE: Cloudflare DNS changes usually take 5-30 minutes."
echo "If convertic.ai doesn't work immediately, wait and try again."
echo ""
