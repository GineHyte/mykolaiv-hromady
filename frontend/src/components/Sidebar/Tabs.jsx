import { useHromadyContext } from "../../context/HromadyContext.jsx";

export default function Tabs() {
  const { activeTab, setActiveTab, editingId, selected } = useHromadyContext();

  return (
    <div className="sidebar-tabs">
      <button
        className={`stab${activeTab === "list" ? " active" : ""}`}
        onClick={() => setActiveTab("list")}
      >
        <i className="fa-solid fa-list-ul"></i> Список
      </button>
      <button
        className={`stab${activeTab === "add" ? " active" : ""}`}
        onClick={() => setActiveTab("add")}
      >
        <i className="fa-solid fa-plus"></i> {editingId ? "Редагувати" : "Додати"}
      </button>
      {selected && (
        <button
          className={`stab${activeTab === "detail" ? " active" : ""}`}
          onClick={() => setActiveTab("detail")}
        >
          <i className="fa-solid fa-circle-info"></i> Картка
        </button>
      )}
    </div>
  );
}
