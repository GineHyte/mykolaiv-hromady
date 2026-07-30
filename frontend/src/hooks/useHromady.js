import { useCallback, useEffect, useState } from "react";
import { hromadyApi } from "../api/hromadyApi.js";

export function useHromady() {
  const [hromady, setHromady] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setHromady(await hromadyApi.list());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(async (data) => {
    const created = await hromadyApi.create(data);
    setHromady((list) => [...list, created]);
    return created;
  }, []);

  const update = useCallback(async (id, data) => {
    const updated = await hromadyApi.update(id, data);
    setHromady((list) => list.map((h) => (h.id === id ? updated : h)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await hromadyApi.remove(id);
    setHromady((list) => list.filter((h) => h.id !== id));
  }, []);

  return { hromady, loading, error, reload, create, update, remove };
}
