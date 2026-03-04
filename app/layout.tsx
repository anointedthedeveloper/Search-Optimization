import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Anointed Agunloye - Web Developer Search Portal | Find anointedthedeveloper',
  description: 'Find Anointed Agunloye (anointedthedeveloper) - Web Developer. Search for GitHub profile, portfolio at anobyte.online, and projects. Personal search portal.',
  keywords: ['Anointed Agunloye', 'Agunloye Anointed', 'anointedthedeveloper', 'Anointed the developer', 'Anobyte', 'anobyte.online', 'web developer', 'GitHub developer'],
  authors: [{ name: 'Anointed Agunloye', url: 'https://anobyte.online' }],
  creator: 'Anointed Agunloye',
  publisher: 'Anointed Agunloye',
  robots: 'index, follow',
  openGraph: {
    title: 'Anointed Agunloye - Web Developer Search Portal',
    description: 'Find Anointed Agunloye across GitHub, portfolio, and projects',
    type: 'website',
    url: 'https://anobyte.online',
    siteName: 'Anointed Agunloye Search Portal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anointed Agunloye - Web Developer Search Portal',
    description: 'Find Anointed Agunloye across GitHub, portfolio, and projects',
    creator: '@anointedthedeveloper',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
