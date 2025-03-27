// components/AlertCard.tsx
"use client";

import React from "react";

// CustomSwitch component styled to look like a radio switch/toggle
const CustomSwitch = () => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      {/* Hidden checkbox */}
      <input type="checkbox" className="sr-only peer" />
      {/* Switch background */}
      <div className="w-10 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-white peer-checked:bg-[#3D8E41] transition-colors"></div>
      {/* Switch handle */}
      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
    </label>
  );
};

export default function AlertCard() {
  return (
    <div className="bg-[#3D8E41] text-white p-4 rounded-md">
      <div className="flex justify-between gap-3 items-center">
        {/* Left Section */}
        <div>
          <div className="text-lg font-bold leading-[26px]">
            UI Designer in Egypt
          </div>
          <div className="text-sm font-normal">70 job positions</div>
        </div>
        {/* Right Section */}
        <div className="flex items-center">
          <CustomSwitch />
          <span className="ml-2 text-sm">Set alert</span>
        </div>
      </div>
    </div>
  );
}
