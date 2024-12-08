// lib/socket.ts
import { io } from "socket.io-client";

// Ganti URL ini dengan IP/Domain server Socket.IO Anda (bukan localhost)
const socket = io("http://54.206.215.134:4000", {
  // withCredentials: true jika butuh mengirim cookie, dsb
});

export default socket;
