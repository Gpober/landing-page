import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Get Your Free Financial Reality Check | I AM CFO',
  description: 'See exactly where your business stands financially in under 10 minutes. Real-time financial intelligence for businesses doing $2M-$25M in revenue.',
  icons: {
    icon: '/Favicon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
