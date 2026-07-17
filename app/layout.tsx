import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SavedHydrator from "@/components/saved-hydrator";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const title = "TeaBrew — find tea near you, brew it right at home";

export const metadata: Metadata = {
  // Makes the relative OG and canonical URLs below resolve to absolute ones.
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · TeaBrew",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "tea",
    "tea shops near me",
    "tea rooms",
    "brew guide",
    "steeping timer",
    "masala chai",
    "loose leaf tea",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  icons: { icon: "/assets/logo.ico" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    title,
    description: siteDescription,
    url: "/",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
        <SavedHydrator />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
