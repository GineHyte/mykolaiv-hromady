import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useModalDismiss, onBackdropMouseDown } from "../../hooks/useModalDismiss.js";

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useModalDismiss(onClose, !busy);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-bg show" onMouseDown={busy ? undefined : onBackdropMouseDown(onClose)}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <div className="modal-header">
          <h2 id="login-modal-title">Вхід</h2>
          <button type="button" className="btn btn-sm modal-close" onClick={onClose} disabled={busy} aria-label="Закрити">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="fgroup">
            <label htmlFor="login-username">Псевдонім</label>
            <input
              id="login-username"
              type="text"
              autoFocus
              required
              autoComplete="username"
              disabled={busy}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="fgroup">
            <label htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              disabled={busy}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" style={{ color: "var(--red)", fontSize: 13, marginTop: 4 }}>{error}</p>
          )}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose} disabled={busy}>
              Скасувати
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? <span className="spinner"></span> : "Увійти"}
            </button>
          </div>
          {onSwitchToRegister && (
            <p style={{ marginTop: 12, fontSize: 13 }}>
              Немає акаунта?{" "}
              <button type="button" className="btn-link" onClick={onSwitchToRegister} disabled={busy}>
                Зареєструватися
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
