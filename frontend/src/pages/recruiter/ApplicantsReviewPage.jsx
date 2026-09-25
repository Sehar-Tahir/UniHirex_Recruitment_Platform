import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import toast from "react-hot-toast";
import { getApplicantsForJob, updateApplicationStatus } from "../../api/applications";
import { getJobById } from "../../api/jobs";
import { useAuth } from "../../context/AuthContext";
import ApplicantReviewRow from "../../components/dashboard/recruiter/ApplicantReviewRow";
import Pagination from "../../components/Pagination";

export default function ApplicantsReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobData, applicantsResult] = await Promise.all([
        getJobById(id),
        getApplicantsForJob(id, page, token),
      ]);
      setJob(jobData);
      setApplicants(applicantsResult.data);
      setTotalPages(applicantsResult.totalPages);
      setTotalApplicants(applicantsResult.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, page, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status, token);
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
      );
      toast.success(`Applicant ${status.toLowerCase()}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
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
        {loading ? "Loading..." : `${totalApplicants} applicant${totalApplicants === 1 ? "" : "s"}`}
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
              studentId={a.student?._id}
              studentName={a.student?.name}
              photoUrl={a.student?.photoUrl}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}