import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useApplicants } from "../../hooks/useApplicants";
import { useListings } from "../../hooks/useListings";
import ApplicantReviewRow from "../../components/dashboard/recruiter/ApplicantReviewRow";

export default function ApplicantsReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useListings();
  const { applicants, updateStatus } = useApplicants(id);

  const listing = listings.find((l) => String(l.id) === id);

  return (
    <div>
      <button
        onClick={() => navigate("/recruiter/listings")}
        className="text-[13.5px] font-semibold mb-6"
        style={{ ...fontBody, color: COLORS.primary }}
      >
        ← Back to Listings
      </button>

      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Applicants {listing ? `— ${listing.title}` : ""}
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {applicants.length} applicant{applicants.length === 1 ? "" : "s"}
      </p>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {applicants.map((a) => (
          <ApplicantReviewRow key={a.id} {...a} onUpdateStatus={updateStatus} />
        ))}
      </div>
    </div>
  );
}