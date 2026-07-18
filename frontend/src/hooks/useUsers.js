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

  const approveUser = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "Active" } : u)));
  };

  const addUser = ({ name, email, role, status }) => {
    setUsers((prev) => [
      { id: Date.now(), name, email, role, status, joinedOn: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
  };

  const findByEmail = (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  return { users, toggleStatus, approveUser, addUser, findByEmail };
}