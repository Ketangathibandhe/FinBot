import React from "react";

// Shimmer effect for loading states
const Shimmer = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
);

// Stats Grid Skeleton
export const StatsGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-[#0F1219]/90 border border-white/5 rounded-3xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Shimmer className="w-10 h-10 !rounded-xl" />
          <Shimmer className="h-3 w-20" />
        </div>
        <div className="space-y-2 mt-4">
          <Shimmer className="h-7 w-28" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

// Chart Skeleton
export const ChartSkeleton = ({ className = "" }) => (
  <div
    className={`bg-[#0F1219]/90 border border-white/5 rounded-3xl p-6 ${className}`}
  >
    <Shimmer className="h-5 w-36 mb-6" />
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-end gap-2">
          <Shimmer className="h-3 w-8" />
          <Shimmer
            className="flex-1"
            style={{ height: `${Math.random() * 60 + 20}px` }}
          />
        </div>
      ))}
    </div>
  </div>
);

// Transactions Skeleton
export const TransactionsSkeleton = () => (
  <div className="bg-[#0F1219]/90 border border-white/5 rounded-3xl p-6 h-[450px]">
    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
      <Shimmer className="h-5 w-40" />
      <Shimmer className="h-3 w-24" />
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5"
        >
          <div className="flex items-center gap-4">
            <Shimmer className="w-3 h-3 !rounded-full" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-3 w-20" />
            </div>
          </div>
          <Shimmer className="h-5 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// Full Dashboard Skeleton
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <StatsGridSkeleton />
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[400px]">
      <ChartSkeleton className="xl:col-span-2 h-[400px]" />
      <ChartSkeleton className="h-[420px]" />
    </div>
    <TransactionsSkeleton />
  </div>
);

export default DashboardSkeleton;
