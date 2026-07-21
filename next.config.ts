import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,

  images: {
    // ✅ SOLUCIÓN: Deshabilita Image Optimization de Vercel
    // Esto evita que Vercel use las 5,000 transformaciones gratuitas
    unoptimized: true,

    // Permitir imágenes desde estos dominios
    remotePatterns: [
      // Para Cloudinary (recomendado)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Para Sanity CMS
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      // Para Unsplash (si lo usas)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Para Stripe (logos de tarjetas, etc)
      {
        protocol: 'https',
        hostname: 'stripe.com',
        pathname: '/**',
      },
      // Para URLs genéricas
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
    ],

    // Formatos de imagen soportados
    formats: ['image/avif', 'image/webp'],

    // Tamaños de dispositivos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Tamaños de imagen
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configuración de headers (opcional, para mejor caché)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

