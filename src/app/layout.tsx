import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import MouseGlowOverlay from "@/components/layout/MouseGlowOverlay";
import GrainOverlay from "@/components/layout/GrainOverlay";
import Footer from "@/components/layout/Footer";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";
import CustomCursor from "@/components/ui/CustomCursor";
import SoundToggle from "@/components/layout/SoundToggle";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = "https://peaklogicdigital.com";
const SITE_TITLE = "PeakLogic Digital — Digital Ascendance Through Precision Code";
const SITE_DESCRIPTION =
  "PeakLogic Digital engineers complete operational ecosystems for ambitious businesses: WebGL-driven web presence, booking systems, brand and print, and automated lead response. We build the art, and engineer the infrastructure.";
const SOCIAL_IMAGE = "/assets/image_2.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | PeakLogic Digital",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "WebGL agency",
    "digital agency",
    "web design",
    "booking systems",
    "brand and print",
    "lead automation",
    "Next.js development",
  ],
  authors: [{ name: "PeakLogic Digital" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "PeakLogic Digital",
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 2048,
        height: 2048,
        alt: "PeakLogic Digital",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0B0E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GrainOverlay />
        <MouseGlowOverlay />
        <CustomCursor />
        <SoundToggle />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
