import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://saas-biolink.vercel.app'),
  title: {
    default: 'BioLink — Create your free bio link page',
    template: '%s | BioLink'
  },
  description: 'The simplest way to share all your links in one place. Custom themes, click analytics, and an AI bio generator — free forever.',
  keywords: ['bio link', 'linktree alternative', 'link in bio', 'free bio page'],
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saas-biolink.vercel.app',
    siteName: 'BioLink',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'BioLink'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BioLink',
    description: 'The simplest way to share all your links in one place.',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
