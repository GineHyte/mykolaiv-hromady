export default function HromadaCard({ hromada, selected, onClick }) {
  const headFirstNames = hromada.head ? hromada.head.split(" ").slice(0, 2).join(" ") : "";

  return (
    <div className={`hcard${selected ? " selected" : ""}`} onClick={onClick}>
      <div className="hcard-name">{hromada.name}</div>
      <div className="hcard-meta">
        {hromada.type} · {hromada.district} район{headFirstNames && ` · ${headFirstNames}`}
      </div>
      <div className="hcard-badges">
        {hromada.partners.length > 0 && (
          <span className="badge badge-green">
            <i className="fa-solid fa-handshake"></i> {hromada.partners.length} побратим{hromada.partners.length > 1 ? "и" : ""}
          </span>
        )}
        {hromada.memos.length > 0 && (
          <span className="badge badge-blue">
            <i className="fa-solid fa-file-signature"></i> {hromada.memos.length} меморандум{hromada.memos.length > 1 ? "и" : ""}
          </span>
        )}
        {!hromada.partners.length && !hromada.memos.length && (
          <span className="badge badge-gray"><i className="fa-solid fa-minus"></i> Немає зв'язків</span>
        )}
      </div>
    </div>
  );
}
