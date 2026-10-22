import React, { useState } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { uploadFile } from "../../../api/upload";
import { useAuth } from "../../../context/AuthContext";
import SelectWithOther from "../../SelectWithOther";
import { UNIVERSITIES, DEPARTMENTS, SEMESTERS } from "../../../data/profileOptions";

const buildForm = (profile) => ({
  name: profile.name || "",
  phone: profile.phone || "",
  university: profile.university || "",
  department: profile.department || "",
  semester: SEMESTERS.includes(profile.semester) ? profile.semester : "",
  cgpa: profile.cgpa || "",
  photoUrl: profile.photoUrl || "",
});

const inputClass = "w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none";
const inputStyle = (hasError) => ({ ...fontBody, borderColor: hasError ? "#DC2626" : "#D7DEF5" });

function Field({ label, className = "", children }) {
  return (
    <div className={className}>
      <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function Value({ children }) {
  return (
    <p className="text-[14.5px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
      {children || "-"}
    </p>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>
      {message}
    </p>
  );
}

export default function ProfileHeaderCard({ profile, onSave }) {
  const { token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(profile));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleText = (key) => (e) => setField(key)(e.target.value);

  // Only allow a valid CGPA to be typed: one digit, then up to two decimals
  const handleCgpa = (e) => {
    const v = e.target.value;
    if (v === "" || /^\d?(\.\d{0,2})?$/.test(v)) setField("cgpa")(v);
  };

  const startEditing = () => {
    setForm(buildForm(profile)); // always start from the latest saved profile
    setErrors({});
    setEditing(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (form.phone && !/^\+?[\d\s()-]{7,20}$/.test(form.phone.trim())) errs.phone = "Enter a valid phone number";
    if (form.cgpa && (!/^\d(\.\d{1,2})?$/.test(form.cgpa) || Number(form.cgpa) > 4)) {
      errs.cgpa = "CGPA must be between 0 and 4.00";
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    // Only this card's own fields are sent, so it can never overwrite skills, projects, etc.
    const ok = await onSave({
      name: form.name.trim(),
      phone: form.phone.trim(),
      university: form.university.trim(),
      department: form.department.trim(),
      semester: form.semester,
      cgpa: form.cgpa,
      photoUrl: form.photoUrl,
    });
    setSaving(false);
    if (ok) setEditing(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const url = await uploadFile(file, "photo", token);
      setForm((prev) => ({ ...prev, photoUrl: url }));
      toast.success("Photo uploaded. Click Save to apply it.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const shownPhoto = editing ? form.photoUrl : profile.photoUrl;
  const shownName = editing ? form.name : profile.name;

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Basic Information
        </h3>
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditing(false);
                setErrors({});
              }}
              className="text-[13.5px] font-semibold"
              style={{ ...fontBody, color: COLORS.textMuted }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || uploadingPhoto}
              className="text-[13.5px] font-semibold disabled:opacity-50"
              style={{ ...fontBody, color: COLORS.primary }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <button onClick={startEditing} className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
            Edit
          </button>
        )}
      </div>

      <div className="flex items-center gap-5 mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden font-semibold text-2xl text-white shrink-0"
          style={{ background: COLORS.primary }}
        >
          {shownPhoto ? (
            <img src={shownPhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            shownName?.[0]?.toUpperCase() || "U"
          )}
        </div>
        {editing && (
          <label
            className="text-[13.5px] font-semibold cursor-pointer"
            style={{ ...fontBody, color: uploadingPhoto ? COLORS.textMuted : COLORS.primary }}
          >
            {uploadingPhoto ? "Uploading..." : "Change photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={uploadingPhoto}
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <Field label="Full Name">
          {editing ? (
            <>
              <input value={form.name} onChange={handleText("name")} maxLength={100} className={inputClass} style={inputStyle(errors.name)} />
              <FieldError message={errors.name} />
            </>
          ) : (
            <Value>{profile.name}</Value>
          )}
        </Field>

        <Field label="Email">
          <Value>{profile.email}</Value>
          {editing && (
            <p className="text-[11.5px] mt-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              Your email can't be changed here.
            </p>
          )}
        </Field>

        <Field label="Phone">
          {editing ? (
            <>
              <input
                value={form.phone}
                onChange={handleText("phone")}
                maxLength={20}
                placeholder="e.g. 03XX XXXXXXX"
                className={inputClass}
                style={inputStyle(errors.phone)}
              />
              <FieldError message={errors.phone} />
            </>
          ) : (
            <Value>{profile.phone}</Value>
          )}
        </Field>

        <Field label="Semester">
          {editing ? (
            <select
              value={form.semester}
              onChange={handleText("semester")}
              className={`${inputClass} bg-white`}
              style={inputStyle(false)}
            >
              <option value="">Select...</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <Value>{profile.semester}</Value>
          )}
        </Field>

        <Field label="University" className="md:col-span-2">
          {editing ? (
            <SelectWithOther
              value={form.university}
              onChange={setField("university")}
              options={UNIVERSITIES}
              otherPlaceholder="Type your university name"
            />
          ) : (
            <Value>{profile.university}</Value>
          )}
        </Field>

        <Field label="Department">
          {editing ? (
            <SelectWithOther
              value={form.department}
              onChange={setField("department")}
              options={DEPARTMENTS}
              otherPlaceholder="Type your department name"
            />
          ) : (
            <Value>{profile.department}</Value>
          )}
        </Field>

        <Field label="CGPA (out of 4.00)">
          {editing ? (
            <>
              <input
                value={form.cgpa}
                onChange={handleCgpa}
                inputMode="decimal"
                placeholder="e.g. 3.50"
                className={inputClass}
                style={inputStyle(errors.cgpa)}
              />
              <FieldError message={errors.cgpa} />
            </>
          ) : (
            <Value>{profile.cgpa}</Value>
          )}
        </Field>
      </div>
    </div>
  );
}