// app/layout.tsx
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/sonner";
import { TranslationProvider } from "@/components/shared/translation-context";
import { SessionProvider } from "next-auth/react";

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"), // 🔴 change this

  title: {
    default: "Review Platform | Find & Review Companies",
    template: "%s | Review Platform",
  },

  description:
    "Discover trusted company reviews, ratings, and user experiences. Share your feedback and explore top-rated businesses.",

keywords: [
  "company reviews",
  "business ratings",
  "customer feedback",
  "review platform",
  "trusted reviews",
  "online reviews",
  "customer reviews website",
  "best review platform",
  "business review site",
  "user reviews and ratings",
  "honest company reviews",
  "top rated companies",
  "real customer experiences",
  "review companies online",
  "write a review",
  "share your experience",
  "find best companies",
  "compare companies",
  "service reviews",
  "product reviews",
  "consumer reviews",
  "verified reviews",
  "local business reviews",
  "global company reviews",
  "review website India",
  "Indian company reviews",
  "top businesses in India",
  "rate companies online",
  "review and rating platform",
  "feedback platform",
],

  authors: [{ name: "Review Platform Team" }],
  creator: "Review Platform",

  openGraph: {
    title: "Review Platform",
    description:
      "Find and share real reviews about companies worldwide.",
    url: "https://yourdomain.com",
    siteName: "Review Platform",
    images: [
      {
        url: "/og-image.png", // add this image in public folder
        width: 1200,
        height: 630,
        alt: "Review Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Review Platform",
    description:
      "Explore company reviews and share your experience.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,   // ✅ allow indexing
    follow: true,  // ✅ allow crawling
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          noto.variable
        )}
      >
        <SessionProvider>
        <TranslationProvider>
        {children}
        <Toaster /> {/* Global Toaster for notifications */}
        </TranslationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}