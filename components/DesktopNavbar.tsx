// components/DesktopNavbar.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";

interface NavItemProps {
  icon: string;
  label: string;
}

const NavItem = ({ icon, label }: NavItemProps) => {
  return (
    <Link href="#">
      <div className="flex flex-col items-center text-center">
        <Image
          src={icon}
          alt={label}
          width={24}
          height={24}
          className="mx-auto"
        />
        <span className="mt-1 text-sm" style={{ color: "#E6E6E6" }}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default function DesktopNavbar() {
  return (
    <nav
      className="hidden min-[820px]:flex items-center justify-between px-[50px] py-3"
      style={{ backgroundColor: "#161616" }}
    >
      {/* Left side: Logo and Search Bar */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        </div>
        {/* Search Bar with icon on the left */}
        <div className="relative">
          <div
            className="absolute left-1 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "#48A74C" }}
          >
            <Image src="/search.svg" alt="Search" width={16} height={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name, job title, ..."
            className="bg-white pl-12 pr-4 py-2 rounded-full placeholder-[#E6E6E6] focus:outline-none"
          />
        </div>
      </div>

      {/* Right side: Navigation links */}
      <div className="flex items-center space-x-6">
        <NavItem icon="/home.svg" label="Home" />
        <NavItem icon="/jobs.svg" label="Jobs" />
        <NavItem icon="/employers.svg" label="Employers" />
        {/* Vertical Separator */}
        <div className="h-8 border-l border-[#E6E6E6]" />
        <NavItem icon="/notifications.svg" label="Notifications" />
        <NavItem icon="/messaging.svg" label="Messaging" />
        <ProfileDropdown />
      </div>
    </nav>
  );
}
