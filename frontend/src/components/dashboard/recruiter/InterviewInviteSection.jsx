import React, { useState } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { sendInterviewInvite } from "../../../api/applications";
import { useAuth } from "../../../context/AuthContext";
import { safeUrl } from "../../../utils/links";
import InterviewInviteModal from "./InterviewInviteModal";

const formatWhen = (value) =>
  `${new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  })} (PKT)`;

export default function InterviewInviteSection({ application, studentName, onSent }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const invite = application.interviewInvite;
  const sent = !!invite?.sentAt;
  const locationLink = sent ? safeUrl(invite.location) : null;

  const handleSend = async (form) => {
    try {
      const result = await sendInterviewInvite(application._id, form, token);
      toast.success("Interview invitation sent!");
      onSent(result.application.interviewInvite);
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
            Interview
          </h3>
          <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            {sent
              ? `Invitation sent on ${new Date(invite.sentAt).toLocaleDateString()}.`
              : `${studentName || "This applicant"} is shortlisted. Send an invitation with a date, time and meeting link. They'll get a notification.`}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white whitespace-nowrap"
          style={{ ...fontBody, background: sent ? COLORS.primary : COLORS.accent }}
        >
          {sent ? "Send a new invitation" : "📅 Invite to Interview"}
        </button>
      </div>

      {sent && (
        <div className="mt-4 rounded-xl px-4 py-3" style={{ background: "#EEF1FC" }}>
          <p className="text-[13.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.primary }}>
            {formatWhen(invite.dateTime)}
          </p>
          <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textDark }}>
            {locationLink ? (
              <a href={locationLink} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                {invite.location}
              </a>
            ) : (
              invite.location
            )}
          </p>
          {invite.message && (
            <p className="text-[13px] mt-1.5 whitespace-pre-wrap" style={{ ...fontBody, color: COLORS.textMuted }}>
              {invite.message}
            </p>
          )}
        </div>
      )}

      {open && (
        <InterviewInviteModal studentName={studentName} onClose={() => setOpen(false)} onSubmit={handleSend} />
      )}
    </div>
  );
}