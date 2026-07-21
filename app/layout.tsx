import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BT Homes',
  description: 'Sentirse en casa, estés donde estés. Propiedades premium en Argentina y México con servicio integral, atención al detalle y oportunidades de inversión.',
  openGraph: {
    title: 'BT Homes',
    description: 'Sentirse en casa, estés donde estés. Propiedades premium en Argentina y México con servicio integral, atención al detalle y oportunidades de inversión.',
    url: 'https://www.bthomes.world',
    siteName: 'BT Homes',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BT Homes',
      }
    ],
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: '#fff' }}>{children}</body>
    </html>
  )
}