import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useHromadyContext } from "../context/HromadyContext.jsx";
import { resolveCoords } from "../utils/coords.js";

const FILTER_PILLS = [
  { value: "all", label: "Всі" },
  { value: "partner", label: "Є побратими" },
  { value: "memo", label: "Є меморандуми" },
  { value: "none", label: "Без зв'язків" },
];

function markerColor(h) {
  if (h.partners.length > 0) return "#1a7a4a";
  if (h.memos.length > 0) return "#1a56a0";
  return "#94a3b8";
}

function makeIcon(color, selected) {
  const size = selected ? 18 : 14;
  const border = selected ? "3px solid #fff" : "2px solid rgba(255,255,255,.9)";
  const shadow = selected ? `0 0 0 3px ${color}, 0 2px 8px rgba(0,0,0,.4)` : "0 1px 4px rgba(0,0,0,.25)";
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border};box-shadow:${shadow};transition:all .2s"></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToSelected({ selected }) {
  const map = useMap();
  if (selected) {
    const coords = resolveCoords(selected);
    if (coords) map.setView(coords, 11, { animate: true });
  }
  return null;
}

function matchesFilter(h, mapFilter) {
  if (mapFilter === "partner") return h.partners.length > 0;
  if (mapFilter === "memo") return h.memos.length > 0 && h.partners.length === 0;
  if (mapFilter === "none") return h.partners.length === 0 && h.memos.length === 0;
  return true;
}

export default function MapView() {
  const { hromady, mapFilter, setMapFilter, selectedId, selected, selectHromada } = useHromadyContext();

  const visible = useMemo(
    () => hromady.filter((h) => matchesFilter(h, mapFilter)),
    [hromady, mapFilter]
  );

  return (
    <div className="map-area">
      <MapContainer id="map" center={[47.2, 31.9]} zoom={8} zoomControl>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FlyToSelected selected={selected} />
        {visible.map((h) => (
          <Marker
            key={h.id}
            position={resolveCoords(h)}
            icon={makeIcon(markerColor(h), h.id === selectedId)}
            eventHandlers={{ click: () => selectHromada(h.id) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{h.name}</div>
              <div style={{ fontSize: 11, color: "#555" }}>{h.type} · {h.district} р-н</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>
                {h.partners.length > 0 && (
                  <span style={{ color: "#1a7a4a" }}>■ {h.partners.length} побратим{h.partners.length > 1 ? "и" : ""}  </span>
                )}
                {h.memos.length > 0 && (
                  <span style={{ color: "#1a56a0" }}>■ {h.memos.length} меморандум{h.memos.length > 1 ? "и" : ""}</span>
                )}
                {!h.partners.length && !h.memos.length && (
                  <span style={{ color: "#94a3b8" }}>Немає зв'язків</span>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-controls">
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill.value}
            className={`map-filter-pill${mapFilter === pill.value ? " active" : ""}`}
            onClick={() => setMapFilter(pill.value)}
          >
            {pill.label}
          </button>
        ))}
      </div>

      <div className="map-legend">
        <h4>Легенда</h4>
        <div className="leg-item"><div className="leg-dot" style={{ background: "#1a7a4a" }}></div>Є міста-побратими</div>
        <div className="leg-item"><div className="leg-dot" style={{ background: "#1a56a0" }}></div>Лише меморандуми</div>
        <div className="leg-item"><div className="leg-dot" style={{ background: "#94a3b8" }}></div>Немає зв'язків</div>
      </div>
    </div>
  );
}
