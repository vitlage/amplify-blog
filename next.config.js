/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains:["lh3.googleusercontent.com","firebasestorage.googleapis.com"],
        // Required for static export - images served directly from Firebase CDN
        unoptimized: true
    },
    // Full static export for cheapest cost - no server needed
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    // Fix asset paths for GCS static hosting - only in production
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://convertic-blog-static.storage.googleapis.com' : '',
    // Ensure proper static file handling
    distDir: '.next',
}

module.exports = nextConfig
