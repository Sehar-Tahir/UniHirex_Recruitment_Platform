import { useState, useEffect } from "react";
import { mockApplicantsByListing } from "../data/mockApplicantsByListing";

const STORAGE_KEY_PREFIX = "unihirex_applicants_";

export function useApplicants(listingId) {
  const storageKey = `${STORAGE_KEY_PREFIX}${listingId}`;

  const [applicants, setApplicants] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : mockApplicantsByListing;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(applicants));
  }, [applicants, storageKey]);

  const updateStatus = (id, status) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return { applicants, updateStatus };
}