// components/ProfileDropdown.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile list item with icon, text, and a down/up arrow */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center text-center focus:outline-none"
      >
        <div className="flex flex-col items-center text-center">
          <Image
            src="/profile.svg"
            alt="Profile"
            width={24}
            height={24}
            className="mx-auto"
          />
          <div className="flex items-center mt-1">
            <span className="ml-1 text-sm text-[#E6E6E6]">Profile</span>
            {open ? (
              <FiChevronUp className="ml-1 text-[#E6E6E6]" />
            ) : (
              <FiChevronDown className="ml-1 text-[#E6E6E6]" />
            )}
          </div>
        </div>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg">
          {/* First Section */}
          <div className="p-4">
            <a href="#" className="flex items-center">
              <Image src="/profile.svg" alt="Profile" width={40} height={40} />
              <div className="ml-3">
                <div className="font-bold text-gray-800">Ahmed Amaar</div>
                <div className="text-sm text-gray-500">UX UI designer</div>
              </div>
            </a>
          </div>
          <hr className="border-gray-200" />
          {/* Second Section */}
          <div className="p-4 space-y-2">
            <a href="#" className="block text-[#707070] font-medium text-sm">
              Setting and privacy
            </a>
            <a href="#" className="block text-[#707070] font-medium text-sm">
              Language
            </a>
            <a href="#" className="block text-[#707070] font-medium text-sm">
              Help
            </a>
          </div>
          <hr className="border-gray-200" />
          {/* Third Section */}
          <div className="p-4">
            <a href="#" className="block text-[#ED1F03] font-medium text-sm">
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
