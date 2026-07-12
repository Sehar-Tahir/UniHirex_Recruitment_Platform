import React from "react";
import { COLORS } from "../../theme";
import SectionHead from "./SectionHead";
import FeatureTile from "./FeatureTile";
import { icons } from "./icons";

const TILES = [
  { icon: icons.search, title: "Smart job search", desc: "Filter by location, category, type, salary, and experience level to skip the noise.", theme: "blue" },
  { icon: icons.discover, title: "Recruiter discovery", desc: "Companies search profiles directly by skill and university — visibility without applying first.", theme: "burgundy" },
  { icon: icons.resume, title: "Resume hub", desc: "Upload, update, and download your resume — always synced with your latest profile.", theme: "blueSoft" },
  { icon: icons.bell, title: "Live notifications", desc: "Application updates, new matches, and interview invites — delivered the moment they happen.", theme: "blue" },
  { icon: icons.grid, title: "Application tracking", desc: "One dashboard for every job and internship you've applied to, and exactly where it stands.", theme: "burgundy" },
  { icon: icons.layers, title: "Role-based access", desc: "Separate, purpose-built experiences for students, recruiters, and platform admins.", theme: "blueSoft" },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-24" style={{ background: COLORS.light }}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-8">
        <SectionHead
          kicker="Platform features"
          title="Everything a campus hire needs"
          desc="Every module is designed around one job: getting the right student in front of the right recruiter, faster."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {TILES.map((t) => (
            <FeatureTile key={t.title} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
