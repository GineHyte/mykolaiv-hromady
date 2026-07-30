import { DISTRICTS, STATUS_OPTIONS } from "../../../constants/options.js";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="filter-bar">
      <input
        placeholder="Пошук..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      <select
        value={filters.district}
        onChange={(e) => setFilters({ ...filters, district: e.target.value })}
      >
        <option value="">Всі райони</option>
        {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    </div>
  );
}
