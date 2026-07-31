import { useState } from "react";
import { useModalDismiss, onBackdropMouseDown } from "../hooks/useModalDismiss.js";

export default function ConfirmModal({ target, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  useModalDismiss(onCancel, Boolean(target) && !busy);
  if (!target) return null;

  const handleConfirm = async () => {
    setBusy(true);
    await onConfirm(target.id);
    setBusy(false);
  };

  return (
    <div className="modal-bg show" onMouseDown={busy ? undefined : onBackdropMouseDown(onCancel)}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <h2 id="confirm-modal-title">Видалити громаду</h2>
        <p style={{ color: "var(--text-2)", fontSize: 13, lineHeight: 1.5 }}>
          Ви впевнені, що хочете видалити "{target.name}" та всі її дані? Цю дію неможливо відмінити.
        </p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel} disabled={busy}>Скасувати</button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={busy}>
            {busy ? <span className="spinner" style={{ borderTopColor: "var(--red)" }}></span> : "Видалити"}
          </button>
        </div>
      </div>
    </div>
  );
}
