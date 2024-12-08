// server.js
const { Server } = require("socket.io");

// Pastikan port 4000 terbuka di EC2
const io = new Server(4000, {
  cors: {
    origin: "http://54.206.215.134:3000", // Ganti dengan domain/IP front-end Anda
    methods: ["GET", "POST"],
  },
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Kirim pesan awal
  socket.emit("initMessages", messages);

  socket.on("newMessage", (msg) => {
    messages.push(msg);
    io.emit("messageBroadcast", msg);
  });

  socket.on("editMessage", ({ id, newText, editor }) => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx > -1) {
      const msg = messages[idx];
      if (msg.sender === editor) {
        msg.text = newText;
        msg.edited = true;
        io.emit("messageUpdated", msg);
      }
    }
  });

  socket.on("deleteMessage", ({ id, requestor }) => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx > -1) {
      const msg = messages[idx];
      if (msg.sender === requestor) {
        messages.splice(idx, 1);
        io.emit("messageDeleted", { id });
      }
    }
  });

  socket.on("scheduleMessage", ({ id, sender, text, imageUrl, delayMs }) => {
    const scheduledMsg = {
      id,
      sender,
      text,
      imageUrl,
      timestamp: Date.now() + delayMs,
      scheduled: true,
    };
    setTimeout(() => {
      scheduledMsg.scheduled = false;
      scheduledMsg.timestamp = Date.now();
      messages.push(scheduledMsg);
      io.emit("messageBroadcast", scheduledMsg);
    }, delayMs);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
