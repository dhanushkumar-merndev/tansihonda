import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tansi Digital Manuals",
  description: "Official Honda manuals and documents from Tansi Honda",

  openGraph: {
    title: "Tansi Digital Manuals",
    description: "Official Honda Digital Manuals and Documents - Tansi Honda",
    url: "https://tansihonda.vercel.app",
    siteName: "Tansi Digital Manuals",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tansi Digital Manuals",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tansi Digital Manuals",
    description: "Official Honda Digital Manuals and Documents - Tansi Honda",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
