import { useState, useEffect } from "react";
import { getPublicStats } from "../api/public";

// status is "loading", "ready" or "error"
export function usePublicStats() {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    getPublicStats()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", data: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
