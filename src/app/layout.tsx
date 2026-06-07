import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "హై టీవీ | తెలుగు వార్తలు - Breaking Telugu News",
  description: "హై టీవీ - ఆంధ్రప్రదేశ్, తెలంగాణ, జాతీయ, అంతర్జాతీయ, రాజకీయాలు, సినిమా, క్రీడలు మరియు వ్యాపార వార్తలు. HIGH TV Express Telugu News Platform.",
  keywords: "Telugu News, High TV, హై టీవీ, తెలుగు వార్తలు, Breaking News, AP News, Telangana News",
  openGraph: {
    title: "హై టీవీ | Express Telugu News Platform",
    description: "తెలుగు వార్తలు - Latest Breaking News in Telugu",
    type: "website",
    locale: "te_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "హై టీవీ | Express Telugu News",
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
      </body>
    </html>
  );
}
