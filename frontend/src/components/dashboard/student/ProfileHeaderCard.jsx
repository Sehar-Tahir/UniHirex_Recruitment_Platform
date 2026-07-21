import React, { useState } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { uploadFile } from "../../../api/upload";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileHeaderCard({ profile, onSave }) {
  const { token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = "Name is required";
    if (!form.email?.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (form.phone && !/^[\d+\-\s()]{7,}$/.test(form.phone)) errs.phone = "Enter a valid phone number";
    if (form.cgpa && (isNaN(form.cgpa) || Number(form.cgpa) < 0 || Number(form.cgpa) > 4)) errs.cgpa = "CGPA must be between 0 and 4";
    return errs;
  };

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const url = await uploadFile(file, "photo", token);
      setForm((prev) => ({ ...prev, photoUrl: url }));
      toast.success("Photo uploaded - click Save to apply");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSave(form);
      setEditing(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "university", label: "University" },
    { key: "department", label: "Department" },
    { key: "semester", label: "Semester" },
    { key: "cgpa", label: "CGPA" },
  ];

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Basic Information
        </h3>
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => { setForm(profile); setErrors({}); setEditing(false); }}
              className="text-[13.5px] font-semibold"
              style={{ ...fontBody, color: COLORS.textMuted }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-[13.5px] font-semibold"
              style={{ ...fontBody, color: COLORS.primary }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[13.5px] font-semibold"
            style={{ ...fontBody, color: COLORS.accent }}
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex items-center gap-5 mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden font-semibold text-2xl text-white shrink-0"
          style={{ background: COLORS.primary }}
        >
          {form.photoUrl ? (
            <img src={form.photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            form.name?.[0]?.toUpperCase() || "U"
          )}
        </div>
        {editing && (
          <label
            className="text-[13.5px] font-semibold cursor-pointer"
            style={{ ...fontBody, color: uploadingPhoto ? COLORS.textMuted : COLORS.primary }}
          >
            {uploadingPhoto ? "Uploading..." : "Change photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploadingPhoto} />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              {f.label}
            </p>
            {editing ? (
              <>
                <input
                  name={f.key}
                  value={form[f.key]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
                  style={{ ...fontBody, borderColor: errors[f.key] ? "#DC2626" : "#D7DEF5" }}
                />
                {errors[f.key] && (
                  <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors[f.key]}</p>
                )}
              </>
            ) : (
              <p className="text-[14.5px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
                {form[f.key]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}