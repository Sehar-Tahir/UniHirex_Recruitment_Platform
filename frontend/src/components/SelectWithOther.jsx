import React, { useState } from "react";
import { fontBody } from "../theme";

const OTHER = "__other__";

export default function SelectWithOther({ value, onChange, options, otherPlaceholder, error, maxLength = 120 }) {
  // If the saved value isn't on the list, start in "Other" mode with that text filled in
  const [otherMode, setOtherMode] = useState(!!value && !options.includes(value));

  const handleSelect = (e) => {
    if (e.target.value === OTHER) {
      setOtherMode(true);
      onChange("");
    } else {
      setOtherMode(false);
      onChange(e.target.value);
    }
  };

  const style = (hasError) => ({ ...fontBody, borderColor: hasError ? "#DC2626" : "#D7DEF5" });

  return (
    <div>
      <select
        value={otherMode ? OTHER : value || ""}
        onChange={handleSelect}
        className="w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none bg-white"
        style={style(error && !otherMode)}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        <option value={OTHER}>Other (type your own)</option>
      </select>

      {otherMode && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={otherPlaceholder}
          className="w-full mt-2 px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
          style={style(error)}
        />
      )}

      {error && (
        <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}