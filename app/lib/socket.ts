// lib/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Sesuaikan dengan alamat server

export default socket;
