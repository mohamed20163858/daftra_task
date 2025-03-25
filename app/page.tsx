// app/page.tsx
"use client";

import Nav from "../components/Nav";

export default function HomePage() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop*/}
      <aside className="w-64 border-r p-4 hidden md:block">
        <Nav />
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {/* Main content goes here */}
        <p>Welcome to the Dashboard!</p>
      </main>
    </div>
  );
}
