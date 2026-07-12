import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import Button from "./Button";

export default function CTABand() {
  return (
    <section className="pb-20 md:pb-24 px-5 md:px-8">
      <div
        className="max-w-[1116px] mx-auto rounded-[28px] px-7 md:px-16 py-14 md:py-16 text-center text-white relative overflow-hidden"
        style={{ background: `linear-gradient(120deg, ${COLORS.burgundy}, ${COLORS.blue})` }}
      >
        <div
          className="absolute w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.07)", top: "-160px", right: "-100px" }}
        />
        <h2 className="text-2xl md:text-[32px] font-bold mb-3.5 relative z-10" style={fontHead}>
          Your career starts with one profile
        </h2>
        <p className="text-base mb-7 relative z-10 text-white/85" style={fontBody}>
          Join thousands of students and recruiters already connecting on UniHirex.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5 relative z-10">
          <Button variant="white">Create your profile</Button>
          <Button variant="ghost">Talk to us</Button>
        </div>
      </div>
    </section>
  );
}
