/** @type {import('next').NextConfig} */
const crypto = require('crypto');

// ============================================================
// HELPERS
// ============================================================

function getApiUploadPattern() {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_URL ||
    'http://localhost:3001';

  try {
    const parsed = new URL(rawApiUrl);
    return {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: '/uploads/**',
    };
  } catch {
    return null;
  }
}

const apiUploadPattern = getApiUploadPattern();

// Détection de l'environnement
const isDev = process.env.NODE_ENV !== 'production';

// ============================================================
// EN-TÊTES DE SÉCURITÉ (appliqués partout, dev + prod)
// ============================================================

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

// ============================================================
// CONFIG
// ============================================================

const nextConfig = {
  // Cache busting : buildId unique à chaque build
  generateBuildId: async () => {
    return crypto.randomBytes(8).toString('hex');
  },

  reactStrictMode: true,

  images: {
    remotePatterns: [
      ...(apiUploadPattern ? [apiUploadPattern] : []),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/v1/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lolomaths.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.genspark.ai',
        port: '',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },

  // ✅ Proxy API vers le backend NestJS
  async rewrites() {
    const backendUrl = (
      process.env.BACKEND_URL || 'http://localhost:3001'
    ).replace(/\/+$/, '');

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },

  // ============================================================
  // HEADERS
  // ============================================================
  async headers() {
    // ✅ EN DÉVELOPPEMENT : on n'applique PAS de Cache-Control custom
    //    pour ne pas casser le HMR de Next.js.
    //    On garde uniquement les en-têtes de sécurité.
    if (isDev) {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ];
    }

    // ✅ EN PRODUCTION : cache agressif + sécurité
    return [
      // Sécurité globale
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Cache immutable pour les assets statiques Next.js
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache immutable pour les fichiers statiques
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache immutable pour les images
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Pas de cache pour les routes API
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      // Revalidation rapide pour les pages HTML
      {
        source: '/:path((?!_next|static|api)[^.]*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=0, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      'date-fns',
      '@react-pdf/renderer',
    ],
  },
};

module.exports = nextConfig;