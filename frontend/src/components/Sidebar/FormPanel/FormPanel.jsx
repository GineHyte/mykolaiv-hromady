import { useEffect, useState } from "react";
import { useHromadyContext } from "../../../context/HromadyContext.jsx";
import { DISTRICTS, TYPES } from "../../../constants/options.js";
import PartnerFieldList, { emptyPartner } from "./PartnerFieldList.jsx";
import MemoFieldList, { emptyMemo } from "./MemoFieldList.jsx";

const BLANK_FIELDS = {
  name: "", type: "Міська", district: "Миколаївський",
  head: "", email: "", phone: "", site: "", coordsText: "",
};

let keyCounter = 0;
const withKey = (item) => ({ ...item, key: `k${++keyCounter}` });

export default function FormPanel() {
  const {
    editingId, editing, saveHromada, showToast,
    pickCoordsMode, setPickCoordsMode, pickedCoords, setPickedCoords,
  } = useHromadyContext();
  const [fields, setFields] = useState(BLANK_FIELDS);
  const [partners, setPartners] = useState([]);
  const [memos, setMemos] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!pickedCoords) return;
    setFields((f) => ({ ...f, coordsText: `${pickedCoords[0].toFixed(6)}, ${pickedCoords[1].toFixed(6)}` }));
    setPickedCoords(null);
  }, [pickedCoords, setPickedCoords]);

  useEffect(() => {
    if (editingId && editing) {
      setFields({
        name: editing.name,
        type: editing.type,
        district: editing.district,
        head: editing.head || "",
        email: editing.email || "",
        phone: editing.phone || "",
        site: editing.site || "",
        coordsText: editing.coords ? editing.coords.join(", ") : "",
      });
      setPartners((editing.partners || []).map(withKey));
      setMemos((editing.memos || []).map(withKey));
    } else {
      setFields(BLANK_FIELDS);
      setPartners([]);
      setMemos([]);
    }
  }, [editingId, editing]);

  const clearForm = () => {
    setFields(BLANK_FIELDS);
    setPartners([]);
    setMemos([]);
  };

  const setField = (name, value) => setFields((f) => ({ ...f, [name]: value }));

  const handleSave = async () => {
    if (!fields.name.trim()) {
      showToast("Вкажіть назву громади", "error");
      return;
    }

    let coords = null;
    if (fields.coordsText.trim()) {
      const parts = fields.coordsText.split(",").map((s) => parseFloat(s.trim()));
      if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) coords = parts;
    }

    setSaving(true);
    await saveHromada({
      name: fields.name.trim(),
      type: fields.type,
      district: fields.district,
      head: fields.head.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      site: fields.site.trim(),
      coords,
      partners: partners.filter((p) => p.city.trim()).map(({ key, ...p }) => p),
      memos: memos.filter((m) => m.org.trim()).map(({ key, ...m }) => m),
    });
    setSaving(false);
  };

  return (
    <div className="panel active">
      <div className="panel-body">
        <div className="fgroup">
          <label>Назва громади <span className="required">*</span></label>
          <input placeholder="Наприклад: Миколаївська міська" value={fields.name} onChange={(e) => setField("name", e.target.value)} />
        </div>
        <div className="fgrid2">
          <div className="fgroup">
            <label>Тип</label>
            <select value={fields.type} onChange={(e) => setField("type", e.target.value)}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="fgroup">
            <label>Район</label>
            <select value={fields.district} onChange={(e) => setField("district", e.target.value)}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="fgroup">
          <label>Голова громади</label>
          <input placeholder="Прізвище Ім'я По-батькові" value={fields.head} onChange={(e) => setField("head", e.target.value)} />
        </div>
        <div className="fgrid2">
          <div className="fgroup">
            <label>Email</label>
            <input type="email" placeholder="rada@gromada.gov.ua" value={fields.email} onChange={(e) => setField("email", e.target.value)} />
          </div>
          <div className="fgroup">
            <label>Телефон</label>
            <input placeholder="+380 512 000000" value={fields.phone} onChange={(e) => setField("phone", e.target.value)} />
          </div>
        </div>
        <div className="fgroup">
          <label>Вебсайт</label>
          <input placeholder="https://gromada.gov.ua" value={fields.site} onChange={(e) => setField("site", e.target.value)} />
        </div>
        <div className="fgroup">
          <label>Координати на карті (lat, lng)</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              style={{ flex: 1 }}
              placeholder="47.1234, 31.9876"
              title="Широта і довгота через кому"
              value={fields.coordsText}
              onChange={(e) => setField("coordsText", e.target.value)}
            />
            <button
              type="button"
              className={`btn btn-sm${pickCoordsMode ? " btn-primary" : ""}`}
              title="Поставити точку на карті"
              onClick={() => setPickCoordsMode(!pickCoordsMode)}
            >
              <i className="fa-solid fa-location-dot"></i> {pickCoordsMode ? "Обираю…" : "На карті"}
            </button>
          </div>
        </div>

        <div className="form-section-title">
          <span><i className="fa-solid fa-flag" style={{ marginRight: 5, color: "var(--green)" }}></i>Міста-побратими</span>
          <button className="btn btn-sm btn-green" onClick={() => setPartners([...partners, emptyPartner()])}>
            <i className="fa-solid fa-plus"></i> Додати
          </button>
        </div>
        <PartnerFieldList partners={partners} setPartners={setPartners} />

        <div className="form-section-title">
          <span><i className="fa-solid fa-file-signature" style={{ marginRight: 5, color: "var(--blue)" }}></i>Меморандуми / угоди</span>
          <button className="btn btn-sm btn-primary btn-outline" onClick={() => setMemos([...memos, emptyMemo()])}>
            <i className="fa-solid fa-plus"></i> Додати
          </button>
        </div>
        <MemoFieldList memos={memos} setMemos={setMemos} />

        <div className="btn-row">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner"></span> : <i className="fa-solid fa-floppy-disk"></i>} Зберегти
          </button>
          <button className="btn" onClick={clearForm}><i className="fa-solid fa-rotate-left"></i> Очистити</button>
        </div>
      </div>
    </div>
  );
}
