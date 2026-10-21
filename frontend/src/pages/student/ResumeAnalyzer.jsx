import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import { analyzeResume } from "../../api/resumeAnalysis";
import { getMyResumes } from "../../api/resumes";
import { getMyAiQuota } from "../../api/users";
import { getJobById } from "../../api/jobs";
import { useAuth } from "../../context/AuthContext";
import { safeUrl } from "../../utils/links";
import AiQuotaBanner from "../../components/AiQuotaBanner";

export default function ResumeAnalyzer() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [resumes, setResumes] = useState(null); // null = still loading
  const [resumeId, setResumeId] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    getMyResumes(token)
      .then((data) => {
        setResumes(data.resumes);
        const preferred = data.resumes.find((r) => r.isDefault) || data.resumes[0];
        setResumeId(preferred ? preferred._id : "");
      })
      .catch(() => setResumes([])); // treat a failed load as "none" so the page stays usable
  }, [token]);

  useEffect(() => {
    getMyAiQuota(token).then(setQuota).catch(() => {});
  }, [token]);

  // Arriving from a job page: pre-fill the role and job description
  useEffect(() => {
    if (!jobId) return;
    getJobById(jobId)
      .then((job) => {
        setTargetRole(job.title || "");
        setJobDescription(
          `${job.description || ""}\n\nRequirements: ${(job.requirements || []).join(", ")}`.slice(0, 5000)
        );
        toast.success(`Loaded job: ${job.title}`);
      })
      .catch(() => {});
  }, [jobId]);

  const selected = resumes ? resumes.find((r) => r._id === resumeId) : null;
  const selectedLink = selected ? safeUrl(selected.url) : null;
  const quotaExhausted = quota ? quota.resumeAnalyses.remaining <= 0 : false;

  const handleAnalyze = async () => {
    if (!selected) return;
    setAnalyzing(true);
    try {
      const result = await analyzeResume(
        { resumeId: selected._id, targetRole: targetRole.trim(), jobDescription: jobDescription.trim() },
        token
      );
      toast.success("Resume analyzed!");
      navigate(`/student/resume-analysis/${result._id}`);
    } catch (err) {
      toast.error(err.message);
      setAnalyzing(false);
    }
  };

  const fieldClass = "w-full px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none";

  return (
    <div className="max-w-170">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          AI Resume Analyzer
        </h1>
        <Link to="/student/resume-history" className="text-[13.5px] font-semibold mt-2" style={{ ...fontBody, color: COLORS.primary }}>
          Past analyses →
        </Link>
      </div>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Get specific, actionable feedback on your resume, and see how it matches a job.
      </p>

      <AiQuotaBanner feature="resumeAnalyses" quota={quota} />

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
          Resume to analyze
        </label>

        {resumes === null ? (
          <p className="text-[13.5px] mb-5" style={{ ...fontBody, color: COLORS.textMuted }}>
            Checking your resumes...
          </p>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl px-4 py-3 mb-5" style={{ background: "#FFF6E5" }}>
            <p className="text-[13.5px]" style={{ ...fontBody, color: "#B45309" }}>
              You haven't added a resume yet.{" "}
              <Link to="/student/profile" className="font-semibold underline">
                Add one on your profile
              </Link>{" "}
              first.
            </p>
          </div>
        ) : (
          <div className="mb-5">
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className={`${fieldClass} bg-white mb-2`}
              style={{ ...fontBody, borderColor: "#D7DEF5" }}
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.label}
                  {r.isDefault ? " (default)" : ""}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-4">
              {selectedLink && (
                <a href={selectedLink} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                  📄 View this resume ↗
                </a>
              )}
              <Link to="/student/profile" className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
                Manage resumes →
              </Link>
            </div>
          </div>
        )}

        <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
          Target role (optional)
        </label>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Frontend Developer Intern"
          maxLength={100}
          className={`${fieldClass} mb-4`}
          style={{ ...fontBody, borderColor: "#D7DEF5" }}
        />

        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[13px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
            Job description (optional - paste one to see how well your resume matches it)
          </label>
          {jobDescription && (
            <button onClick={() => setJobDescription("")} className="text-[12px] font-semibold" style={{ ...fontBody, color: COLORS.textMuted }}>
              Clear
            </button>
          )}
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="Paste the job description or requirements here"
          className={`${fieldClass} resize-none mb-1`}
          style={{ ...fontBody, borderColor: "#D7DEF5" }}
        />
        <p className="text-[11.5px] mb-4 text-right" style={{ ...fontBody, color: COLORS.textMuted }}>
          {jobDescription.length}/5000
        </p>

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !selected || quotaExhausted}
          className="px-6 py-3 rounded-lg font-semibold text-[14.5px] text-white disabled:opacity-60"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          {analyzing ? "Analyzing your resume..." : "✨ Analyze My Resume"}
        </button>

        {analyzing && (
          <p className="text-[13px] mt-3" style={{ ...fontBody, color: COLORS.textMuted }}>
            This usually takes 15 to 30 seconds. Please keep this page open.
          </p>
        )}

        <p className="text-[12px] mt-4" style={{ ...fontBody, color: COLORS.textMuted }}>
          Your resume is processed by Google's Gemini AI to generate this report. Only you can see your reports, and you
          can delete any of them. AI feedback is a guide, not a guarantee. Use your own judgment.
        </p>
      </div>
    </div>
  );
}