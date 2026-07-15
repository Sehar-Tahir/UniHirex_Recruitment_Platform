import { useState, useEffect } from "react";

const STORAGE_KEY = "unihirex_saved_candidates";

function loadSaved() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function useSavedCandidates() {
  const [savedIds, setSavedIds] = useState(loadSaved);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const isSaved = (id) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
}