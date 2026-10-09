import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import toast from "react-hot-toast";
import { createInterview } from "../../api/interviews";
import { useAuth } from "../../context/AuthContext";

const LEVELS = ["Junior", "Mid", "Senior"];
const TYPES = ["Technical", "HR", "Behavioral", "Mixed", "Role Specific"];
const QUESTION_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function InterviewSetup() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "",
    level: "Junior",
    type: "Technical",
    questionCount: 5,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.role.trim()) errs.role = "Job role is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const interview = await createInterview({ ...form, questionCount: Number(form.questionCount) }, token);
      navigate(`/student/interview-room/${interview._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "w-full px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none";
  const fieldStyle = { borderColor: "#D7DEF5" };

  return (
    <div className="max-w-150">
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        AI Interview Coach
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Practice a real voice-based interview, tailored to the role you're preparing for.
      </p>

      <form onSubmit={handleSubmit} className="border border-[#ECEEF3] rounded-2xl p-7 bg-white flex flex-col gap-5">
        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
            Job Role
          </label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            className={fieldClass}
            style={fieldStyle}
          />
          {errors.role && <p className="text-[13px] mt-1" style={{ color: "#DC2626" }}>{errors.role}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Interview Level
            </label>
            <select name="level" value={form.level} onChange={handleChange} className={fieldClass} style={fieldStyle}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Interview Type
            </label>
            <select name="type" value={form.type} onChange={handleChange} className={fieldClass} style={fieldStyle}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
            Number of Questions
          </label>
          <select
            name="questionCount"
            value={form.questionCount}
            onChange={handleChange}
            className={fieldClass}
            style={fieldStyle}
          >
            {QUESTION_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mt-2 disabled:opacity-60"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          {loading ? "Preparing..." : "Continue"}
        </button>
      </form>
    </div>
  );
}