import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toggleSavedCandidate as toggleSavedCandidateAPI, getMyProfile } from "../api/users";

export function useSavedCandidates() {
  const { token } = useAuth();
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const profile = await getMyProfile(token);
        setSavedIds(profile.savedCandidates || []);
      } catch {
        // silently ignore — saved-state is a nice-to-have, not critical path
      }
    };
    fetchSaved();
  }, [token]);

  const toggleSave = async (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    try {
      await toggleSavedCandidateAPI(id, token);
    } catch {
      setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }
  };

  const isSaved = (id) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
}