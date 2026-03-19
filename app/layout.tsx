import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Ayaung Snack Box",
  description: "Mandalay's Favorite Snacks",
  manifest: "/manifest.json",
  themeColor: "#FF6B00",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ayaung",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
