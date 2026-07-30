import { useHromadyContext } from "../context/HromadyContext.jsx";

export default function Header() {
  const { hromady } = useHromadyContext();
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
    </header>
  );
}
