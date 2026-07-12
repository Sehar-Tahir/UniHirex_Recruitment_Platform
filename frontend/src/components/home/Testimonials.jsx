import React from "react";
import { COLORS } from "../../theme";
import SectionHead from "./SectionHead";
import TestimonialCard from "./TestimonialCard";

const TESTIMONIALS = [
  {
    quote:
      "I built my entire profile in an evening and had a recruiter message me within the week. The application tracker kept me from losing track of anything.",
    name: "Hamza Riaz",
    role: "BS Computer Science, IUB",
    avatarGradient: `linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})`,
  },
  {
    quote:
      "We filled two internship slots in a single week using the skill search. It cut our usual campus hiring timeline in half.",
    name: "Maira Sheikh",
    role: "Talent Lead, NovaTech",
    avatarGradient: `linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.accent})`,
  },
  {
    quote:
      "Notifications meant I never missed an interview invite. It feels built for students, not adapted from a generic job board.",
    name: "Zainab Aslam",
    role: "BBA, IUB",
    avatarGradient: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <SectionHead kicker="What people say" title="Trusted on both sides of the hire" />
        <div className="grid md:grid-cols-3 gap-6 -mt-4">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
