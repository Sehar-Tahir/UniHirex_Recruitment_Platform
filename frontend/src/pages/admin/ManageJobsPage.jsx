import React, { useState, useMemo } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAdminListings } from "../../hooks/useAdminListings";
import AdminListingRow from "../../components/dashboard/admin/AdminListingRow";

const STATUS_TABS = ["All", "Active", "Flagged", "Closed"];

export default function ManageJobsPage() {
  const { listings, setStatus } = useAdminListings();
  const [statusTab, setStatusTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesStatus = statusTab === "All" || l.status === statusTab;
      const matchesSearch =
        !search ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.company.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [listings, statusTab, search]);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Manage Jobs
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {filtered.length} of {listings.length} listings platform-wide
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {STATUS_TABS.map((tab) => {
            const active = statusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
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
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-55 px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none"
          style={{ borderColor: "#D7DEF5" }}
        />
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {filtered.length > 0 ? (
          filtered.map((l) => <AdminListingRow key={l.id} {...l} onSetStatus={setStatus} />)
        ) : (
          <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
            No listings match your filters.
          </p>
        )}
      </div>
    </div>
  );
}