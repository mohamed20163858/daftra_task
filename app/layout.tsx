import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import MobileNav from "../components/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daftara Frontend Test Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex">
          {/* Sidebar for desktop*/}
          <aside className="w-[300px] border-r p-4 hidden md:block">
            <Nav />
          </aside>
          {/* Main content */}
          <main className="flex-1 p-4">{children}</main>{" "}
          {/* Mobile navigation icon */}
          <div className="md:hidden p-4">
            <MobileNav />
          </div>
        </div>
      </body>
    </html>
  );
}
