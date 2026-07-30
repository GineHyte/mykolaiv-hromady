import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-bg show">
      <div className="modal">
        <h2>Вхід для адміністратора</h2>
        <form onSubmit={handleSubmit}>
          <div className="fgroup">
            <label>Email</label>
            <input
              type="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="fgroup">
            <label>Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p style={{ color: "var(--red)", fontSize: 13, marginTop: 4 }}>{error}</p>
          )}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose} disabled={busy}>
              Скасувати
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? <span className="spinner"></span> : "Увійти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
