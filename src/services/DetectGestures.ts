import { emitControl } from "./SocketService";
export const horizontalSwipe = (endX: Number, startX: Number) => {
  if (endX > startX) {
    emitControl("audio/next");
  } else {
    emitControl("audio/prev");
  }
};

export const tap = () => {
  emitControl("audio/pause");
};

export const detectDrag = (
  endX: Number,
  endY: Number,
  startX: Number,
  startY: Number
) => {
  if (endY === 0) {
    horizontalSwipe(endX, startX);
  }
};

export const detectVerticalSwipe = (
  y: number,
  triggerY: number,
  previousY: number,
  setTriggerY: (value: React.SetStateAction<number>) => void,
  setPreviousY: (value: React.SetStateAction<number>) => void
) => {
  const diff = previousY - y;

  if (diff < 0) {
    const diff = y - triggerY;
    if (diff > 30) {
      emitControl("audio/vol/down");
      setTriggerY(y);
    }
  }

  if (diff > 0) {
    const diff = triggerY - y;
    if (diff > 30) {
      emitControl("audio/vol/up");
      setTriggerY(y);
    }
  }

  setPreviousY(y);
};
