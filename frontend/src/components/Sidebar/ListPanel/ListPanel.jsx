import { useMemo } from "react";
import { useHromadyContext } from "../../../context/HromadyContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { exportCSV, exportJSON } from "../../../utils/export.js";
import StatsGrid from "./StatsGrid.jsx";
import FilterBar from "./FilterBar.jsx";
import HromadaCard from "./HromadaCard.jsx";

function matchesFilters(h, filters) {
  const q = filters.search.toLowerCase();
  if (q && !h.name.toLowerCase().includes(q)) return false;
  if (filters.district && h.district !== filters.district) return false;
  if (filters.status === "partner" && h.partners.length === 0) return false;
  if (filters.status === "memo" && h.memos.length === 0) return false;
  if (filters.status === "none" && (h.partners.length > 0 || h.memos.length > 0)) return false;
  return true;
}

export default function ListPanel() {
  const { hromady, loading, error, filters, setFilters, selectedId, selectHromada, startAdd } = useHromadyContext();
  const { isAdmin } = useAuth();

  const filtered = useMemo(
    () => hromady.filter((h) => matchesFilters(h, filters)),
    [hromady, filters]
  );

  const clearFilters = () => setFilters({ search: "", district: "", status: "" });

  return (
    <div className="panel active">
      <div className="panel-body">
        <StatsGrid hromady={hromady} />
        <FilterBar filters={filters} setFilters={setFilters} />

        {loading && <div className="empty-state"><p>Завантаження...</p></div>}
        {error && <div className="empty-state"><p>Помилка: {error}</p></div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <i className="fa-solid fa-magnifying-glass"></i>
            <p>Нічого не знайдено.<br />Змініть фільтри або{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); clearFilters(); }}>скиньте пошук</a>.
            </p>
          </div>
        )}

        {!loading && !error && filtered.map((h) => (
          <HromadaCard
            key={h.id}
            hromada={h}
            selected={selectedId === h.id}
            onClick={() => selectHromada(h.id)}
          />
        ))}
      </div>

      <div className="export-row">
        <button className="btn btn-sm" onClick={() => exportCSV(hromady)}><i className="fa-solid fa-download"></i> CSV</button>
        <button className="btn btn-sm" onClick={() => exportJSON(hromady)}><i className="fa-solid fa-code"></i> JSON</button>
        {isAdmin && (
          <button className="btn btn-sm btn-green" onClick={startAdd}><i className="fa-solid fa-plus"></i> Нова громада</button>
        )}
      </div>
    </div>
  );
}
