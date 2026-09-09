#!/bin/bash

# Cloud Run Deployment Script
# This script deploys your blog to Google Cloud Run

set -e

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"convertic"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="convertic-ai"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Starting deployment to Cloud Run..."
echo "Project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Service: ${SERVICE_NAME}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📦 Setting GCP project..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the image using Cloud Build
echo "🏗️ Building Docker image with Cloud Build..."
gcloud builds submit --tag ${IMAGE_NAME}:latest .

# Load runtime secrets from .env.production. The runner image (Next.js
# standalone output) does NOT bundle .env.production, so every server-side
# process.env value must be supplied to Cloud Run here. Without this the
# vars below expand empty and the deploy wipes production credentials.
if [ -f .env.production ]; then
    echo "🔑 Loading runtime env from .env.production..."
    set -a
    # shellcheck disable=SC1091
    . ./.env.production
    set +a
else
    echo "❌ .env.production not found — refusing to deploy with empty secrets."
    exit 1
fi

# Guard: never deploy empty critical secrets.
for required in DATABASE_URL GOOGLE_ID GOOGLE_SECRET FIREBASE NEXTAUTH_SECRET; do
    if [ -z "$(eval echo \$$required)" ]; then
        echo "❌ $required is empty — aborting to avoid breaking production."
        exit 1
    fi
done

# Deploy to Cloud Run.
# NOTE: --update-env-vars MERGES (updates the listed keys, leaves others such
# as ADMIN_EMAILS intact). Do NOT switch back to --set-env-vars, which replaces
# the entire env set and would drop any var not listed here.
echo "🚢 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME}:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 100 \
    --update-env-vars "NODE_ENV=production" \
    --update-env-vars "DATABASE_URL=${DATABASE_URL}" \
    --update-env-vars "GOOGLE_ID=${GOOGLE_ID}" \
    --update-env-vars "GOOGLE_SECRET=${GOOGLE_SECRET}" \
    --update-env-vars "FIREBASE=${FIREBASE}" \
    --update-env-vars "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" \
    --update-env-vars "HUBSPOT_TOKEN=${HUBSPOT_TOKEN}" \
    --update-env-vars "NEXTAUTH_URL=${NEXTAUTH_URL:-https://${SERVICE_NAME}-${PROJECT_ID}.${REGION}.run.app}"

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')

echo "✅ Deployment complete!"
echo "🌐 Your blog is available at: ${SERVICE_URL}"
echo ""
echo "📝 Next steps:"
echo "1. Update NEXTAUTH_URL in your .env to: ${SERVICE_URL}"
echo "2. Add ${SERVICE_URL} to your Google OAuth authorized redirect URIs"
echo "3. (Optional) Set up a custom domain: gcloud run domain-mappings create --service ${SERVICE_NAME} --domain YOUR_DOMAIN --region ${REGION}"
