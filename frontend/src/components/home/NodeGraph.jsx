import React from "react";
import { COLORS } from "../../theme";

// Positions are hand-placed (not random) so the graph reads intentionally,
// not like scattered confetti. Blue nodes = students, burgundy = companies.
const NODES = [
  { id: 1, x: 8, y: 20, type: "student" },
  { id: 2, x: 18, y: 55, type: "student" },
  { id: 3, x: 6, y: 82, type: "student" },
  { id: 4, x: 32, y: 12, type: "student" },
  { id: 5, x: 38, y: 68, type: "student" },
  { id: 6, x: 62, y: 15, type: "company" },
  { id: 7, x: 58, y: 50, type: "company" },
  { id: 8, x: 70, y: 80, type: "company" },
  { id: 9, x: 88, y: 30, type: "company" },
  { id: 10, x: 92, y: 65, type: "company" },
];

const CONNECTIONS = [
  [1, 6], [2, 7], [3, 7], [4, 6], [4, 9], [5, 7], [5, 8], [2, 9], [1, 7], [3, 8],
];

export default function NodeGraph({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.primaryLight} stopOpacity="0" />
          <stop offset="50%" stopColor={COLORS.primaryLight} stopOpacity="0.7" />
          <stop offset="100%" stopColor={COLORS.accentLight} stopOpacity="0" />
        </linearGradient>
      </defs>

      {CONNECTIONS.map(([a, b], i) => {
        const nodeA = NODES.find((n) => n.id === a);
        const nodeB = NODES.find((n) => n.id === b);
        return (
          <line
            key={i}
            x1={nodeA.x}
            y1={nodeA.y}
            x2={nodeB.x}
            y2={nodeB.y}
            stroke="url(#lineGrad)"
            strokeWidth="0.15"
            className="node-graph-line"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        );
      })}

      {NODES.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r="0.9"
          fill={n.type === "student" ? COLORS.primaryLight : COLORS.accentLight}
          className="node-graph-dot"
          style={{ animationDelay: `${n.id * 0.3}s` }}
        />
      ))}

      <style>{`
        .node-graph-line {
          stroke-dasharray: 2 3;
          animation: dashFlow 4s linear infinite;
        }
        .node-graph-dot {
          animation: nodePulse 3s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        @keyframes dashFlow {
          to { stroke-dashoffset: -50; }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @media (prefers-reduced-motion: reduce) {
          .node-graph-line, .node-graph-dot { animation: none; }
        }
      `}</style>
    </svg>
  );
}