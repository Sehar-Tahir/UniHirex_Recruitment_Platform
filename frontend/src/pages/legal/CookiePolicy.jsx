import React from "react";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function CookiePolicy() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      subtitle={`Last updated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
    >
      <p className="mb-6">
        UniHirex currently uses your browser's local storage not cookies to keep you signed in
        and to save preferences like saved jobs or saved candidates while you use the platform.
        This data stays in your browser and isn't shared with third parties.
      </p>
      <h3 className="text-lg font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
        Managing your data
      </h3>
      <p>
        You can clear this data at any time by clearing your browser's site data for UniHirex, or
        by logging out.
      </p>
    </StaticPageLayout>
  );
}