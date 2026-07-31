import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useModalDismiss, onBackdropMouseDown } from "../../hooks/useModalDismiss.js";

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useModalDismiss(onClose, !busy);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }
    setBusy(true);
    try {
      await register(username, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-bg show" onMouseDown={busy ? undefined : onBackdropMouseDown(onClose)}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="register-modal-title">
        <div className="modal-header">
          <h2 id="register-modal-title">Реєстрація</h2>
          <button type="button" className="btn btn-sm modal-close" onClick={onClose} disabled={busy} aria-label="Закрити">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="fgroup">
            <label htmlFor="register-username">Псевдонім</label>
            <input
              id="register-username"
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
            <label htmlFor="register-password">Пароль</label>
            <input
              id="register-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={busy}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="fgroup">
            <label htmlFor="register-confirm-password">Підтвердження пароля</label>
            <input
              id="register-confirm-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={busy}
              aria-invalid={mismatch}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {mismatch && (
              <p role="alert" style={{ color: "var(--red)", fontSize: 12, marginTop: 4 }}>
                Паролі не співпадають
              </p>
            )}
          </div>
          {error && (
            <p role="alert" style={{ color: "var(--red)", fontSize: 13, marginTop: 4 }}>{error}</p>
          )}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose} disabled={busy}>
              Скасувати
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? <span className="spinner"></span> : "Зареєструватися"}
            </button>
          </div>
          {onSwitchToLogin && (
            <p style={{ marginTop: 12, fontSize: 13 }}>
              Вже є акаунт?{" "}
              <button type="button" className="btn-link" onClick={onSwitchToLogin} disabled={busy}>
                Увійти
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
