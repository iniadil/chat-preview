// server.js
const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Kirim riwayat pesan ke klien baru
  socket.emit("initMessages", messages);

  socket.on("newMessage", (msg) => {
    messages.push(msg);
    io.emit("messageBroadcast", msg);
  });

  // Edit pesan
  socket.on("editMessage", ({ id, newText, editor }) => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx > -1) {
      const msg = messages[idx];
      // Hanya pengirim asli yang boleh edit
      if (msg.sender === editor) {
        msg.text = newText;
        msg.edited = true;
        io.emit("messageUpdated", msg);
      }
    }
  });

  // Hapus pesan
  socket.on("deleteMessage", ({ id, requestor }) => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx > -1) {
      const msg = messages[idx];
      // Hanya pengirim asli yang boleh hapus
      if (msg.sender === requestor) {
        messages.splice(idx, 1);
        io.emit("messageDeleted", { id });
      }
    }
  });

  // Pesan terjadwal
  socket.on("scheduleMessage", ({ id, sender, text, imageUrl, delayMs }) => {
    // Buat pesan "dummy" yang belum dikirim
    const scheduledMsg = {
      id: id,
      sender: sender,
      text: text,
      imageUrl: imageUrl,
      timestamp: Date.now() + delayMs, // Waktu eksekusi mendatang
      scheduled: true,
    };
    // Kita tidak langsung push ke messages karena belum terkirim.
    setTimeout(() => {
      // Setelah delay, kirim pesan
      scheduledMsg.scheduled = false;
      scheduledMsg.timestamp = Date.now(); // timestamp saat terkirim
      messages.push(scheduledMsg);
      io.emit("messageBroadcast", scheduledMsg);
    }, delayMs);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
