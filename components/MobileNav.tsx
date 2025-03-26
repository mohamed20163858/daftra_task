// components/MobileNav.tsx
"use client";

import { useState } from "react";
import Nav from "./Nav";
import { FiMenu, FiX } from "react-icons/fi";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger menu icon aligned to the right */}
      <div className="flex justify-end md:hidden p-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2"
          aria-label="Open Menu"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Overlay for mobile navigation */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-800 bg-opacity-75">
          <div
            className={`w-64 bg-white h-full transform transition-transform duration-300 ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-end p-2">
              <button onClick={() => setOpen(false)} aria-label="Close Menu">
                <FiX size={24} />
              </button>
            </div>
            <Nav />
          </div>
        </div>
      )}
    </>
  );
}
