import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CT CAMPUS — Mentorship for CLAT, IPMAT & CUET Success",
  description: "CT CAMPUS Karol Bagh offers top-tier academic mentorship for undergraduate law (CLAT/AILET), management (IPMAT), and central university (CUET) entrances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
