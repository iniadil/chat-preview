import clsx from "clsx";
import { useState } from "react";

type Message = {
  id: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  timestamp: number;
  edited?: boolean;
  scheduled?: boolean;
};

export default function MessageBubble({
  message,
  currentUserName,
  onEdit,
  onDelete,
}: {
  message: Message;
  currentUserName: string;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}) {
  const isOwn = message.sender === currentUserName;
  const [hover, setHover] = useState(false);

  const handleEditClick = () => {
    const newText = prompt("Edit pesan:", message.text);
    if (newText !== null && newText.trim() !== "") {
      onEdit(message.id, newText.trim());
    }
  };

  const handleDeleteClick = () => {
    if (confirm("Hapus pesan ini?")) {
      onDelete(message.id);
    }
  };

  return (
    <div
      className={clsx(
        "max-w-xs break-words p-2 rounded shadow relative",
        isOwn ? "ml-auto bg-green-100" : "mr-auto bg-gray-100"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="text-sm font-semibold text-green-800 mb-1">
        {message.sender}
        {message.edited ? " (edited)" : ""}
      </div>
      {message.text && <div>{message.text}</div>}
      {message.imageUrl && (
        <div className="mt-2">
          <img src={message.imageUrl} alt="uploaded" className="rounded" />
        </div>
      )}
      {isOwn && hover && (
        <div className="absolute top-1 right-1 flex space-x-2 text-xs">
          <button
            className="bg-white border px-1 rounded"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button
            className="bg-white border px-1 rounded"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
