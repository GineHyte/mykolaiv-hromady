import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    clearTimeout(timerRef.current);
    setToast({ message, type, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2800);
  }, []);

  return { toast, showToast };
}
