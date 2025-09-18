#!/bin/bash

# Simple Deployment Script for amplify-blog to Google Cloud Run
# Run this after installing gcloud CLI

set -e

echo "🚀 Google Cloud Run Deployment Helper"
echo "====================================="
echo ""

# Step 1: Check gcloud installation
echo "Step 1: Checking if gcloud is installed..."
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found!"
    echo ""
    echo "Please install it first using ONE of these methods:"
    echo ""
    echo "Option 1 (Homebrew - easiest):"
    echo "  brew install google-cloud-sdk"
    echo ""
    echo "Option 2 (Direct download):"
    echo "  curl https://sdk.cloud.google.com | bash"
    echo "  exec -l \$SHELL"
    echo ""
    echo "After installation, run this script again."
    exit 1
fi
echo "✅ gcloud is installed"
echo ""

# Step 2: Initialize gcloud if needed
echo "Step 2: Setting up Google Cloud..."
echo "This will open a browser to log in to your Google account."
echo "Press Enter to continue..."
read

gcloud init

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
echo "✅ Using project: $PROJECT_ID"
echo ""

# Step 3: Prepare environment file
echo "Step 3: Preparing environment variables..."
if [ ! -f .env.production ]; then
    echo "Creating .env.production from your existing .env..."
    cp .env .env.production
    echo "✅ Created .env.production"
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
  --set-env-vars "DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars "GOOGLE_ID=${GOOGLE_ID}" \
  --set-env-vars "GOOGLE_SECRET=${GOOGLE_SECRET}" \
  --set-env-vars "FIREBASE=${FIREBASE}" \
  --set-env-vars "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}"

echo ""
echo "✅ Deployment complete!"
echo ""

# Step 6: Get service URL
SERVICE_URL=$(gcloud run services describe amplify-blog --region us-central1 --format 'value(status.url)')
echo "📍 Your blog is deployed at: $SERVICE_URL"
echo ""

# Step 7: Update NEXTAUTH_URL
echo "Step 6: Updating authentication URL..."
gcloud run services update amplify-blog \
  --update-env-vars "NEXTAUTH_URL=${SERVICE_URL}" \
  --region us-central1
echo "✅ Authentication URL updated"
echo ""

# Step 8: Instructions for OAuth
echo "========================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "========================================="
echo ""
echo "Your blog URL: ${SERVICE_URL}/blog"
echo ""
echo "⚠️  IMPORTANT - Final step for authentication to work:"
echo ""
echo "1. Go to: https://console.cloud.google.com/apis/credentials"
echo "2. Click on your OAuth 2.0 Client ID"
echo "3. Add this to 'Authorized redirect URIs':"
echo "   ${SERVICE_URL}/api/auth/callback/google"
echo "4. Click Save"
echo ""
echo "After adding the redirect URI, your login will work!"
echo ""
echo "To open your blog now:"
echo "  open ${SERVICE_URL}/blog"
echo ""
