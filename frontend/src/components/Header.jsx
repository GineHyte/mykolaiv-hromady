import { useState } from "react";
import { useHromadyContext } from "../context/HromadyContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import LoginModal from "./Auth/LoginModal.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";

export default function Header() {
  const { hromady } = useHromadyContext();
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const linked = hromady.filter((h) => h.partners.length > 0 || h.memos.length > 0).length;
  const updated = new Date().toLocaleDateString("uk-UA");

  return (
    <header className="header">
      <i className="fa-solid fa-earth-europe header-logo" aria-hidden="true"></i>
      <h1>Моніторинг міжнародних зв'язків громад · Миколаївська область</h1>
      <span className="header-sub">Оновлено: {updated}</span>
      <div className="header-badges">
        <span className="hbadge">{hromady.length} громад</span>
        <span className="hbadge">{linked} мають зв'язки</span>
      </div>
      {isAdmin ? (
        <div className="header-auth">
          <span className="hbadge" title={user.email}>
            <i className="fa-solid fa-user-shield"></i> {user.email}
          </span>
          {isSuperAdmin && (
            <button className="btn btn-sm btn-outline header-auth-btn" onClick={() => setShowAdminDashboard(true)}>
              <i className="fa-solid fa-gauge"></i> Адмін
            </button>
          )}
          <button className="btn btn-sm btn-outline header-auth-btn" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Вийти
          </button>
        </div>
      ) : (
        <button className="btn btn-sm btn-outline header-auth-btn" onClick={() => setShowLogin(true)}>
          <i className="fa-solid fa-right-to-bracket"></i> Вхід
        </button>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showAdminDashboard && <AdminDashboard onClose={() => setShowAdminDashboard(false)} />}
    </header>
  );
}
