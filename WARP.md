# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a statically exported Next.js 13.4 blog application with Firebase image storage, Prisma/MongoDB for data, and NextAuth authentication. The project is configured for deployment to Google Cloud Platform storage buckets for cost-effective static hosting.

## Core Commands

### Development
```bash
npm run dev          # Start dev server on localhost:3000
npm run lint         # Run ESLint
```

### Build & Deploy
```bash
npm run build        # Build static export to ./out directory
npm run export       # Export static files (after build)

# Deploy to GCP Storage (see DEPLOY_TO_GCP.md for full details)
gsutil -m rsync -r -c -d ./out gs://$BUCKET_NAME
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to MongoDB
```

## Architecture

### Static Export Configuration
- **Static Generation**: Configured with `output: 'export'` in `next.config.js`
- **Build Output**: Static files generated in `./out` directory
- **Data Source**: Static data from `src/lib/staticData.js` (replaces API calls at build time)
- **Images**: Served from Firebase CDN with `unoptimized: true` setting

### Key Directories
- `src/app/` - Next.js 13 app directory structure
  - `api/` - API routes (auth endpoints)
  - `blog/` - Blog pages and components
- `src/components/` - Reusable React components
- `src/utils/` - Utility functions and configurations
  - `auth.js` - NextAuth configuration with Google provider
  - `firebase.js` - Firebase app initialization
  - `connect.js` - Prisma database connection
- `src/lib/` - Library functions
  - `staticData.js` - Static data for build-time generation

### Authentication Flow
Uses NextAuth with Google OAuth provider and Prisma adapter for MongoDB session storage. Authentication configuration is in `src/utils/auth.js`.

### Database Schema (Prisma/MongoDB)
Key models defined in `prisma/schema.prisma`:
- `User` - User accounts with OAuth integration
- `Post` - Blog posts with category relationships
- `Comment` - Post comments with user associations
- `Category` - Post categories with slug-based routing

### Environment Variables Required
```bash
DATABASE_URL          # MongoDB connection string
GOOGLE_ID            # Google OAuth client ID
GOOGLE_SECRET        # Google OAuth client secret
FIREBASE             # Firebase API key
NEXTAUTH_SECRET      # NextAuth session secret
NEXTAUTH_URL         # NextAuth callback URL
```

### GCP Deployment Architecture
- **Storage**: GCP Storage bucket for static hosting
- **CDN**: Optional Cloud CDN with load balancer
- **Cost**: $0/month within free tier limits (5GB storage, 1GB egress)
- **Performance**: Pre-rendered static HTML served directly from CDN

### Build Process
1. Static data is loaded from `src/lib/staticData.js`
2. Next.js generates static HTML for all pages at build time
3. Output is written to `./out` directory
4. Files are synced to GCP Storage bucket
5. Optional: Cloud CDN caches and serves content globally

### Image Handling
- Images stored in Firebase Storage (configured in `src/utils/firebase.js`)
- Firebase CDN URLs used directly in static HTML
- Next.js Image optimization disabled for static export compatibility

## Deployment Notes

### GCP Setup (from DEPLOY_TO_GCP.md)
The project includes comprehensive GCP deployment instructions with:
- Storage bucket creation and configuration
- Cloud CDN setup for global distribution
- Custom domain and SSL certificate configuration
- Automated deployment via Cloud Build

### Production URL Structure
- Static site: `http://[bucket-name].storage.googleapis.com`
- With CDN: `http://[reserved-ip-address]`
- Custom domain: `https://yourdomain.com`

## Development Workflow

1. Update content in `src/lib/staticData.js`
2. Test locally with `npm run dev`
3. Build static export with `npm run build`
4. Deploy to GCP with gsutil rsync command
5. Optional: Use Cloud Build for automated deployments
