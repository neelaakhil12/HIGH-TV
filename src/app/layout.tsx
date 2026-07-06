import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalPromotionPopup from "@/components/layout/GlobalPromotionPopup";
import BottomNavBar from "@/components/layout/BottomNavBar";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "High TV | Telugu News - Breaking Telugu News",
  description: "High TV - Latest breaking news in Telugu from Andhra Pradesh, Telangana, India, Politics, Sports, Movies, Health, and Business. HIGH TV Express News Platform.",
  keywords: "Telugu News, High TV, హై టీవీ, తెలుగు వార్తలు, Breaking News, AP News, Telangana News",
  openGraph: {
    title: "High TV | Express Telugu News Platform",
    description: "Telugu News - Latest Breaking News in Telugu",
    type: "website",
    locale: "te_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "High TV | Express Telugu News",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="te" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mandali&family=Noto+Sans+Telugu:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased bg-white text-[#222222]">
        {children}
        <BottomNavBar />
        <GlobalPromotionPopup />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
