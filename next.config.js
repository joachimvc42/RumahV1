/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Turbopack to use this directory as the workspace root — without
  // this, Turbopack picks the parent folder because of a stray lockfile,
  // and resolves modules (Header, pages) from the wrong source tree.
  turbopack: {
    root: __dirname,
  },

  // Remove X-Powered-By header
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Image optimisation — allow Supabase storage URLs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Route redirects — permanent moves for SEO
  async redirects() {
    return [
      // The old rentals listing lives on the homepage now
      { source: '/rentals', destination: '/', permanent: true },
      // Legacy contact page → About (contact section)
      { source: '/contact', destination: '/about#contact', permanent: true },
    ];
  },

  // Security + caching headers
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Only cache aggressively in production — in dev this breaks hot-reload
      ...(isProd ? [
        {
          source: '/_next/static/(.*)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          source: '/images/(.*)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
          ],
        },
      ] : []),
    ];
  },
};

module.exports = nextConfig;
