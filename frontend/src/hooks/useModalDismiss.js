import { useEffect } from "react";

export function useModalDismiss(onClose, active = true) {
  useEffect(() => {
    if (!active) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, active]);
}

export function onBackdropMouseDown(onClose) {
  return (e) => {
    if (e.target === e.currentTarget) onClose();
  };
}
