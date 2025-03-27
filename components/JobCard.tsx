// components/JobCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export interface Job {
  title: string;
  image: string;
  company: string;
  location: string;
  date: string;
  tags: string[];
  footerTags: string[];
}

interface JobCardProps {
  job: Job;
  isFirst?: boolean;
}

export default function JobCard({ job, isFirst = false }: JobCardProps) {
  // For the first card use a background of #48A74C (semi-transparent) ; others white.
  const bgColor = isFirst ? "rgba(72, 167, 76, 0.2)" : "white";

  return (
    <div
      className="border rounded-md p-4"
      style={{ backgroundColor: bgColor, borderColor: "#F0F0F0" }}
    >
      {/* Section 1: Header */}
      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 mr-4">
          <Image
            src={job.image}
            alt={job.company}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div>
          <div className="font-bold text-lg">{job.title}</div>
          <div className="text-sm text-[#14A077]">{job.company}</div>
        </div>
        {/* New Heart Button */}
        <button className="ml-auto rounded-full bg-white border border-[#C4C3C3] p-2">
          <FaHeart size={16} color="#C4C3C3" />
        </button>
      </div>
      {/* Section 2: Details */}
      <div className="mb-4">
        {/* First sub-div: location and date */}
        <div className="mb-2 flex gap-3 text-[#707070] font-normal">
          <div className="flex items-center space-x-2">
            <FiMapPin className="text-sm" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-sm" />
            <span className="text-sm">{job.date}</span>
          </div>
        </div>
        {/* Second sub-div: tags */}
        <div className="flex flex-wrap gap-2 text-[#707070] font-normal">
          {job.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <hr className="border-[#F0F0F0] mb-2" />
      {/* Section 3: Footer */}
      <div className="text-sm text-[#707070] font-normal">
        {job.footerTags.join(" - ")}
      </div>
    </div>
  );
}
