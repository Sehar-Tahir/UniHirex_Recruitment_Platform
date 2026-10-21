import React, { useState } from "react";
import { COLORS } from "../theme";

export default function Avatar({ name, photoUrl, sizeClass = "w-11 h-11", textClass = "" }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const showPhoto = !!photoUrl && failedUrl !== photoUrl;

  return (
    <div
      className={`${sizeClass} ${textClass} rounded-full flex items-center justify-center font-semibold text-white shrink-0 overflow-hidden`}
      style={{ background: COLORS.primary }}
    >
      {showPhoto ? (
        <img
          src={photoUrl}
          alt={name ? `${name}'s photo` : "Profile photo"}
          onError={() => setFailedUrl(photoUrl)}
          className="w-full h-full object-cover"
        />
      ) : (
        name?.[0]?.toUpperCase() || "?"
      )}
    </div>
  );
}