# Architecture Change: From Static to Cloud Run

## Current Setup (Not Working for Auth)
```
User → convertic.ai → Cloudflare → GCP Storage Bucket (static files)
                                    ↓
                                    ❌ No API routes
                                    ❌ No authentication
```

## New Setup (Everything Works)
```
User → convertic.ai → Cloudflare → Cloud Run (Next.js server)
                                    ↓
                                    ✅ Landing page (/)
                                    ✅ Blog (/blog)
                                    ✅ API routes (/api/*)
                                    ✅ Authentication works
```

## What Changes

### DNS (Cloudflare)
**Before:** Points to GCP Storage bucket
**After:** Points to Cloud Run service

### Hosting
**Before:** Static files in GCP Storage
**After:** Cloud Run container running Next.js

### URLs
- `convertic.ai` → Landing page (same as before)
- `convertic.ai/blog` → Blog (same as before)
- `convertic.ai/api/auth/*` → NOW WORKS! (was 404 before)

## Cost Comparison

### Old Setup (Static)
- GCP Storage: $0/month
- But authentication DOESN'T WORK

### New Setup (Cloud Run)
- 10k visits: $0/month (free tier)
- 50k visits: $0/month (free tier)
- 100k visits: ~$2-5/month
- Authentication WORKS!

## Performance

Cloud Run automatically:
- Caches static pages (landing, blog posts)
- Scales to zero when not in use
- Scales up during traffic spikes
- Serves from Google's edge network

Landing page and blog posts load just as fast as static hosting because Next.js caches them.

## Why This is Better

1. **Everything works**: Auth, posting, all features
2. **Same cost**: Free for your traffic level
3. **One deployment**: No separate static/dynamic setup
4. **Easier maintenance**: One codebase, one deployment
5. **Future-proof**: Can add any features later

## Migration Steps

1. Deploy to Cloud Run (5-10 minutes)
2. Update Cloudflare DNS (5 minutes)
3. Wait for DNS propagation (5-30 minutes)
4. Update Google OAuth redirect URIs
5. Done!

No downtime - old site works until DNS switches.
