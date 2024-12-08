"use client";

import { useState } from "react";

export default function ScheduledMessageForm({
  onSchedule,
}: {
  onSchedule: (text: string, delayMs: number, imageUrl?: string) => void;
}) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const delayMs = (h * 3600 + m * 60 + s) * 1000;
    if (!text.trim() && !imageUrl.trim()) return; // Harus ada text atau image
    onSchedule(text.trim(), delayMs, imageUrl.trim() || undefined);
    setText("");
    setImageUrl("");
    setHours("0");
    setMinutes("0");
    setSeconds("0");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border p-2 rounded bg-green-50"
    >
      <div className="font-semibold">Pesan Terjadwal</div>
      <input
        type="text"
        placeholder="Pesan..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-1 rounded"
      />
      <input
        type="text"
        placeholder="URL Gambar (opsional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border p-1 rounded"
      />
      <div className="flex gap-2 items-center">
        <div>
          <label className="text-sm">Jam: </label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-16 border p-1 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="text-sm">Menit: </label>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-16 border p-1 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="text-sm">Detik: </label>
          <input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="w-16 border p-1 rounded"
            min={0}
          />
        </div>
      </div>
      <button type="submit" className="bg-green-600 text-white p-2 rounded">
        Jadwalkan
      </button>
    </form>
  );
}
