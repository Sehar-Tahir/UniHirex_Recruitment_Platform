import { useState, useEffect } from "react";
import { mockAdminListings } from "../data/mockAdminData";

const STORAGE_KEY = "unihirex_admin_listings";

function loadListings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockAdminListings;
}

export function useAdminListings() {
  const [listings, setListings] = useState(loadListings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  const setStatus = (id, status) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return { listings, setStatus };
}