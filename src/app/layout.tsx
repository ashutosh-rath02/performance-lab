import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/ui/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Performance Testing Lab",
  description: "A comprehensive performance testing environment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
