"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    // Navigasi ke halaman chat dengan nama sebagai query param
    router.push(`/chat?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <label className="text-lg font-semibold">Masukkan Nama Anda</label>
        <input
          type="text"
          placeholder="Nama..."
          className="border"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Mulai Chat
        </button>
      </form>
    </div>
  );
}
