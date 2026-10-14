import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import { analyzeResume } from "../../api/resumeAnalysis";
   import { getMyProfile, updateMyProfile, getMyAiQuota } from "../../api/users";
   import AiQuotaBanner from "../../components/AiQuotaBanner";
import { getJobById } from "../../api/jobs";
import { uploadFile } from "../../api/upload";
import { useAuth } from "../../context/AuthContext";

export default function ResumeAnalyzer() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [resumeUrl, setResumeUrl] = useState(null); // null = still checking, "" = none uploaded
  const [uploading, setUploading] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
     const [analyzing, setAnalyzing] = useState(false);
     const [quota, setQuota] = useState(null);

  useEffect(() => {
    getMyProfile(token)
      .then((profile) => setResumeUrl(profile.resumeUrl || ""))
      .catch(() => setResumeUrl("")); // treat a failed check as "none" so the page stays usable
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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
      toast.error("Please upload a PDF or DOCX file. Older .doc files can't be analyzed.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file, "resume", token);
      await updateMyProfile({ resumeUrl: url }, token);
      setResumeUrl(url);
      toast.success("New resume uploaded and saved to your profile.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeResume(
        { targetRole: targetRole.trim(), jobDescription: jobDescription.trim() },
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
        <Link
          to="/student/resume-history"
          className="text-[13.5px] font-semibold mt-2"
          style={{ ...fontBody, color: COLORS.primary }}
        >
          Past analyses →
        </Link>
      </div>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Get specific, actionable feedback on your resume, and see how it matches a job.
      </p>

         <AiQuotaBanner feature="resumeAnalyses" quota={quota} />

         <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
          Your resume
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 rounded-xl px-4 py-3" style={{ background: "#FAFBFE" }}>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[13.5px] font-semibold"
              style={{ ...fontBody, color: COLORS.primary }}
            >
              📄 View current resume
            </a>
          ) : (
            <span className="text-[13.5px]" style={{ ...fontBody, color: resumeUrl === null ? COLORS.textMuted : "#B45309" }}>
              {resumeUrl === null ? "Checking..." : "No resume uploaded yet."}
            </span>
          )}
          <label
            className="text-[13px] font-semibold cursor-pointer"
            style={{ ...fontBody, color: uploading ? COLORS.textMuted : COLORS.accent }}
          >
            {uploading ? "Uploading..." : resumeUrl ? "Upload a new version" : "Upload resume (PDF or DOCX)"}
            <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

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
            <button
              onClick={() => setJobDescription("")}
              className="text-[12px] font-semibold"
              style={{ ...fontBody, color: COLORS.textMuted }}
            >
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
          disabled={analyzing || !resumeUrl || (quota && quota.resumeAnalyses.remaining <= 0)}
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
          Your resume is processed by Google's Gemini AI to generate this report. Only you can see your reports, and
          you can delete any of them. AI feedback is a guide, not a guarantee. Use your own judgment.
        </p>
      </div>
    </div>
  );
}