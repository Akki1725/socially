import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const serverUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    socket = io(serverUrl, {
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
