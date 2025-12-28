import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Interview Accelerator | Engineer My Career",
    template: "%s | Interview Accelerator",
  },
  description:
    "Land your dream job in 14 days with our proven job search system. Get 10 targeted applications, 60 networking messages, and interview-ready STAR stories.",
  keywords: [
    "job search",
    "interview preparation",
    "career coaching",
    "networking",
    "resume",
    "STAR method",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
