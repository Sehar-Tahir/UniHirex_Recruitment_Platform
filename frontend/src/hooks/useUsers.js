import { useState, useEffect } from "react";
import { mockUsers } from "../data/mockAdminData";

const STORAGE_KEY = "unihirex_admin_users";

function loadUsers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockUsers;
}

export function useUsers() {
  const [users, setUsers] = useState(loadUsers);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u))
    );
  };

  return { users, toggleStatus };
}