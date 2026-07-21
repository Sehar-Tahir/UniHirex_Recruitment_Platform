import React, { useState, useEffect, useMemo, useCallback } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import toast from "react-hot-toast";
import { getAllUsers, approveUser, toggleUserStatus, createAdmin } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";
import UserRow from "../../components/dashboard/admin/UserRow";
import CreateAdminModal from "../../components/dashboard/admin/CreateAdminModal";

const ROLE_TABS = ["All", "Student", "Recruiter"];

export default function ManageUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApprove = async (id) => {
    try {
      await approveUser(id, token);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: "Active" } : u)));
      toast.success("User approved successfully");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleUserStatus(id, token);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: res.user.status } : u)));
      toast.success(`User ${res.user.status === "Active" ? "activated" : "suspended"} successfully`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleCreateAdmin = async (form) => {
    try {
      await createAdmin(form, token);
      toast.success("Admin account created successfully");
      setShowCreateAdmin(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesTab = activeTab === "All" || u.role === activeTab.toLowerCase();
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [users, activeTab, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          Manage Users
        </h1>
        <button
          onClick={() => setShowCreateAdmin(true)}
          className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          + Create Admin
        </button>
      </div>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Loading..." : `${filtered.length} of ${users.length} users`}
      </p>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {ROLE_TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[12.5px] md:text-[13.5px] font-semibold capitalize transition-colors whitespace-nowrap"
                style={{
                  ...fontBody,
                  background: active ? COLORS.primary : "#F1F5F9",
                  color: active ? "#fff" : COLORS.textMuted,
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none w-65"
          style={{ ...fontBody, borderColor: "#D7DEF5" }}
        />
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {filtered.length > 0 ? (
          filtered.map((u) => (
            <UserRow key={u._id} {...u} id={u._id} onToggleStatus={handleToggleStatus} onApprove={handleApprove} />
          ))
        ) : (
          !loading && (
            <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
              No users match your search.
            </p>
          )
        )}
      </div>

      {showCreateAdmin && (
        <CreateAdminModal onClose={() => setShowCreateAdmin(false)} onSubmit={handleCreateAdmin} />
      )}
    </div>
  );
}