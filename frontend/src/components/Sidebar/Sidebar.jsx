import { useHromadyContext } from "../../context/HromadyContext.jsx";
import Tabs from "./Tabs.jsx";
import ListPanel from "./ListPanel/ListPanel.jsx";
import FormPanel from "./FormPanel/FormPanel.jsx";
import DetailPanel from "./DetailPanel/DetailPanel.jsx";

export default function Sidebar() {
  const { activeTab } = useHromadyContext();

  return (
    <div className="sidebar">
      <Tabs />
      {activeTab === "list" && <ListPanel />}
      {activeTab === "add" && <FormPanel />}
      {activeTab === "detail" && <DetailPanel />}
    </div>
  );
}
