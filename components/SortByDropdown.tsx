// components/SortByDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function SortByDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Top match");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="hidden relative md:inline-block text-left "
    >
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none"
      >
        <span>Sorting by: </span>
        <span className="ml-1" style={{ color: "#48A74C" }}>
          {selected}
        </span>
        <FiChevronDown className="ml-2" />
      </button>
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {["Top match", "Newest", "Latest"].map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 text-sm hover:bg-[#D8D8D8] cursor-pointer"
                style={{ color: selected === option ? "#48A74C" : "#707070" }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
