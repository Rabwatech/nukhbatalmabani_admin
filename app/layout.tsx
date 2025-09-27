import "./globals.css";
import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-kufi",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Nokhbat Almabani - نخبة المباني",
  description: "Premium luxury real estate development in Saudi Arabia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${notoKufi.variable} font-noto-kufi antialiased bg-deep-black text-elegant-white`}
      >
        {children}
      </body>
    </html>
  );
}
