/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains:["lh3.googleusercontent.com","firebasestorage.googleapis.com"],
    },
    // Standalone output for Cloud Run - includes all dependencies
    output: 'standalone',
    // Keep trailing slash for consistency
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    // Standard Next.js build directory
    distDir: '.next',
}

module.exports = nextConfig
