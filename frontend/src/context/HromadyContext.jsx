import { createContext, useContext, useMemo, useState } from "react";
import { useHromady } from "../hooks/useHromady.js";
import { useToast } from "../hooks/useToast.js";

const HromadyContext = createContext(null);

export function HromadyProvider({ children }) {
  const data = useHromady();
  const { toast, showToast } = useToast();

  const [activeTab, setActiveTab] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mapFilter, setMapFilter] = useState("all");
  const [filters, setFilters] = useState({ search: "", district: "", status: "" });
  const [pickCoordsMode, setPickCoordsMode] = useState(false);
  const [pickedCoords, setPickedCoords] = useState(null);

  const selectHromada = (id) => {
    setSelectedId(id);
    setActiveTab("detail");
  };

  const startAdd = () => {
    setEditingId(null);
    setActiveTab("add");
  };

  const startEdit = (id) => {
    setEditingId(id);
    setActiveTab("add");
  };

  const saveHromada = async (formData) => {
    try {
      if (editingId) {
        await data.update(editingId, { ...formData, id: editingId });
        showToast("Дані оновлено");
      } else {
        await data.create(formData);
        showToast("Громаду додано");
      }
      setEditingId(null);
      setActiveTab("list");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const deleteHromada = async (id) => {
    try {
      await data.remove(id);
      if (selectedId === id) setSelectedId(null);
      setActiveTab("list");
      showToast("Громаду видалено");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const selected = useMemo(
    () => data.hromady.find((h) => h.id === selectedId) || null,
    [data.hromady, selectedId]
  );

  const editing = useMemo(
    () => data.hromady.find((h) => h.id === editingId) || null,
    [data.hromady, editingId]
  );

  const value = {
    ...data,
    toast,
    showToast,
    activeTab,
    setActiveTab,
    selectedId,
    selected,
    editingId,
    editing,
    mapFilter,
    setMapFilter,
    filters,
    setFilters,
    pickCoordsMode,
    setPickCoordsMode,
    pickedCoords,
    setPickedCoords,
    selectHromada,
    startAdd,
    startEdit,
    saveHromada,
    deleteHromada,
  };

  return <HromadyContext.Provider value={value}>{children}</HromadyContext.Provider>;
}

export function useHromadyContext() {
  const ctx = useContext(HromadyContext);
  if (!ctx) throw new Error("useHromadyContext must be used within HromadyProvider");
  return ctx;
}
