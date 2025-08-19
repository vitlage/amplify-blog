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
    // Fix asset paths for static hosting
    assetPrefix: '',
    // Ensure proper static file handling
    distDir: '.next',
}

module.exports = nextConfig
