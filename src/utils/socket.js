import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const isDevelopment = import.meta.env.DEV;
    const serverUrl = isDevelopment ? "http://localhost:5000" : undefined;
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
