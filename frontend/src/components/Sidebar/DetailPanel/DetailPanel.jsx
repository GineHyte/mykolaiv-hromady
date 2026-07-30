import { useState } from "react";
import { useHromadyContext } from "../../../context/HromadyContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import ConfirmModal from "../../ConfirmModal.jsx";

export default function DetailPanel() {
  const { selected, startEdit, deleteHromada } = useHromadyContext();
  const { isAdmin } = useAuth();
  const [confirmTarget, setConfirmTarget] = useState(null);

  if (!selected) return null;
  const h = selected;

  return (
    <div className="panel active">
      <div className="panel-body">
        <div className="detail-header">
          <div>
            <div className="detail-name">{h.name}</div>
            <div className="detail-sub">{h.type} громада · {h.district} район</div>
          </div>
          {isAdmin && (
            <div className="detail-actions">
              <button className="btn btn-sm" title="Редагувати" onClick={() => startEdit(h.id)}>
                <i className="fa-solid fa-pen"></i>
              </button>
              <button className="btn btn-sm btn-danger" title="Видалити" onClick={() => setConfirmTarget(h)}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          )}
        </div>

        <div className="info-list">
          {h.head && (
            <div className="info-row">
              <span className="info-key"><i className="fa-solid fa-user" style={{ width: 14 }}></i> Голова</span>
              <span className="info-val">{h.head}</span>
            </div>
          )}
          {h.email && (
            <div className="info-row">
              <span className="info-key"><i className="fa-solid fa-envelope" style={{ width: 14 }}></i> Email</span>
              <span className="info-val"><a href={`mailto:${h.email}`}>{h.email}</a></span>
            </div>
          )}
          {h.phone && (
            <div className="info-row">
              <span className="info-key"><i className="fa-solid fa-phone" style={{ width: 14 }}></i> Телефон</span>
              <span className="info-val">{h.phone}</span>
            </div>
          )}
          {h.site && (
            <div className="info-row">
              <span className="info-key"><i className="fa-solid fa-globe" style={{ width: 14 }}></i> Сайт</span>
              <span className="info-val"><a href={h.site} target="_blank" rel="noreferrer">{h.site}</a></span>
            </div>
          )}
        </div>

        <div className="section-head">
          <i className="fa-solid fa-flag" style={{ color: "var(--green)", marginRight: 6 }}></i>
          Міста-побратими ({h.partners.length})
        </div>
        {h.partners.length > 0 ? h.partners.map((p, i) => (
          <div className="partner-card type-partner" key={i}>
            <div className="pc-name"><i className="fa-solid fa-city" style={{ color: "var(--green)", marginRight: 5 }}></i>{p.city}, {p.country}</div>
            <div className="pc-sub">Угода з {p.year} року</div>
            <div className="pc-tags">
              {p.scope && <span className="badge badge-green">{p.scope}</span>}
              {p.contact && <span className="badge badge-gray"><i className="fa-solid fa-address-book"></i> {p.contact}</span>}
            </div>
          </div>
        )) : (
          <div className="empty-state" style={{ padding: 16 }}>
            <i className="fa-regular fa-circle-xmark" style={{ fontSize: 22 }}></i>
            <p>Немає міст-побратимів</p>
          </div>
        )}

        <div className="section-head" style={{ marginTop: 14 }}>
          <i className="fa-solid fa-file-signature" style={{ color: "var(--blue-mid)", marginRight: 6 }}></i>
          Меморандуми ({h.memos.length})
        </div>
        {h.memos.length > 0 ? h.memos.map((m, i) => (
          <div className="partner-card type-memo" key={i}>
            <div className="pc-name"><i className="fa-solid fa-building-columns" style={{ color: "var(--blue-mid)", marginRight: 5 }}></i>{m.org}</div>
            <div className="pc-sub">Підписано {m.year} · дія до {m.valid}</div>
            <div className="pc-tags">
              {m.type && <span className="badge badge-blue">{m.type}</span>}
              {m.contact && <span className="badge badge-gray"><i className="fa-solid fa-envelope"></i> {m.contact}</span>}
            </div>
          </div>
        )) : (
          <div className="empty-state" style={{ padding: 16 }}>
            <i className="fa-regular fa-circle-xmark" style={{ fontSize: 22 }}></i>
            <p>Немає меморандумів</p>
          </div>
        )}

        {isAdmin && (
          <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
            <button className="btn btn-green btn-block" onClick={() => startEdit(h.id)}>
              <i className="fa-solid fa-pen-to-square"></i> Редагувати дані громади
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        target={confirmTarget}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={async (id) => { await deleteHromada(id); setConfirmTarget(null); }}
      />
    </div>
  );
}
