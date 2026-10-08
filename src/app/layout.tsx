import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Rafsan Agro — A Trusted Friend to Farmers & Modern Agriculture",
  description:
    "Rafsan Agro advances modern agriculture while fostering warm, lifelong relationships with farmers. Providing quality seeds, balanced crop care, and expert farming guidance across Bangladesh.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  keywords: [
    "agricultural products",
    "farmers friend",
    "seeds",
    "fertilizers",
    "pesticides",
    "modern farming",
    "Bangladesh",
    "Rafsan Agro",
    "কৃষকের বন্ধু",
    "আধুনিক কৃষি",
    "কৃষি পণ্য",
  ],
  authors: [{ name: "Rafsan Agro" }],
  openGraph: {
    title: "Rafsan Agro — A Trusted Friend to Farmers & Modern Agriculture",
    description: "Advancing agriculture while fostering friendly, caring relationships with farmers across Bangladesh.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
