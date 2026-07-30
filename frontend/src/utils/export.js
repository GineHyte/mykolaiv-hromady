function today() {
  return new Date().toISOString().slice(0, 10);
}

function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportCSV(hromady) {
  const rows = [[
    "ID", "Назва", "Тип", "Район", "Голова", "Email", "Телефон",
    "Побратими (к-сть)", "Меморандуми (к-сть)", "Міста-побратими", "Організації",
  ]];
  hromady.forEach((h) => {
    rows.push([
      h.id, h.name, h.type, h.district, h.head || "", h.email || "", h.phone || "",
      h.partners.length, h.memos.length,
      h.partners.map((p) => `${p.city} (${p.country})`).join("; "),
      h.memos.map((m) => m.org).join("; "),
    ]);
  });
  const csv = "﻿" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `monitoring-hromad-${today()}.csv`);
}

export function exportJSON(hromady) {
  download(new Blob([JSON.stringify(hromady, null, 2)], { type: "application/json" }), `monitoring-hromad-${today()}.json`);
}
