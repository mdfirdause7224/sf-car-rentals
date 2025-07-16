import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { createServerClient } from "@/lib/supabase/server" // Import server client
import UserMenu from "@/components/auth/user-menu" // Import UserMenu

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SF Car Rentals - Premium Car Rental Service",
  description:
    "Book premium cars instantly. 5-seater and 7-seater cars available with doorstep delivery across 50+ cities. Rated #1 car rental service.",
  keywords: "car rental, car booking, premium cars, 5-seater, 7-seater, doorstep delivery, SF car rentals",
  authors: [{ name: "SF Car Rentals" }],
  creator: "SF Car Rentals",
  publisher: "SF Car Rentals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SF Car Rentals - Premium Car Rental Service",
    description: "Book premium cars instantly. 5-seater and 7-seater cars available with doorstep delivery.",
    siteName: "SF Car Rentals",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SF Car Rentals - Premium Car Rental Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SF Car Rentals - Premium Car Rental Service",
    description: "Book premium cars instantly. 5-seater and 7-seater cars available with doorstep delivery.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SF Car Rentals",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#318cc6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch user session on the server for initial render
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SF Car Rentals" />
        <meta name="msapplication-TileColor" content="#318cc6" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Add UserMenu to the layout */}
          <div className="fixed top-4 right-4 z-50">
            <UserMenu initialSession={session} />
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
