export default function StatsGrid({ hromady }) {
  const linked = hromady.filter((h) => h.partners.length > 0 || h.memos.length > 0).length;
  const totalPartners = hromady.reduce((sum, h) => sum + h.partners.length, 0);
  const totalMemos = hromady.reduce((sum, h) => sum + h.memos.length, 0);

  return (
    <div className="stats-grid">
      <div className="stat-card blue"><div className="num">{hromady.length}</div><div className="lbl">Всього громад</div></div>
      <div className="stat-card green"><div className="num">{linked}</div><div className="lbl">Мають партнерів</div></div>
      <div className="stat-card"><div className="num">{totalPartners}</div><div className="lbl">Міст-побратимів</div></div>
      <div className="stat-card"><div className="num">{totalMemos}</div><div className="lbl">Меморандумів</div></div>
    </div>
  );
}
