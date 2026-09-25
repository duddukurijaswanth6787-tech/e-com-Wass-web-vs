import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import "./globals.css";
import { VDQueryProvider } from "@/lib/query/provider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { prefetchStorefrontData } from "@/lib/query/prefetch";
import { fetchThemeCss } from "@/lib/theme/server-theme";
import { GlobalErrorListener } from "@/components/common/GlobalErrorListener";
import { BoutiqueSdkLoader } from "@/components/common/BoutiqueSdkLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Shared Open Graph fields, reused by page-level metadata exports so each
// page can set its own `url` (og:url must match that page's real URL, not
// always the homepage) without duplicating title/description/siteName/etc.
// in every page.tsx. See Next.js's own guidance on overwriting vs.
// inheriting nested metadata fields across route segments.
export const siteOpenGraph = {
  type: "website" as const,
  locale: "en_IN",
  siteName: "Vasanti Creations",
  title: "Vasanti Creations | Premium Boutique & Designer Fashion",
  description: "Official Online Store for Vasanti Creations - Premium women's ethnic wear, designer fashion, and handcrafted collections.",
  images: ["/brand/logo-full.png"],
};

export const metadata: Metadata = {
  title: {
    default: "Vasanti Creations | Premium Boutique & Designer Fashion",
    template: "%s | Vasanti Creations",
  },
  description: "Official Online Store for Vasanti Creations - Premium ethnic wear, designer fashion, and handcrafted collections.",
  openGraph: {
    ...siteOpenGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasanti Creations | Luxury Ethnic Wear & Designer Outfits",
    description: "Official Online Store for Vasanti Creations",
    images: ["/brand/logo-full.png"],
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A fresh QueryClient per request -- this is a server component running on
  // a shared Node process, so reusing the client-side singleton here would
  // mean every concurrent request prefetches into and dehydrates from the
  // same cache object. The singleton from lib/query/client is only for the
  // browser, inside VDQueryProvider.
  const queryClient = new QueryClient();

  // ponytail: prefetch common storefront data server-side so every page
  // hydrates instantly — no duplicate client requests for categories,
  // settings, banners, coupons, reels.
  await prefetchStorefrontData(queryClient);

  // Fetched on the server so the first paint already uses the shop's own
  // colours -- doing this in the browser would paint the defaults and repaint.
  const themeCss = await fetchThemeCss();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vasanti Creations",
    "url": "https://vasanthicreations.in",
  };

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        <Script id="global-error-suppressor" strategy="beforeInteractive">
          {`
            window.addEventListener('error', function(e) {
              if (e && e.message && e.message.indexOf('startTime') !== -1) {
                e.stopImmediatePropagation();
              }
            }, true);
          `}
        </Script>
        {/* Overrides the :root defaults in globals.css. Every value is
            validated as a hex colour server-side before it gets here. */}
        {themeCss && (
          <style
            id="vd-storefront-theme"
            dangerouslySetInnerHTML={{ __html: themeCss }}
          />
        )}

        {/* 1. Load Boutique Master SDK before any user interaction */}
        <Script
          src="https://boutique-api-production-d010.up.railway.app/sdk/v1/boutique-sdk.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col`} suppressHydrationWarning>
        {/* 2. Initialize SDK Gatekeeper & Real-time Enforcer */}
        <Script id="boutique-sdk-init" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              (function initSdk() {
                function run() {
                  if (window.BoutiqueSDK) {
                    if (typeof window.BoutiqueSDK.init === 'function') {
                      window.boutique = window.BoutiqueSDK.init({
                        clientId: "cl_hyd_vasanticreat_3ab4d8",
                        publicKey: "pk_live_52996adda36429e6aa48d824dbdf44ca",
                        apiUrl: "https://boutique-api-production-d010.up.railway.app",
                        whatsappNumber: "919876543210",
                        debug: true
                      });
                    } else {
                      window.boutique = new window.BoutiqueSDK({
                        clientId: "cl_hyd_vasanticreat_3ab4d8",
                        publicKey: "pk_live_52996adda36429e6aa48d824dbdf44ca",
                        apiUrl: "https://boutique-api-production-d010.up.railway.app",
                        whatsappNumber: "919876543210",
                        debug: true
                      });
                    }
                  }
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', run);
                } else {
                  run();
                }
              })();
            }
          `}
        </Script>
        <VDQueryProvider dehydratedState={dehydrate(queryClient)}>
          <AuthProvider>
            <GlobalErrorListener />
            <BoutiqueSdkLoader />
            {children}
          </AuthProvider>
        </VDQueryProvider>
      </body>
    </html>
  );
}
