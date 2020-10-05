import { emitControl } from "./SocketService";

export const lockComputer = () => {
  emitControl("system/lock");
};
