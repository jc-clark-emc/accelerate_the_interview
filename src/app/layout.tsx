import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
