import { useHromadyContext } from "../../context/HromadyContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Tabs from "./Tabs.jsx";
import ListPanel from "./ListPanel/ListPanel.jsx";
import FormPanel from "./FormPanel/FormPanel.jsx";
import DetailPanel from "./DetailPanel/DetailPanel.jsx";

export default function Sidebar() {
  const { activeTab } = useHromadyContext();
  const { isAdmin } = useAuth();
  const showForm = activeTab === "add" && isAdmin;

  return (
    <div className="sidebar">
      <Tabs />
      {activeTab === "list" && <ListPanel />}
      {showForm && <FormPanel />}
      {activeTab === "detail" && <DetailPanel />}
    </div>
  );
}
