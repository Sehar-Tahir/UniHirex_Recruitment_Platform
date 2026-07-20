import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import toast from "react-hot-toast";
import { getMyJobs, updateJobStatus } from "../../api/jobs";
import { useAuth } from "../../context/AuthContext";
import ListingRow from "../../components/dashboard/recruiter/ListingRow";

export default function ManageListingsPage() {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyJobs(token);
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

  const handleClose = async (id) => {
    try {
      await updateJobStatus(id, "Closed", token);
      setListings((prev) => prev.map((l) => (l._id === id ? { ...l, status: "Closed" } : l)));
      toast.success("Listing closed successfully");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          Manage Listings
        </h1>
        <Link
          to="/recruiter/post-listing"
          className="px-4 py-2.5 rounded-lg font-semibold md:text-[13.5px] text-[11.5px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          + Post New Listing
        </Link>
      </div>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Loading..." : `${listings.length} total listings`}
      </p>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {listings.length > 0 ? (
          listings.map((l) => (
            <ListingRow
              key={l._id}
              id={l._id}
              title={l.title}
              type={l.type}
              status={l.status}
              postedOn={new Date(l.createdAt).toLocaleDateString()}
              onClose={handleClose}
            />
          ))
        ) : (
          !loading && (
            <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
              You haven't posted any listings yet.
            </p>
          )
        )}
      </div>
    </div>
  );
}