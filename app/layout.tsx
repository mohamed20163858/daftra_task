import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import MobileNav from "../components/MobileNav";
import DesktopNavbar from "@/components/DesktopNavbar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        className={`${dmSans.variable} text-[#404040] antialiased min-h-screen`}
      >
        <DesktopNavbar />
        <div className=" flex">
          {/* Sidebar for desktop */}
          <aside className="w-[400px] border-r border-[#E9E9E9] py-4 hidden md:block">
            <Nav />
          </aside>
          {/* Main content */}
          <main className="flex-1 p-4">{children}</main>
          {/* Mobile navigation icon */}
          <div className="md:hidden p-4">
            <MobileNav />
          </div>
        </div>
      </body>
    </html>
  );
}
