import { emitControl } from "./SocketService";

export const lockComputer = () => {
  emitControl("system/lock");
};

export const mute = () => {
  emitControl("audio/mute");
};
