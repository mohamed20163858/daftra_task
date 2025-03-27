// components/MobileNav.tsx
"use client";

import { useState } from "react";
import Nav from "./Nav";
import { FiMenu } from "react-icons/fi";
import AlertCard from "./AlertCard";
// import { Fix } from "react-icons/fi";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger menu icon aligned to the right */}
      <div className="flex justify-between md:hidden w-full ">
        <AlertCard />
        <button
          onClick={() => setOpen(true)}
          className="p-2 border border-[#F0F0F0]"
          aria-label="Open Menu"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Always render the overlay; control its visibility via classes */}
      <div
        className={`fixed inset-0 z-50 flex justify-end bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full bg-white h-full transform transition-transform duration-300 pt-4 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* <div className="flex justify-end p-2">
            <button onClick={() => setOpen(false)} aria-label="Close Menu">
              <FiX size={24} />
            </button>
          </div> */}
          <Nav setOpen={setOpen} />
        </div>
      </div>
    </>
  );
}
