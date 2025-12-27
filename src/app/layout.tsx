import type { Metadata } from 'next';
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { PageTransition } from "@/components/portfolio/PageTransition";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Projecto | Portfolio",
  description: "A premium, interactive portfolio showcase.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ScrollProgress />
        <Providers>
          <SmoothScroll>
            <CustomCursor />
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster position="bottom-right" richColors />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
