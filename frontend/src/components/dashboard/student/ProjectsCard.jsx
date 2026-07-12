import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function ProjectsCard({ projects, onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", link: "" });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    onChange([...projects, { id: Date.now(), ...form }]);
    setForm({ title: "", description: "", link: "" });
    setShowForm(false);
  };

  const handleRemove = (id) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Projects
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[13.5px] font-semibold"
          style={{ ...fontBody, color: COLORS.accent }}
        >
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {showForm && (
        <div className="mb-5 p-4 rounded-xl bg-[#FAFBFE] border border-[#ECEEF3]">
          <input
            placeholder="Project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full mb-3 px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
            style={{ ...fontBody, borderColor: "#D7DEF5" }}
          />
          <textarea
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full mb-3 px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none resize-none"
            style={{ ...fontBody, borderColor: "#D7DEF5" }}
          />
          <input
            placeholder="Project link (GitHub, live demo, etc.)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full mb-3 px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
            style={{ ...fontBody, borderColor: "#D7DEF5" }}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white"
            style={{ ...fontBody, background: COLORS.primary }}
          >
            Save Project
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {projects.map((p) => (
          <div key={p.id} className="p-4 rounded-xl border border-[#ECEEF3]">
            <div className="flex items-start justify-between mb-1.5">
              <h4 className="text-[14.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
                {p.title}
              </h4>
              <button
                onClick={() => handleRemove(p.id)}
                className="text-[13px]"
                style={{ ...fontBody, color: "#B91C1C" }}
              >
                Remove
              </button>
            </div>
            <p className="text-[13.5px] mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>
              {p.description}
            </p>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-semibold"
                style={{ ...fontBody, color: COLORS.primary }}
              >
                View project →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}