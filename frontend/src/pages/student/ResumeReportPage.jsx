import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getAnalysisById, updateSuggestion, deleteAnalysis } from "../../api/resumeAnalysis";
import { useAuth } from "../../context/AuthContext";
import ResumeReport from "../../components/resume/ResumeReport";

export default function ResumeReportPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalysisById(id, token)
      .then(setAnalysis)
      .catch(() => setAnalysis(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleToggleApplied = async (target, index, accepted) => {
    try {
      const updated = await updateSuggestion(id, { target, index, accepted }, token);
      setAnalysis(updated);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this analysis permanently?")) return;
    try {
      await deleteAnalysis(id, token);
      toast.success("Analysis deleted");
      navigate("/student/resume-history");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-170">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link to="/student/resume-history" className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
          ← Past analyses
        </Link>
        <Link
          to="/student/resume-analyzer"
          className="px-4 py-2 rounded-lg font-semibold text-[13px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          + New analysis
        </Link>
      </div>

      <h1 className="text-[24px] font-bold mb-5" style={{ ...fontHead, color: COLORS.textDark }}>
        Resume Analysis
      </h1>

      {loading && <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading report...</p>}

      {!loading && !analysis && (
        <p className="text-[14px]" style={{ ...fontBody, color: "#DC2626" }}>
          This analysis wasn't found.
        </p>
      )}

      {analysis && (
        <ResumeReport analysis={analysis} onToggleApplied={handleToggleApplied} onDelete={handleDelete} />
      )}
    </div>
  );
}