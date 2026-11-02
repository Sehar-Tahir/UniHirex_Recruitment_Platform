import React from "react";

export function SkeletonBox({ className = "" }) {
return (
<div
className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
/>
);
}

export function DashboardStatSkeleton() {
return ( <div className="bg-white border border-[#ECEEF3] rounded-2xl p-5"> <SkeletonBox className="h-4 w-28 mb-4" /> <SkeletonBox className="h-8 w-16 mb-2" /> <SkeletonBox className="h-3 w-20" /> </div>
);
}

export function DashboardSectionSkeleton({ rows = 4 }) {
return ( <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white"> <SkeletonBox className="h-5 w-36 mb-6" />

  <div className="space-y-5">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex items-center gap-4">
        <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-3 w-3/4" />
          <SkeletonBox className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
</div>

);
}
