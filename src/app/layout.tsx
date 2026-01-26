import type { Metadata } from 'next'
import './globals.css'
import Header from '@/src/components/Header'

export const metadata: Metadata = {
  title: 'Centre for Peace Praxis | Hope, Healing and Resilience',
  description: 'Centre for Peace Praxis - Hope, Healing and Resilience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="icon.ico" type="image/x-icon" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
