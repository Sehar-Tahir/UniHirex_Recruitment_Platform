import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../../api/users";

export default function AdminProfilePage() {
  const { token, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(token);
        setProfile(data);
        setForm({ name: data.name });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const updated = await updateMyProfile({ name: form.name }, token);
      setProfile(updated);
      updateUser({ name: updated.name });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        My Profile
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Your platform administrator account.
      </p>

      <div className="max-w-130 border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
            Account Details
          </h3>
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={() => { setForm({ name: profile.name }); setErrors({}); setEditing(false); }}
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

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl text-white shrink-0"
            style={{ background: COLORS.primary }}
          >
            {profile.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full capitalize"
            style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
          >
            Admin
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              Full Name
            </p>
            {editing ? (
              <>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
                  style={{ ...fontBody, borderColor: errors.name ? "#DC2626" : "#D7DEF5" }}
                />
                {errors.name && (
                  <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors.name}</p>
                )}
              </>
            ) : (
              <p className="text-[14.5px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
                {profile.name}
              </p>
            )}
          </div>

          <div>
            <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              Email
            </p>
            <p className="text-[14.5px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
              {profile.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}