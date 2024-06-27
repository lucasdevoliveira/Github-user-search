import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UseQueryProvider } from "@/providers/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Github user search",
  description: "Github user search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UseQueryProvider>
        <body className={`${inter.className} dark:bg-[#000]`}>{children}</body>
      </UseQueryProvider>
    </html>
  );
}
