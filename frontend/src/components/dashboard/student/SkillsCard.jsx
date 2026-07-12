import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function SkillsCard({ skills, onChange }) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput("");
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
        Skills
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-2 text-[13px] font-medium px-3 py-1.5 rounded-full"
            style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
          >
            {skill}
            <button onClick={() => removeSkill(skill)} className="text-[15px] leading-none">
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          placeholder="Add a skill and press Enter"
          className="flex-1 px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
          style={{ ...fontBody, borderColor: "#D7DEF5" }}
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          Add
        </button>
      </div>
    </div>
  );
}