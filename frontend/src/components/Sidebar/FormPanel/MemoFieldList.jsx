let nextKey = 0;
function makeKey() { return `m${++nextKey}`; }

export function emptyMemo() {
  return { key: makeKey(), org: "", type: "", year: "", valid: "", contact: "" };
}

export default function MemoFieldList({ memos, setMemos }) {
  const update = (key, field, value) => {
    setMemos(memos.map((m) => (m.key === key ? { ...m, [field]: value } : m)));
  };
  const remove = (key) => setMemos(memos.filter((m) => m.key !== key));

  return (
    <>
      {memos.map((m) => (
        <div className="pentry" key={m.key}>
          <div className="pentry-head">
            <span><i className="fa-solid fa-file-signature" style={{ color: "var(--blue-mid)", marginRight: 5 }}></i>Меморандум</span>
            <button className="btn btn-xs btn-danger" onClick={() => remove(m.key)}>
              <i className="fa-solid fa-xmark"></i> Видалити
            </button>
          </div>
          <div className="fgroup">
            <label>Назва організації</label>
            <input placeholder="Назва міжнародної організації або міста" value={m.org} onChange={(e) => update(m.key, "org", e.target.value)} />
          </div>
          <div className="fgroup">
            <label>Тип / предмет співпраці</label>
            <input placeholder="Технічна допомога, відбудова, освіта" value={m.type} onChange={(e) => update(m.key, "type", e.target.value)} />
          </div>
          <div className="fgrid2">
            <div className="fgroup">
              <label>Рік підписання</label>
              <input placeholder="2023" value={m.year} onChange={(e) => update(m.key, "year", e.target.value)} />
            </div>
            <div className="fgroup">
              <label>Дія до (рік)</label>
              <input placeholder="2026" value={m.valid} onChange={(e) => update(m.key, "valid", e.target.value)} />
            </div>
          </div>
          <div className="fgroup">
            <label>Контакт / email організації</label>
            <input placeholder="contact@org.eu" value={m.contact} onChange={(e) => update(m.key, "contact", e.target.value)} />
          </div>
        </div>
      ))}
    </>
  );
}
