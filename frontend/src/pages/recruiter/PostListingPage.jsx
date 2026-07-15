import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useListings } from "../../hooks/useListings";
import { CATEGORIES, TYPES, EXPERIENCE_LEVELS } from "../../data/mockJobs";

const inputStyle = { borderColor: "#D7DEF5" };

export default function PostListingPage() {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    type: TYPES[0],
    location: "",
    salary: "",
    experienceLevel: EXPERIENCE_LEVELS[0],
    description: "",
  });
  const [requirementInput, setRequirementInput] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addRequirement = () => {
    const trimmed = requirementInput.trim();
    if (trimmed && !requirements.includes(trimmed)) setRequirements([...requirements, trimmed]);
    setRequirementInput("");
  };

  const removeRequirement = (r) => setRequirements(requirements.filter((x) => x !== r));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // TODO: connect to backend post-listing API (Phase 2)
      addListing({ ...form, requirements });
      navigate("/recruiter/listings");
    }
  };

  const fieldClass = "w-full px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none";

  return (
    <div className="max-w-170">
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Post a Job or Internship
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Fill in the details below — students will see this on the Jobs page.
      </p>

      <form onSubmit={handleSubmit} className="border border-[#ECEEF3] rounded-2xl p-7 bg-white flex flex-col gap-5">
        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
            Title
          </label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer Intern" className={fieldClass} style={inputStyle} />
          {errors.title && <p className="text-[13px] mt-1" style={{ color: "#DC2626" }}>{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Category
            </label>
            <select name="category" value={form.category} onChange={handleChange} className={fieldClass} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Type
            </label>
            <select name="type" value={form.type} onChange={handleChange} className={fieldClass} style={inputStyle}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Location
            </label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Lahore, Pakistan or Remote" className={fieldClass} style={inputStyle} />
            {errors.location && <p className="text-[13px] mt-1" style={{ color: "#DC2626" }}>{errors.location}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Salary
            </label>
            <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. PKR 40,000/mo" className={fieldClass} style={inputStyle} />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
            Experience Level
          </label>
          <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className={fieldClass} style={inputStyle}>
            {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
            Description
          </label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the role and responsibilities" className={fieldClass + " resize-none"} style={inputStyle} />
          {errors.description && <p className="text-[13px] mt-1" style={{ color: "#DC2626" }}>{errors.description}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
            Requirements
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {requirements.map((r) => (
              <span key={r} className="flex items-center gap-2 text-[13px] font-medium px-3 py-1.5 rounded-full" style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}>
                {r}
                <button type="button" onClick={() => removeRequirement(r)} className="text-[15px] leading-none">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              placeholder="Add a requirement and press Enter"
              className={fieldClass}
              style={inputStyle}
            />
            <button type="button" onClick={addRequirement} className="px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white whitespace-nowrap" style={{ ...fontBody, background: COLORS.primary }}>
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mt-2"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          Publish Listing
        </button>
      </form>
    </div>
  );
}