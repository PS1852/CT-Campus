import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ctcampus.co.in'),
  title: "CT CAMPUS — Mentorship for CLAT, IPMAT & CUET Success",
  description: "CT CAMPUS Karol Bagh offers top-tier academic mentorship for undergraduate law (CLAT/AILET), management (IPMAT), and central university (CUET) entrances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
