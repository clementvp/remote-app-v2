import { Socket } from "socket.io-client";
import io from "socket.io-client";

let socket: SocketIOClient.Socket;

export const initSocket = (address: string) => {
  socket = io(address, { reconnection: false });
};

export const subscribeToServer = (cb: () => void) => {
  if (socket) {
    socket.on("connect", () => {
      return cb();
    });
  }
};

export const subscribeToDisconnectServer = (cb: () => void) => {
  if (socket) {
    socket.on("disconnect", () => {
      return cb();
    });
  }
};

export const subscribeToConnexionError = (cb: () => void) => {
  if (socket) {
    socket.on("connect_error", () => {
      return cb();
    });
  }
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const emitControl = (message: string) => {
  if (socket) socket.emit(message);
};

export const getSocketStatus = () => {
  if (socket) return socket.connected;
};
