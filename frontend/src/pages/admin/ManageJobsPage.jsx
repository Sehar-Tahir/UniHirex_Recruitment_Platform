import React, { useState, useEffect, useMemo, useCallback } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import toast from "react-hot-toast";
import { getAllJobsForAdmin } from "../../api/admin";
import { updateJobStatus } from "../../api/jobs";
import { useAuth } from "../../context/AuthContext";
import AdminListingRow from "../../components/dashboard/admin/AdminListingRow";

const STATUS_TABS = ["All", "Active", "Flagged", "Closed"];

export default function ManageJobsPage() {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [search, setSearch] = useState("");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllJobsForAdmin(token);
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSetStatus = async (id, status) => {
    try {
      await updateJobStatus(id, status, token);
      setListings((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
      toast.success(`Listing ${status.toLowerCase()} successfully`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

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
        {loading ? "Loading..." : `${filtered.length} of ${listings.length} listings platform-wide`}
      </p>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {STATUS_TABS.map((tab) => {
            const active = statusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[12.5px] md:text-[13.5px] font-semibold transition-colors whitespace-nowrap"
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
          filtered.map((l) => (
            <AdminListingRow
              key={l._id}
              id={l._id}
              title={l.title}
              company={l.company}
              type={l.type}
              status={l.status}
              postedOn={new Date(l.createdAt).toLocaleDateString()}
              onSetStatus={handleSetStatus}
            />
          ))
        ) : (
          !loading && (
            <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
              No listings match your filters.
            </p>
          )
        )}
      </div>
    </div>
  );
}