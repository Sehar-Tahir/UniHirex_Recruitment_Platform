
import React, { useState, useEffect, useRef } from "react";

// value is null while real data is still loading. We show a grey placeholder then, never a fake 0.
export default function LiveCounter({ value, duration = 900 }) {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [shown, setShown] = useState(null);

  // Wait until the number is actually on screen before animating it
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (value == null || !inView) return undefined;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Small numbers just appear. Bigger ones tick up from 70% so the page never shows a misleading 0.
    const from = value < 10 || reduceMotion ? value : Math.floor(value * 0.7);
    const length = from === value ? 0 : duration;

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = length === 0 ? 1 : Math.min((now - start) / length, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, inView, duration]);

  return (
    <span ref={wrapRef}>
      {shown === null ? (
        <span
          className="inline-block align-middle rounded-md animate-pulse"
          style={{
            width: "1.6ch",
            minWidth: 28,
            height: "0.9em",
            background: "currentColor",
            opacity: 0.15,
          }}
        />
      ) : (
        shown.toLocaleString()
      )}
    </span>
  );
}
