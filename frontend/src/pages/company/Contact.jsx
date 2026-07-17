import React from "react";
import { COLORS} from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function Contact() {
  return (
    <StaticPageLayout
      title="Contact"
      subtitle="Have a question, feedback, or collaboration idea? Reach out."
    >
      <div className="flex flex-col gap-4">
        <a
          href="https://linkedin.com/in/sehartahir"
          target="_blank"
          rel="noreferrer"
          className="font-semibold"
          style={{ color: COLORS.primary }}
        >
          Connect on LinkedIn →
        </a>
        <a
          href="https://github.com/Sehar-Tahir"
          target="_blank"
          rel="noreferrer"
          className="font-semibold"
          style={{ color: COLORS.primary }}
        >
          View the project on GitHub →
        </a>
        <a
          href="https://sehar-portfolio.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="font-semibold"
          style={{ color: COLORS.primary }}
        >
          Visit the portfolio →
        </a>
      </div>
    </StaticPageLayout>
  );
}