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
    // Fewer breakpoints = fewer unique transforms generated
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 128, 384],
    // Cache transforms for 30 days (default is 60s — causes constant re-transforms)
    minimumCacheTTL: 2592000,
  },

  // Route redirects — permanent moves for SEO
  async redirects() {
    return [
      // /investments → /opportunities (renamed slug, 301 for SEO)
      { source: '/investments', destination: '/opportunities', permanent: true },
      { source: '/investments/:id', destination: '/opportunities/:id', permanent: true },
      { source: '/fr/investments', destination: '/fr/opportunities', permanent: true },
      { source: '/fr/investments/:id', destination: '/fr/opportunities/:id', permanent: true },
      { source: '/es/investments', destination: '/es/opportunities', permanent: true },
      { source: '/es/investments/:id', destination: '/es/opportunities/:id', permanent: true },
      // /about → / (about content is the homepage)
      { source: '/about', destination: '/', permanent: false },
      { source: '/fr/about', destination: '/fr', permanent: false },
      { source: '/es/about', destination: '/es', permanent: false },
      // Legacy contact page → contact section on homepage
      { source: '/contact', destination: '/#contact', permanent: true },
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
