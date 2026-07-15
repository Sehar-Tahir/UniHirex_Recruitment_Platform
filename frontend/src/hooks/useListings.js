import { useState, useEffect } from "react";
import { mockListings } from "../data/mockRecruiterData";

const STORAGE_KEY = "unihirex_listings";

function loadListings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockListings;
}

export function useListings() {
  const [listings, setListings] = useState(loadListings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  const addListing = (listing) => {
    setListings((prev) => [{ id: Date.now(), applicants: 0, status: "Active", postedOn: new Date().toISOString().slice(0, 10), ...listing }, ...prev]);
  };

  const closeListing = (id) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: "Closed" } : l)));
  };

  return { listings, addListing, closeListing };
}