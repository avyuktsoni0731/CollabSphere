import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/dist/client/script";
import { GoogleAnalytics } from "@/components/GoogleAnalytics"; // path as per your structure

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollabSphere - Find Your Next Team, Project, or Hackathon",
  description:
    "A student collaboration and event discovery platform for college tech communities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_G_ANALYTICS_ID}`}
        />
        <Script strategy="lazyOnload" id="gtag-init">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_G_ANALYTICS_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <GoogleAnalytics />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
