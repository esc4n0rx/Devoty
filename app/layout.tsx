// app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Devoty - Devocionais Diários',
  description: 'Fortaleça sua caminhada espiritual com devocionais diários, reflexões bíblicas e espaço para registrar sua jornada.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  keywords: ['devocional', 'bíblia', 'fé', 'cristianismo', 'espiritualidade'],
  authors: [{ name: 'Devoty Team' }],
  creator: 'Devoty',
  publisher: 'Devoty',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://devoty.netlify.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Devoty - Devocionais Diários',
    description: 'Fortaleça sua caminhada espiritual com devocionais diários',
    url: 'https://devoty.netlify.app/',
    siteName: 'Devoty',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devoty - Devocionais Diários',
    description: 'Fortaleça sua caminhada espiritual com devocionais diários',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Devoty',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ffcc80" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Devoty" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Devoty" />
        <meta name="msapplication-TileColor" content="#f5f5dc" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}