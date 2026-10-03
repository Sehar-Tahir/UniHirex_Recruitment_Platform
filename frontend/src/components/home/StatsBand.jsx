import React, { useEffect, useState } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import LiveCounter from "./LiveCounter";

// const STATS = [
//   { value: 700, suffix: "+", label: "Active students" },
//   { value: 48, suffix: "+", label: "Hiring companies" },
//   { value: 200, suffix: "+", label: "Live opportunities" },
//   { value: 98, suffix: "%", label: "Satisfaction rate" },
// ];

export default function StatsBand() {

  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    activeJobs: 0,
    applications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/stats`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    fetchStats();
  }, []);

  const STATS = [
  {
    value: stats.students,
    suffix: "+",
    label: "Students Registered",
  },
  {
    value: stats.companies,
    suffix: "+",
    label: "Companies",
  },
  {
    value: stats.activeJobs,
    suffix: "+",
    label: "Active Jobs",
  },
  {
    value: stats.applications,
    suffix: "+",
    label: "Applications",
  },
];

  return (
    <section className="py-16" style={{ background: COLORS.textDark }}>
      <div className="max-w-295 mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-3xl md:text-[38px] font-bold text-white" style={fontHead}>
              <LiveCounter target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm mt-1.5" style={{ ...fontBody, color: "#9AA5BD" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
