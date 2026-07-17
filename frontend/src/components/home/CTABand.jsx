import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import Button from "./Button";
import NodeGraph from "./NodeGraph";

export default function CTABand() {
  return (
    <section className="pb-20 md:pb-24 px-5 md:px-8">
      <div
        className="max-w-279 mx-auto rounded-[28px] px-7 md:px-16 py-16 md:py-20 text-center text-white relative overflow-hidden"
        style={{ background: "#0A0E27" }}
      >
        <NodeGraph className="absolute inset-0 w-full h-full opacity-60" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 100%, rgba(122,18,69,0.35), transparent 55%)",
          }}
        />

        <div className="relative z-10">
          <h2 className="text-2xl md:text-[34px] font-bold mb-3.5" style={fontHead}>
            Your career starts with one profile
          </h2>
          <p className="text-base mb-8 text-white/70" style={fontBody}>
            Join thousands of students and recruiters already connecting on UniHirex.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Button variant="white" to="/register">Create your profile</Button>
            <Button variant="ghost" to="/contact">Talk to us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}