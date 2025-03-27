// components/Pagination.tsx
"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination() {
  const squareClasses =
    "flex items-center justify-center w-10 h-10 border border-[#C4C3C3] rounded";
  return (
    <div className="flex items-center space-x-2">
      <button className={`${squareClasses} text-[#707070]`}>
        <FiChevronLeft size={16} />
      </button>
      <button className={`${squareClasses} text-[#707070]`}>1</button>
      <button className={`${squareClasses} bg-[#48A74C] text-white`}>2</button>
      <button className={`${squareClasses} text-[#707070]`}>3</button>
      <button className={`${squareClasses} text-[#707070]`}>
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
