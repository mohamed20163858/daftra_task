// app/page.tsx
"use client";
import SortByDropdown from "@/components/SortByDropdown";
import AlertCard from "@/components/AlertCard";
import JobCard, { Job } from "../components/JobCard";

export default function HomePage() {
  const jobs: Job[] = [
    {
      title: "Gaming UI designer",
      image: "/companies/rockstar-games.svg",
      company: "Rockstar Games",
      location: "ElMansoura, Egypt",
      date: "10 days ago",
      tags: ["0 - 3y of exp", "Full-time", "Remote"],
      footerTags: [
        "Creative / Design",
        "  IT / Software development",
        "Gaming",
      ],
    },
    {
      title: "Senior UX UI Designer",
      image: "/companies/egabi.svg",
      company: "Egabi",
      location: "Cairo, Egypt",
      date: "month ago",
      tags: ["0 - 3y of exp", "Full-time", "Hybrid"],
      footerTags: ["Creative / Design", "  IT / Software development"],
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-4">
        <SortByDropdown />
      </div>
      <div className="hidden md:block">
        <AlertCard />
      </div>
      <div className="p-4 space-y-4">
        {jobs.map((job, idx) => (
          <JobCard key={idx} job={job} isFirst={idx === 0} />
        ))}
      </div>
    </div>
  );
}
