import { useEffect, useState } from "react";

export function useShiftPressed() {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        setPressed(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        setPressed(e.shiftKey);
      }
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  });

  return pressed;
}
