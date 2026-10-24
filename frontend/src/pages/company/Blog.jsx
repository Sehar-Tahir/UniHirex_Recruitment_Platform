// import React from "react";
// import { COLORS, fontBody } from "../../theme";
// import StaticPageLayout from "../../components/home/StaticPageLayout";

// export default function Blog() {
//   return (
//     <StaticPageLayout title="Blog" subtitle="Stories, tips, and updates from UniHirex.">
//       <div className="border border-[#ECEEF3] rounded-2xl p-10 text-center">
//         <p className="text-[15px]" style={{ ...fontBody, color: COLORS.textMuted }}>
//           No posts yet. Check back soon as UniHirex grows.
//         </p>
//       </div>
//     </StaticPageLayout>
//   );
// }

import React from "react";
import { COLORS, fontBody, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function Blog() {
return ( <StaticPageLayout
   title="Blog"
   subtitle="Stories, insights, and updates from UniHirex."
 > <div className="relative overflow-hidden rounded-2xl border border-[#E7EAF3] bg-linear-to-br from-[#F8FAFF] via-white to-[#FDF8FB] px-6 py-12 text-center sm:px-10 sm:py-16">
{/* Decorative background accents */}
<div
className="absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-30 blur-3xl"
style={{ background: COLORS.primaryLight }}
aria-hidden="true"
/>


    <div
      className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full opacity-20 blur-3xl"
      style={{ background: COLORS.accentLight }}
      aria-hidden="true"
    />

    <div className="relative mx-auto flex max-w-lg flex-col items-center">
      {/* Blog icon */}
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E4E9FA] bg-white shadow-sm"
        style={{ color: COLORS.primary }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 7v14" />
          <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" />
        </svg>
      </div>

      {/* Coming soon label */}
      <div
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5E9F8] bg-white/90 px-3 py-1.5 text-xs font-semibold"
        style={{ color: COLORS.primary, ...fontBody }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
        </svg>
        COMING SOON
      </div>

      <h2
        className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ ...fontHead, color: COLORS.textDark }}
      >
        Something Worth Reading Is on Its Way
      </h2>

      <p
        className="max-w-md text-sm leading-7 sm:text-[15px]"
        style={{ ...fontBody, color: COLORS.textMuted }}
      >
        We're preparing helpful career advice, job search tips, recruitment
        insights, and the latest UniHirex updates to help students and
        recruiters move forward with confidence.
      </p>

      {/* Theme accent */}
      <div
        className="mt-7 h-1 w-14 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
        }}
        aria-hidden="true"
      />
    </div>
  </div>
</StaticPageLayout>


);
}
