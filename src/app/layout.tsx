import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  display: "swap",
  variable: "--font-inter",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["200", "300"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Zless",
  description: "Zero Limits. Endless Success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSerifJP.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
