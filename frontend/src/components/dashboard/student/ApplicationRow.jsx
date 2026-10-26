// // import React from "react";
// // import { COLORS, fontBody } from "../../../theme";

// // const STATUS_STYLES = {
// //   "Under Review": { bg: "#FFF6E5", color: "#B45309" },
// //   "Shortlisted": { bg: "#E7F7EE", color: "#15803D" },
// //   "Rejected": { bg: "#FBEAEA", color: "#B91C1C" },
// // };

// // export default function ApplicationRow({ title, company, status, appliedOn }) {
// //   const style = STATUS_STYLES[status] || { bg: "#F1F5F9", color: COLORS.textMuted };

// //   return (
// //     <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-4 border-b border-[#F1F3F9] last:border-0">
// //       <div>
// //         <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
// //           {title}
// //         </p>
// //         <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
// //           {company} · Applied {appliedOn}
// //         </p>
// //       </div>
// //       <span
// //         className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
// //         style={{ ...fontBody, background: style.bg, color: style.color }}
// //       >
// //         {status}
// //       </span>
// //     </div>
// //   );
// // }


// import React from "react";
// import { COLORS, fontBody } from "../../../theme";

// const STATUS_STYLES = {
//   "Under Review": { bg: "#FFF6E5", color: "#B45309" },
//   "Shortlisted": { bg: "#E7F7EE", color: "#15803D" },
//   "Rejected": { bg: "#FBEAEA", color: "#B91C1C" },
// };

// export default function ApplicationRow({
//   title,
//   company,
//   status,
//   appliedOn,
//   interviewInvite,
// }) {
//   const style =
//     STATUS_STYLES[status] || {
//       bg: "#F1F5F9",
//       color: COLORS.textMuted,
//     };

//   const interviewLocation = interviewInvite?.location;
//   const isUrl =
//     typeof interviewLocation === "string" &&
//     interviewLocation.startsWith("http");

//   return (
//     <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-4 border-b border-[#F1F3F9] last:border-0">
//       <div>
//         <p
//           className="text-[14.5px] font-semibold mb-0.5"
//           style={{ ...fontBody, color: COLORS.textDark }}
//         >
//           {title}
//         </p>

//         <p
//           className="text-[13px]"
//           style={{ ...fontBody, color: COLORS.textMuted }}
//         >
//           {company} · Applied {appliedOn}
//         </p>

//         {interviewLocation && (
//           <p
//             className="text-[13px] mt-1"
//             style={{ ...fontBody, color: COLORS.textMuted }}
//           >
//             Interview:{" "}
//             {isUrl ? (
//               <a
//                 href={interviewLocation}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline"
//               >
//                 Join Interview
//               </a>
//             ) : (
//               interviewLocation
//             )}
//           </p>
//         )}
//       </div>

//       <span
//         className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
//         style={{
//           ...fontBody,
//           background: style.bg,
//           color: style.color,
//         }}
//       >
//         {status}
//       </span>
//     </div>
//   );
// }

//2

// import React, { useEffect, useState } from "react";
// import { COLORS, fontBody } from "../../../theme";
// import { toLink } from "../../../utils/links";

// const STATUS_STYLES = {
//   "Under Review": { bg: "#FFF6E5", color: "#B45309" },
//   Shortlisted: { bg: "#E7F7EE", color: "#15803D" },
//   Rejected: { bg: "#FBEAEA", color: "#B91C1C" },
// };

// export default function ApplicationRow({ title, company, status, appliedOn, invite }) {
//   const style = STATUS_STYLES[status] || { bg: "#F1F5F9", color: COLORS.textMuted };
//   const [currentTime, setCurrentTime] = useState(null);

//   useEffect(() => {
//     const updateTime = () => setCurrentTime(Date.now());
//     updateTime();
//     const timer = window.setInterval(updateTime, 60000);
//     return () => window.clearInterval(timer);
//   }, []);

//   // An interview only counts while the application is still shortlisted
//   const hasInterview = status === "Shortlisted" && !!invite?.sentAt && !!invite?.dateTime;
//   const when = hasInterview ? new Date(invite.dateTime) : null;
//   const upcoming = when ? currentTime !== null && when.getTime() >= currentTime : false;
//   const link = hasInterview ? toLink(invite.location) : null;

//   return (
//     <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-4 border-b border-[#F1F3F9] last:border-0">
//       <div>
//         <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
//           {title}
//         </p>
//         <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
//           {company} · Applied {appliedOn}
//         </p>
//       </div>
//       <span
//         className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
//         style={{ ...fontBody, background: style.bg, color: style.color }}
//       >
//         {status}
//       </span>

//       {hasInterview && (
//         <div
//           className="basis-full flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl px-3.5 py-2.5"
//           style={{ background: upcoming ? "#EEF1FC" : "#F8FAFC" }}
//         >
//           <span
//             className="text-[13px] font-semibold"
//             style={{ ...fontBody, color: upcoming ? COLORS.primary : COLORS.textMuted }}
//           >
//             📅 Interview:{" "}
//             {when.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" })} (PKT)
//             {!upcoming && " · Past"}
//           </span>
//           {link ? (
//             <a
//               href={link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-[13px] font-semibold px-3 py-1 rounded-lg text-white"
//               style={{ ...fontBody, background: COLORS.accent }}
//             >
//               Join meeting ↗
//             </a>
//           ) : (
//             <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>
//               📍 {invite.location}
//             </span>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
import React from "react";
import { COLORS, fontBody } from "../../../theme";
import InterviewStrip from "./InterviewStrip";

const STATUS_STYLES = {
  "Under Review": { bg: "#FFF6E5", color: "#B45309" },
  Shortlisted: { bg: "#E7F7EE", color: "#15803D" },
  Rejected: { bg: "#FBEAEA", color: "#B91C1C" },
};

export default function ApplicationRow({ title, company, status, appliedOn, invite }) {
  const style = STATUS_STYLES[status] || { bg: "#F1F5F9", color: COLORS.textMuted };

  // An interview only counts while the application is still shortlisted
  const hasInterview = status === "Shortlisted" && !!invite?.sentAt && !!invite?.dateTime;

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-4 border-b border-[#F1F3F9] last:border-0">
      <div>
        <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
          {title}
        </p>
        <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          {company} · Applied {appliedOn}
        </p>
      </div>
      <span
        className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
        style={{ ...fontBody, background: style.bg, color: style.color }}
      >
        {status}
      </span>

      {hasInterview && <InterviewStrip jobTitle={title} company={company} invite={invite} />}
    </div>
  );
}