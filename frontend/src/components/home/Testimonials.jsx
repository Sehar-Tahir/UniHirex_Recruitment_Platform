
import React from "react";
import SectionHead from "./SectionHead";
import TestimonialCard from "./TestimonialCard";
import { FEEDBACK } from "../../data/feedback";

export default function Testimonials() {
  if (FEEDBACK.length === 0) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <SectionHead kicker="Early feedback" title="What people who've used it say" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-4">
          {FEEDBACK.map((f) => (
            <TestimonialCard key={f.name} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}