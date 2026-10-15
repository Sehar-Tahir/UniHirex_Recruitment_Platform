import { useState, useEffect } from "react";

export function useAnalyticsSection(fetcher, range, token) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: "", data: null, error: "" });
  const key = `${range}:${attempt}`;

  useEffect(() => {
    let cancelled = false;
    fetcher(range, token)
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setResult({ key, data: null, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, range, token, key]);

  const loading = result.key !== key;

  return {
    data: loading ? null : result.data,
    loading,
    error: loading ? "" : result.error,
    retry: () => setAttempt((a) => a + 1),
  };
}