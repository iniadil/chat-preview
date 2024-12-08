"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatInput from "@/app/components/ChatInput";
import MessageBubble from "@/app/components/MessageBubble";
import socket from "@/app/lib/socket";
import ScheduledMessageForm from "@/app/components/ScheduledMessageForm";

type Message = {
  id: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  timestamp: number;
  edited?: boolean;
  scheduled?: boolean;
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Anon";
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("initMessages", (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    socket.on("messageBroadcast", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageUpdated", (updatedMsg: Message) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
      );
    });

    socket.on("messageDeleted", ({ id }: { id: any }) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });

    return () => {
      socket.off("initMessages");
      socket.off("messageBroadcast");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    };
  }, []);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(),
      sender: name,
      text: text,
      timestamp: Date.now(),
    };
    socket.emit("newMessage", newMessage);
  };

  const handleSendImage = (imageUrl: string) => {
    const newMessage: Message = {
      id: Math.random().toString(),
      sender: name,
      imageUrl: imageUrl,
      timestamp: Date.now(),
    };
    socket.emit("newMessage", newMessage);
  };

  const handleEditMessage = (id: string, newText: string) => {
    socket.emit("editMessage", { id, newText, editor: name });
  };

  const handleDeleteMessage = (id: string) => {
    socket.emit("deleteMessage", { id, requestor: name });
  };

  const handleScheduleMessage = (
    text: string,
    delayMs: number,
    imageUrl?: string
  ) => {
    const id = Math.random().toString();
    socket.emit("scheduleMessage", {
      id,
      sender: name,
      text,
      imageUrl,
      delayMs,
    });
    // Tidak perlu ditambahkan ke messages sekarang, akan muncul saat delay tercapai.
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] border border-green-300 rounded bg-white w-full max-w-2xl mx-auto">
      <div className="flex-grow overflow-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserName={name}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
          />
        ))}
      </div>
      <div className="border-t p-2">
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
        />
        <div className="mt-2">
          <ScheduledMessageForm onSchedule={handleScheduleMessage} />
        </div>
      </div>
    </div>
  );
}
