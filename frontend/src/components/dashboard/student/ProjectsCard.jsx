import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { checkLink, safeUrl } from "../../../utils/links";

const EMPTY = { title: "", description: "", link: "", liveLink: "" };
const MAX_PROJECTS = 10;
const inputClass = "w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none";
const inputStyle = (hasError) => ({ ...fontBody, borderColor: hasError ? "#DC2626" : "#D7DEF5" });

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-[12.5px] mt-1 mb-2" style={{ color: "#DC2626" }}>
      {message}
    </p>
  );
}

export default function ProjectsCard({ projects, onChange }) {
  const [editingIndex, setEditingIndex] = useState(null); // null = form closed, -1 = adding, n = editing project n
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm(EMPTY);
    setErrors({});
    setEditingIndex(-1);
  };

  const openEdit = (index) => {
    const p = projects[index];
    setForm({
      title: p.title || "",
      description: p.description || "",
      link: p.link || "",
      liveLink: p.liveLink || "",
    });
    setErrors({});
    setEditingIndex(index);
  };

  const closeForm = () => {
    setEditingIndex(null);
    setErrors({});
  };

  const handleSave = async () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Project title is required";
    const github = checkLink(form.link, { label: "GitHub link" });
    if (github.error) errs.link = github.error;
    const live = checkLink(form.liveLink, { label: "Live link" });
    if (live.error) errs.liveLink = live.error;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const entry = {
      title: form.title.trim(),
      description: form.description.trim(),
      link: github.value,
      liveLink: live.value,
    };
    const next = editingIndex === -1 ? [...projects, entry] : projects.map((p, i) => (i === editingIndex ? entry : p));

    setSaving(true);
    const ok = await onChange(next);
    setSaving(false);
    if (ok) closeForm();
  };

  const handleRemove = (index) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const formOpen = editingIndex !== null;

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Projects
        </h3>
        {!formOpen && projects.length < MAX_PROJECTS && (
          <button onClick={openAdd} className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
            + Add Project
          </button>
        )}
      </div>

      {formOpen && (
        <div className="mb-5 p-4 rounded-xl bg-[#FAFBFE] border border-[#ECEEF3]">
          <p className="text-[13px] font-semibold mb-3" style={{ ...fontBody, color: COLORS.textDark }}>
            {editingIndex === -1 ? "New project" : "Edit project"}
          </p>

          <input
            placeholder="Project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={120}
            className={`${inputClass} mb-3`}
            style={inputStyle(errors.title)}
          />
          <FieldError message={errors.title} />

          <textarea
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={500}
            rows={2}
            className={`${inputClass} mb-3 resize-none`}
            style={inputStyle(false)}
          />

          <input
            placeholder="GitHub link (e.g. https://github.com/you/project)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            maxLength={300}
            className={`${inputClass} mb-3`}
            style={inputStyle(errors.link)}
          />
          <FieldError message={errors.link} />

          <input
            placeholder="Live link (e.g. https://my-project.vercel.app)"
            value={form.liveLink}
            onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
            maxLength={300}
            className={`${inputClass} mb-3`}
            style={inputStyle(errors.liveLink)}
          />
          <FieldError message={errors.liveLink} />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white disabled:opacity-60"
              style={{ ...fontBody, background: COLORS.primary }}
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
            <button
              onClick={closeForm}
              className="px-4 py-2 rounded-lg font-semibold text-[13.5px]"
              style={{ ...fontBody, color: COLORS.textMuted, background: "#F1F5F9" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 && !formOpen && (
        <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          No projects added yet.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {projects.map((p, index) => {
          const github = safeUrl(p.link);
          const live = safeUrl(p.liveLink);
          return (
            <div key={p._id || index} className="p-4 rounded-xl border border-[#ECEEF3]">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h4 className="text-[14.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
                  {p.title}
                </h4>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => openEdit(index)} className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                    Edit
                  </button>
                  <button onClick={() => handleRemove(index)} className="text-[13px]" style={{ ...fontBody, color: "#B91C1C" }}>
                    Remove
                  </button>
                </div>
              </div>
              {p.description && (
                <p className="text-[13.5px] mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>
                  {p.description}
                </p>
              )}
              {(github || live) && (
                <div className="flex gap-4">
                  {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                      GitHub ↗
                    </a>
                  )}
                  {live && (
                    <a href={live} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                      Live demo ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {projects.length >= MAX_PROJECTS && (
        <p className="text-[12.5px] mt-3" style={{ ...fontBody, color: COLORS.textMuted }}>
          You've reached the limit of {MAX_PROJECTS} projects.
        </p>
      )}
    </div>
  );
}