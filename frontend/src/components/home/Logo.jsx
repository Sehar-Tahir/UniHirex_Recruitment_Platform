import React from "react";
import { COLORS, fontHead } from "../../theme";

export function LogoMark({ size = 34, dark = false }) {
  const tieColor = dark ? COLORS.accentLight : COLORS.accent;
  const barColor = dark ? COLORS.primaryLight : COLORS.primary;
  const stemColor = dark ? "#fff" : COLORS.textDark;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14 L13 9 L20 14 L13 19 Z" fill={tieColor} />
      <rect x="11.5" y="13" width="3" height="11" fill={stemColor} />
      <path d="M18 9 L22 9 L24 31 L20 36 L16 31 Z" fill={tieColor} />
      <rect x="6" y="13" width="6" height="20" fill={barColor} />
      <rect x="24" y="9" width="6" height="24" fill={barColor} />
      <rect x="24" y="19" width="10" height="6" fill={barColor} />
    </svg>
  );
}

export default function Logo({ dark = false }) {
  return (
    <div
      className="flex items-center gap-2.5 font-bold text-xl"
      style={{ ...fontHead, color: dark ? "#fff" : COLORS.primary }}
    >
      <LogoMark dark={dark} />
      UniHirex
    </div>
  );
}


// import React from "react";
// import logoIcon from "../../assets/Logo.png";
// import logoFull from "../../assets/Logo1.png";

// export function LogoMark({ size = 90 }) {
//   return <img src={logoIcon} alt="UniHirex" style={{ height: size, width: "auto" }} />;
// }

// export default function Logo({ height = 90 }) {
//   return <img src={logoFull} alt="UniHirex" style={{ height, width: "auto" }} />;
// }


// import React from "react";
// import logoIcon from "../../assets/logo.png";
// import { COLORS, fontHead } from "../../theme";

// export function LogoMark({ size = 34 }) {
//   return <img src={logoIcon} alt="UniHirex" style={{ height: size, width: "auto" }} />;
// }

// export default function Logo({ height = 80, onDark = false }) {
//   const gradient = onDark
//     ? `linear-gradient(90deg, ${COLORS.primaryLight}, ${COLORS.accentLight})`
//     : `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`;

//   return (
//     <div className="flex items-center gap-1">
//       <LogoMark size={height} />
//       <div className="flex flex-col items-center leading-none">
//         <span
//           className="font-bold text-[20px]"
//           style={{
//             ...fontHead,
//             backgroundImage: gradient,
//             WebkitBackgroundClip: "text",
//             backgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           UniHirex
//         </span>
//         <span
//           className="h-[2.5px] rounded-full mt-1"
//           style={{ width: "55%", backgroundImage: gradient }}
//         />
//       </div>
//     </div>
//   );
// }