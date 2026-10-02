import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Rafsan Agro — Premium Agricultural Products",
  description:
    "Rafsan Agro is your trusted source for premium agricultural products including seeds, fertilizers, pesticides, and farm tools. Quality products for better farming in Bangladesh.",
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
    "seeds",
    "fertilizers",
    "pesticides",
    "farm tools",
    "Bangladesh",
    "Rafsan Agro",
    "কৃষি পণ্য",
  ],
  authors: [{ name: "Rafsan Agro" }],
  openGraph: {
    title: "Rafsan Agro — Premium Agricultural Products",
    description: "Quality agricultural products for better farming",
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
