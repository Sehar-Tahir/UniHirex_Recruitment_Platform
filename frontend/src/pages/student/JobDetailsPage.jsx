import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getJobById } from "../../api/jobs";
import { applyToJob } from "../../api/applications";
import { useAuth } from "../../context/AuthContext";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setApplyError("");
    try {
      await applyToJob(id, token);
      setApplied(true);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>Loading...</p>;
  }

  if (!job) {
    return (
      <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
        Job not found.
      </p>
    );
  }

  return (
    <div className="max-w-180">
      <button
        onClick={() => navigate(-1)}
        className="text-[13.5px] font-semibold mb-6"
        style={{ ...fontBody, color: COLORS.primary }}
      >
        ← Back
      </button>

      <div className="border border-[#ECEEF3] rounded-2xl p-7 bg-white">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-[22px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
            {job.title}
          </h1>
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
          >
            {job.type}
          </span>
        </div>

        <p className="text-[15px] mb-1" style={{ ...fontBody, color: COLORS.textDark }}>
          {job.company}
        </p>
        <p className="text-[13.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
          {job.location} · {job.salary} · {job.experienceLevel}
        </p>

        <h3 className="text-[15px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Description
        </h3>
        <p className="text-[14.5px] leading-relaxed mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
          {job.description}
        </p>

        <h3 className="text-[15px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Requirements
        </h3>
        <ul className="mb-7 list-disc pl-5">
          {job.requirements.map((req) => (
            <li key={req} className="text-[14.5px] mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              {req}
            </li>
          ))}
        </ul>

        {applyError && (
          <p className="text-[13.5px] mb-3" style={{ color: "#DC2626" }}>
            {applyError}
          </p>
        )}

        <button
          onClick={handleApply}
          disabled={applied || applying}
          className="px-6 py-3 rounded-lg font-semibold text-[14.5px] text-white disabled:opacity-60"
          style={{ ...fontBody, background: applied ? "#94A3B8" : COLORS.accent }}
        >
          {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
        </button>
      </div>
    </div>
  );
}