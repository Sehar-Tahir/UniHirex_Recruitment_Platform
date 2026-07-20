import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toggleSavedCandidate as toggleSavedCandidateAPI } from "../api/users";

export function useSavedCandidates() {
  const { user, token } = useAuth();
  const [trackedUser, setTrackedUser] = useState(user);
  const [savedIds, setSavedIds] = useState(user?.savedCandidates || []);

  // React's recommended pattern for "reset state when a value changes" —
  // done during render, not inside a useEffect (avoids cascading re-renders).
  if (user !== trackedUser) {
    setTrackedUser(user);
    setSavedIds(user?.savedCandidates || []);
  }

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