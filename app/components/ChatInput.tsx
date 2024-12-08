"use client";

import { useState, useRef } from "react";
import axios from "axios";
import uploadImage from "@/app/lib/uploadImage";

export default function ChatInput({
  onSendMessage,
  onSendImage,
}: {
  onSendMessage: (text: string) => void;
  onSendImage: (url: string) => void;
}) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim().length > 0 && !uploading) {
        onSendMessage(text.trim());
        setText("");
      }
    }
  };

  const handleUploadClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const imageUrl = await uploadImage(file, (progress) => {
        // opsional: Anda bisa menambahkan progress bar
        console.log("Progress:", progress);
      });
      setUploading(false);
      if (imageUrl) {
        onSendImage(imageUrl);
      }
    }
  };

  return (
    <div className="flex items-start gap-2">
      <textarea
        className="flex-grow border p-2 rounded resize-none"
        rows={1}
        placeholder="Tulis pesan..."
        value={text}
        disabled={uploading}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleUploadClick}
        className="bg-green-600 text-white p-2 rounded disabled:bg-gray-500"
        disabled={uploading}
      >
        {uploading ? "⏳" : "📷"}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => {
          if (text.trim() && !uploading) {
            onSendMessage(text.trim());
            setText("");
          }
        }}
        className="bg-green-600 text-white p-2 rounded disabled:bg-gray-500"
        disabled={uploading}
      >
        Send
      </button>
    </div>
  );
}
