import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DigiAgent — Your AI layer for money",
  description:
    "Earn, send, and grow — just ask. The autonomous commerce agent platform for creators, freelancers, and small businesses.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0F0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-text-primary font-body">
        <Providers>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#111812",
                color: "#F0F7EC",
                border: "1px solid #1F3326",
                borderRadius: "12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
