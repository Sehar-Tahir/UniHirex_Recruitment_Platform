import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useListings } from "../../hooks/useListings";
import ListingRow from "../../components/dashboard/recruiter/ListingRow";

export default function ManageListingsPage() {
  const { listings, closeListing } = useListings();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          Manage Listings
        </h1>
        <Link
          to="/recruiter/post-listing"
          className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          + Post New Listing
        </Link>
      </div>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {listings.length} total listings
      </p>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {listings.length > 0 ? (
          listings.map((l) => <ListingRow key={l.id} {...l} onClose={closeListing} />)
        ) : (
          <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
            You haven't posted any listings yet.
          </p>
        )}
      </div>
    </div>
  );
}