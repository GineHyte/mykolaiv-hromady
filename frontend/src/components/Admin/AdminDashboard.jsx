import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useHromadyContext } from "../../context/HromadyContext.jsx";

export default function AdminDashboard({ onClose }) {
  const { user } = useAuth();
  const { showToast } = useHromadyContext();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [overviewData, usersData] = await Promise.all([adminApi.overview(), adminApi.listUsers()]);
      setOverview(overviewData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const runAction = async (id, action) => {
    setBusyId(id);
    try {
      const updated = await action();
      if (updated) {
        setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      } else {
        setUsers((list) => list.filter((u) => u.id !== id));
      }
      showToast("Готово");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
      setConfirmAction(null);
    }
  };

  const handleBanToggle = (target) => {
    if (target.banned) {
      runAction(target.id, () => adminApi.unbanUser(target.id));
    } else {
      setConfirmAction({ type: "ban", target });
    }
  };

  const handleRoleToggle = (target) => {
    const role = target.role === "admin" ? "user" : "admin";
    runAction(target.id, () => adminApi.setRole(target.id, role));
  };

  const handleKick = (target) => {
    runAction(target.id, () => adminApi.kickUser(target.id));
  };

  const handleDelete = (target) => {
    setConfirmAction({ type: "delete", target });
  };

  const confirmPending = () => {
    if (!confirmAction) return;
    const { type, target } = confirmAction;
    if (type === "ban") runAction(target.id, () => adminApi.banUser(target.id));
    if (type === "delete") runAction(target.id, () => adminApi.deleteUser(target.id));
  };

  return (
    <div className="modal-bg show">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>Панель адміністратора</h2>
          <button className="btn btn-sm" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {loading && <div className="empty-state"><p>Завантаження...</p></div>}
        {error && <div className="empty-state"><p>Помилка: {error}</p></div>}

        {!loading && !error && (
          <>
            {overview && (
              <div className="stats-grid admin-stats-grid">
                <div className="stat-card blue"><div className="num">{overview.users}</div><div className="lbl">Користувачів</div></div>
                <div className="stat-card green"><div className="num">{overview.admins}</div><div className="lbl">Адмінів</div></div>
                <div className="stat-card"><div className="num">{overview.banned}</div><div className="lbl">Заблоковано</div></div>
                <div className="stat-card"><div className="num">{overview.hromady}</div><div className="lbl">Громад</div></div>
                <div className="stat-card"><div className="num">{overview.unowned}</div><div className="lbl">Без власника</div></div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Громад</th>
                    <th>Статус</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u.id === user.id;
                    const rowBusy = busyId === u.id;
                    return (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === "admin" ? "badge-blue" : "badge-gray"}`}>
                            {u.role === "admin" ? "Адмін" : "Користувач"}
                          </span>
                        </td>
                        <td>{u.hromadyCount}</td>
                        <td>
                          <span className={`badge ${u.banned ? "badge-red" : "badge-green"}`}>
                            {u.banned ? "Заблоковано" : "Активний"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button
                              className="btn btn-xs"
                              disabled={rowBusy}
                              onClick={() => handleRoleToggle(u)}
                              title={u.role === "admin" ? "Зняти права адміна" : "Зробити адміном"}
                            >
                              <i className="fa-solid fa-user-shield"></i>
                            </button>
                            <button
                              className="btn btn-xs"
                              disabled={rowBusy || isSelf}
                              onClick={() => handleKick(u)}
                              title="Розлогінити (скинути сесії)"
                            >
                              <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                            <button
                              className="btn btn-xs"
                              disabled={rowBusy || isSelf}
                              onClick={() => handleBanToggle(u)}
                              title={u.banned ? "Розблокувати" : "Заблокувати"}
                            >
                              <i className={`fa-solid ${u.banned ? "fa-lock-open" : "fa-lock"}`}></i>
                            </button>
                            <button
                              className="btn btn-xs btn-danger"
                              disabled={rowBusy || isSelf}
                              onClick={() => handleDelete(u)}
                              title="Видалити користувача"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Закрити</button>
        </div>
      </div>

      {confirmAction && (
        <div className="modal-bg show">
          <div className="modal">
            <h2>{confirmAction.type === "delete" ? "Видалити користувача" : "Заблокувати користувача"}</h2>
            <p style={{ color: "var(--text-2)", fontSize: 13, lineHeight: 1.5 }}>
              {confirmAction.type === "delete"
                ? `Ви впевнені, що хочете видалити "${confirmAction.target.email}"? Цю дію неможливо відмінити.`
                : `Заблокувати "${confirmAction.target.email}"? Користувач втратить доступ негайно.`}
            </p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setConfirmAction(null)} disabled={busyId !== null}>Скасувати</button>
              <button className="btn btn-danger" onClick={confirmPending} disabled={busyId !== null}>
                {busyId !== null ? <span className="spinner" style={{ borderTopColor: "var(--red)" }}></span> : "Підтвердити"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
