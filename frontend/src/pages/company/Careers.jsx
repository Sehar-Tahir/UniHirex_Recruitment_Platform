import React from "react";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function Careers() {
  return (
    <StaticPageLayout
      title="Careers"
      subtitle="UniHirex is currently in active development."
    >
      <p className="mb-5">
        We're not hiring at this time, UniHirex is currently a project in active development,
        not yet a registered company. As the platform grows, this page will be updated with real
        opportunities to join the team.
      </p>
      <p>
        In the meantime, if you're interested in the project or want to collaborate, feel free to
        reach out through the Contact page.
      </p>
    </StaticPageLayout>
  );
}