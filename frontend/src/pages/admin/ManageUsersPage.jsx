import React, { useState, useMemo } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useUsers } from "../../hooks/useUsers";
import UserRow from "../../components/dashboard/admin/UserRow";

const ROLE_TABS = ["All", "Student", "Recruiter"];

export default function ManageUsersPage() {
  const { users, toggleStatus } = useUsers();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

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
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Manage Users
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {filtered.length} of {users.length} users
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2">
          {ROLE_TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors"
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
          filtered.map((u) => <UserRow key={u.id} {...u} onToggleStatus={toggleStatus} />)
        ) : (
          <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
            No users match your search.
          </p>
        )}
      </div>
    </div>
  );
}