// app/page.tsx
"use client";
import SortByDropdown from "@/components/SortByDropdown";
import AlertCard from "@/components/AlertCard";
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-4">
        <SortByDropdown />
      </div>
      <div className="hidden md:block">
        <AlertCard />
      </div>
    </div>
  );
}
