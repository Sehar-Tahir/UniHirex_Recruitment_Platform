import React from "react";
import { COLORS, fontBody } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function Blog() {
  return (
    <StaticPageLayout title="Blog" subtitle="Stories, tips, and updates from UniHirex.">
      <div className="border border-[#ECEEF3] rounded-2xl p-10 text-center">
        <p className="text-[15px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          No posts yet. Check back soon as UniHirex grows.
        </p>
      </div>
    </StaticPageLayout>
  );
}