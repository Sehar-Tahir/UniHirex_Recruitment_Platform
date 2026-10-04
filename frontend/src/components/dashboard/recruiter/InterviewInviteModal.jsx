import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function InterviewInviteModal({ studentName, onClose, onSubmit }) {
  const [form, setForm] = useState({ dateTime: "", location: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.dateTime) errs.dateTime = "Date and time are required";
    if (!form.location.trim()) errs.location = "Location or meeting link is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "w-full px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none";
  const fieldStyle = { ...fontBody, borderColor: "#D7DEF5" };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-110" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
          Invite {studentName} to Interview
        </h3>
        <p className="text-[13.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
          They'll receive a notification with these details immediately.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Date & Time
            </label>
            <input
              name="dateTime"
              type="datetime-local"
              value={form.dateTime}
              onChange={handleChange}
              className={fieldClass}
              style={{ ...fieldStyle, borderColor: errors.dateTime ? "#DC2626" : "#D7DEF5" }}
            />
            {errors.dateTime && <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors.dateTime}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Location or Meeting Link
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Google Meet link, or office address"
              className={fieldClass}
              style={{ ...fieldStyle, borderColor: errors.location ? "#DC2626" : "#D7DEF5" }}
            />
            {errors.location && <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors.location}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Message (optional)
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional details for the candidate"
              className={fieldClass + " resize-none"}
              style={fieldStyle}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg font-semibold text-[14px]"
              style={{ ...fontBody, color: COLORS.textMuted, background: "#F1F5F9" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg font-semibold text-[14px] text-white disabled:opacity-60"
              style={{ ...fontBody, background: COLORS.accent }}
            >
              {loading ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}