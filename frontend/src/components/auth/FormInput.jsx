import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function FormInput({ label, type = "text", value, onChange, placeholder, error, name }) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block text-[14px] font-medium mb-1.5"
        style={{ ...fontBody, color: COLORS.textDark }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-[10px] border-[1.5px] text-[15px] outline-none transition-colors duration-150"
        style={{
          ...fontBody,
          borderColor: error ? "#DC2626" : "#D7DEF5",
        }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
        onBlur={(e) => (e.target.style.borderColor = error ? "#DC2626" : "#D7DEF5")}
      />
      {error && (
        <p className="text-[13px] mt-1" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}