import type { Metadata } from "next";
import "./globals.css";
import { CompanyProvider } from "@/context/CompanyContext";

export const metadata: Metadata = {
  title: "Entrepreneur AxZ | A Brand by Roychowdhury and Sons",
  description:
    "Reliable Materials. Professional Supply. Built on Trust. Premier supplier of Bricks, Cement, TMT Bars, Sand, Stone Aggregates, Paints, Tiles, and Plumbing materials in Howrah & Kolkata.",
  icons: {
    icon: "/images/updated/Logo.png",
    shortcut: "/images/updated/Logo.png",
    apple: "/images/updated/Logo.png",
  },
  keywords:
    "Entrepreneur AxZ, Roychowdhury and Sons, building materials, construction supplies, Ultratech cement, JSW cement, TMT bars, bricks, M-sand, silver sand, stone aggregate, paints, tiles, plumbing, Howrah, Kolkata",
  openGraph: {
    title: "Entrepreneur AxZ | A Brand by Roychowdhury and Sons",
    description: "Reliable Materials. Professional Supply. Built on Trust.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CompanyProvider>
          {children}
        </CompanyProvider>
      </body>
    </html>
  );
}
