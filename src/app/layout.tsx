import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterClient from "./components/FooterClient";
import CookieConsent from "./components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetroSohbet | İstanbul Metro Sohbet Odaları",
  description: "İstanbul metro hatlarına özel gerçek zamanlı sohbet platformu.",
  robots: { index: true, follow: true },
  openGraph: {
    title: 'MetroSohbet',
    description: 'İstanbul metro hatlarına özel gerçek zamanlı sohbet',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'MetroSohbet'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetroSohbet',
    description: 'İstanbul metro hatlarına özel gerçek zamanlı sohbet'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  let supabaseOrigin = ''
  try { supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : '' } catch {}
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {supabaseOrigin && <link rel="preconnect" href={supabaseOrigin} crossOrigin="" />}
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}`,
          }}
        />
        {children}
        <FooterClient />
        <CookieConsent />
      </body>
    </html>
  );
}
