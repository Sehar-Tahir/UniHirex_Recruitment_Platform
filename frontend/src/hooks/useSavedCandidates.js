import { useState, useEffect } from "react";
import toast from "react-hot-toast";
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
    const wasSaved = savedIds.includes(id);
    setSavedIds((prev) => (wasSaved ? prev.filter((x) => x !== id) : [...prev, id]));
    try {
      await toggleSavedCandidateAPI(id, token);
      toast.success(wasSaved ? "Removed from saved candidates" : "Candidate saved");
    } catch {
      setSavedIds((prev) => (wasSaved ? [...prev, id] : prev.filter((x) => x !== id)));
      toast.error("Something went wrong, please try again");
    }
  };

  const isSaved = (id) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
}