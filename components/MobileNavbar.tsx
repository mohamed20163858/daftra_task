// components/MobileNavbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";

export default function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navItems = [
    { icon: "/mobileHome.svg", text: "Home" },
    { icon: "/mobileJobs.svg", text: "Jobs" },
    { icon: "/mobileEmployers.svg", text: "Employers" },
    { icon: "/mobileNotifications.svg", text: "Notifications" },
    { icon: "/mobileMessaging.svg", text: "Messaging" },
  ];

  // Close menu when clicking outside the menu container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative bg-[#161616] p-4 md:hidden">
      {/* Navbar container */}
      <div className="flex justify-between items-center">
        {/* Profile and hamburger container */}
        <div
          className="relative cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Image src="/profile.svg" alt="Profile" width={40} height={40} />
          {/* Hamburger icon positioned at the bottom-right of the profile icon */}
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
            <FiMenu size={16} className="text-[#161616]" />
          </div>
        </div>
        {/* Logo on the right */}
        <div className="flex-1 flex justify-end">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        </div>
      </div>

      {/* Side Menu Overlay */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "80%" }}
      >
        <div className="bg-white h-full p-4">
          {/* Section 1: Profile Info */}
          <div className="flex items-center pb-4">
            <Image src="/profile.svg" alt="Profile" width={50} height={50} />
            <div className="ml-3">
              <div className="font-bold text-gray-800">Ahmed Amaar</div>
              <div className="text-sm text-gray-500">UX UI designer</div>
            </div>
          </div>
          <hr className="border-gray-200" />
          {/* Section 2: Navigation Items */}
          <div className="py-4 space-y-4">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center font-medium text-[#5B5B5B] text-[14px]"
              >
                <Image src={item.icon} alt={item.text} width={24} height={24} />
                <span className="ml-3">{item.text}</span>
              </div>
            ))}
          </div>
          <hr className="border-gray-200" />
          {/* Section 3: Additional Links */}
          <div className="py-4 space-y-3">
            <a
              href="#"
              className="block text-[#707070] font-medium text-[16px] leading-[150%] align-middle tracking-[0%]"
            >
              Setting and privacy
            </a>
            <a
              href="#"
              className="block text-[#707070] font-medium text-[16px] leading-[150%] align-middle tracking-[0%]"
            >
              Language
            </a>
            <a
              href="#"
              className="block text-[#707070] font-medium text-[16px] leading-[150%] align-middle tracking-[0%]"
            >
              Help
            </a>
          </div>
          <hr className="border-gray-200" />
          {/* Section 4: Logout */}
          <div className="py-4">
            <a
              href="#"
              className="block text-[#ED1F03] font-medium text-[17px] leading-[150%] align-middle tracking-[0%]"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
