import { useHromadyContext } from "../context/HromadyContext.jsx";

export default function Toast() {
  const { toast } = useHromadyContext();
  return (
    <div className="toast-wrap">
      <div className={`toast${toast.type === "error" ? " error" : ""}${toast.visible ? " show" : ""}`}>
        {toast.message}
      </div>
    </div>
  );
}
