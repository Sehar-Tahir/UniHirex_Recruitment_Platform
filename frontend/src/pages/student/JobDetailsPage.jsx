import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getJobById, getJobMatchScore } from "../../api/jobs";
import { checkApplied } from "../../api/applications";
import { useAuth } from "../../context/AuthContext";
import MatchScoreBadge from "../../components/MatchScoreBadge";
import ApplyModal from "../../components/dashboard/student/ApplyModal";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showApply, setShowApply] = useState(false);

  // The AI match only runs when the student asks for it: "idle" | "loading" | "done" | "error"
  const [matchStatus, setMatchStatus] = useState("idle");
  const [matchScore, setMatchScore] = useState(null);
  const [matchExplanation, setMatchExplanation] = useState("");
  const [matchError, setMatchError] = useState("");

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

  // So the button is right after a refresh, and nobody fills in the form just to be told they already applied
  useEffect(() => {
    checkApplied(id, token)
      .then((result) => setApplied(result.applied))
      .catch(() => {});
  }, [id, token]);

  const handleCheckMatch = async () => {
    setMatchStatus("loading");
    setMatchError("");
    try {
      const result = await getJobMatchScore(id, token);
      setMatchScore(result.matchScore);
      setMatchExplanation(result.explanation);
      setMatchStatus("done");
    } catch (err) {
      setMatchError(err.message);
      setMatchStatus("error");
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

  const closed = !!job.status && job.status !== "Active";

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

        <div className="mb-6">
          {matchStatus === "idle" && (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
              style={{ background: "#F4F6FD" }}
            >
              <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                See how well your skills match this job.
              </p>
              <button
                onClick={handleCheckMatch}
                className="px-4 py-2 rounded-lg font-semibold text-[13px] text-white whitespace-nowrap"
                style={{ ...fontBody, background: COLORS.primary }}
              >
                ✨ Check my match
              </button>
            </div>
          )}

          {(matchStatus === "loading" || matchStatus === "done") && (
            <MatchScoreBadge loading={matchStatus === "loading"} score={matchScore} explanation={matchExplanation} />
          )}

          {matchStatus === "error" && (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
              style={{ background: "#FBEAEA" }}
            >
              <p className="text-[13.5px]" style={{ ...fontBody, color: "#B91C1C" }}>
                {matchError || "Couldn't check your match right now."}
              </p>
              <button
                onClick={handleCheckMatch}
                className="text-[13px] font-semibold"
                style={{ ...fontBody, color: COLORS.accent }}
              >
                Try again
              </button>
            </div>
          )}

          <Link
            to={`/student/resume-analyzer?jobId=${id}`}
            className="inline-block mt-3 text-[13px] font-semibold"
            style={{ ...fontBody, color: COLORS.primary }}
          >
            ✨ Check my resume against this job →
          </Link>
          <Link
            to={`/student/interview-coach?jobId=${id}`}
            className="block w-fit mt-2 text-[13px] font-semibold"
            style={{ ...fontBody, color: COLORS.accent }}
          >
            🎤 Practice an interview for this job →{" "}
            <span className="font-normal" style={{ color: COLORS.textMuted }}>
              (uses 1 of your AI interviews)
            </span>
          </Link>
        </div>

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
          {(job.requirements || []).map((req) => (
            <li key={req} className="text-[14.5px] mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              {req}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setShowApply(true)}
          disabled={applied || closed}
          className="px-6 py-3 rounded-lg font-semibold text-[14.5px] text-white disabled:opacity-60"
          style={{ ...fontBody, background: applied || closed ? "#94A3B8" : COLORS.accent }}
        >
          {applied ? "Applied ✓" : closed ? "Listing closed" : "Apply Now"}
        </button>
      </div>

      {showApply && (
        <ApplyModal
          job={job}
          onClose={() => setShowApply(false)}
          onApplied={() => {
            setApplied(true);
            setShowApply(false);
          }}
        />
      )}
    </div>
  );
}