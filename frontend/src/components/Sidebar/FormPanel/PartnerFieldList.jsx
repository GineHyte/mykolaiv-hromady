let nextKey = 0;
function makeKey() { return `p${++nextKey}`; }

export function emptyPartner() {
  return { key: makeKey(), city: "", country: "", year: "", scope: "", contact: "" };
}

export default function PartnerFieldList({ partners, setPartners }) {
  const update = (key, field, value) => {
    setPartners(partners.map((p) => (p.key === key ? { ...p, [field]: value } : p)));
  };
  const remove = (key) => setPartners(partners.filter((p) => p.key !== key));

  return (
    <>
      {partners.map((p) => (
        <div className="pentry" key={p.key}>
          <div className="pentry-head">
            <span><i className="fa-solid fa-flag" style={{ color: "var(--green)", marginRight: 5 }}></i>Місто-побратим</span>
            <button className="btn btn-xs btn-danger" onClick={() => remove(p.key)}>
              <i className="fa-solid fa-xmark"></i> Видалити
            </button>
          </div>
          <div className="fgrid2">
            <div className="fgroup">
              <label>Назва міста</label>
              <input placeholder="Варшава" value={p.city} onChange={(e) => update(p.key, "city", e.target.value)} />
            </div>
            <div className="fgroup">
              <label>Країна</label>
              <input placeholder="Польща" value={p.country} onChange={(e) => update(p.key, "country", e.target.value)} />
            </div>
          </div>
          <div className="fgrid2">
            <div className="fgroup">
              <label>Рік угоди</label>
              <input placeholder="2020" value={p.year} onChange={(e) => update(p.key, "year", e.target.value)} />
            </div>
            <div className="fgroup">
              <label>Напрям співпраці</label>
              <input placeholder="Освіта, культура" value={p.scope} onChange={(e) => update(p.key, "scope", e.target.value)} />
            </div>
          </div>
          <div className="fgroup">
            <label>Контактна особа / організація</label>
            <input placeholder="Ім'я або назва відділу" value={p.contact} onChange={(e) => update(p.key, "contact", e.target.value)} />
          </div>
        </div>
      ))}
    </>
  );
}
