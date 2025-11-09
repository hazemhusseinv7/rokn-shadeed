import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: "Rokn Shadeed",
  description: "Rokn Shadeed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={cn(alexandria.variable, "font-alexandria antialiased")}>
        <Header />
        {children}
      </body>
    </html>
  );
}
