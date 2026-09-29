import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Patina Studio — ремонт под контролем",
  description: "Отслеживание хода ремонта: прогресс по этапам, визиты строителя, материалы.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
