import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getApplicantsForJob, updateApplicationStatus } from "../../api/applications";
import { getJobById } from "../../api/jobs";
import { useAuth } from "../../context/AuthContext";
import ApplicantReviewRow from "../../components/dashboard/recruiter/ApplicantReviewRow";

export default function ApplicantsReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobData, applicantsData] = await Promise.all([
        getJobById(id),
        getApplicantsForJob(id, token),
      ]);
      setJob(jobData);
      setApplicants(applicantsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status, token);
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
      );
    } catch (err) {
      setError(err.message);
    }
  };

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
        Applicants {job ? `- ${job.title}` : ""}
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Loading..." : `${applicants.length} applicant${applicants.length === 1 ? "" : "s"}`}
      </p>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {applicants.length > 0 ? (
          applicants.map((a) => (
            <ApplicantReviewRow
              key={a._id}
              id={a._id}
              studentName={a.student?.name}
              university={a.student?.university}
              cgpa={a.student?.cgpa}
              appliedOn={new Date(a.createdAt).toLocaleDateString()}
              status={a.status}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        ) : (
          !loading && (
            <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
              No applicants yet.
            </p>
          )
        )}
      </div>
    </div>
  );
}