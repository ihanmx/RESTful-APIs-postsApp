import { Server } from "socket.io";
import corsOptions from "./corsOptions.js";

let io;

export const init = (httpServer) => {
  io = new Server(httpServer, { cors: corsOptions });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
