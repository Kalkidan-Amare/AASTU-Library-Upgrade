import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import Providers from "@/components/providers/tanstack-provider";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "AASTU Library",
  description:
    "Streamline library operations with a comprehensive system for managing students, books, and insightful analytics, offering seamless book checkouts, returns, borrowing records, and data-driven insights for enhanced library efficiency.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "AASTU Library",
    description:
      "Streamline library operations with a comprehensive system for managing students, books, and insightful analytics, offering seamless book checkouts, returns, borrowing records, and data-driven insights for enhanced library efficiency.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AASTU Library",
    description:
      "Streamline library operations with a comprehensive system for managing students, books, and insightful analytics, offering seamless book checkouts, returns, borrowing records, and data-driven insights for enhanced library efficiency.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster/>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
