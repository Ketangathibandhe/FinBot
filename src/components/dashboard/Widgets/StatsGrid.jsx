import React from "react";
import { Wallet, Activity, CreditCard, Layers } from "lucide-react";
import { BentoCard } from "./DashboardUI";

const StatCard = ({ title, value, subValue, icon: Icon, color }) => (
  <BentoCard>
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${color}`}
        >
          <Icon size={20} />
        </div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          {title}
        </p>
      </div>

      <div className="mt-auto">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value}
        </h3>
        <p
          className={`text-xs mt-1 font-medium ${
            subValue ? "text-gray-500" : "text-transparent"
          }`}
        >
          {subValue || "-"}
        </p>
      </div>
    </div>
  </BentoCard>
);

const StatsGrid = ({ stats, expensesCount }) => {
  const cashTotal = stats.modeStats?.find((s) => s._id === "Cash")?.total || 0;
  const onlineTotal =
    stats.modeStats?.find((s) => s._id === "Online")?.total || 0;

// dont change og data make a copy and then sort it 
  const topCategory = stats.categoryStats?.length > 0 
    ? [...stats.categoryStats].sort((a, b) => b.total - a.total)[0]._id 
    : "-";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="Total Spent"
        value={`₹${stats.totalExpense.toLocaleString()}`}
        icon={Wallet}
        color="text-blue-400"
      />
      <StatCard
        title="Transactions"
        value={expensesCount}
        subValue="This Month"
        icon={Activity}
        color="text-purple-400"
      />
      <StatCard
        title="Cash / Online"
        value={`₹${cashTotal} / ₹${onlineTotal}`}
        subValue="Split"
        icon={CreditCard}
        color="text-emerald-400"
      />
      <StatCard
        title="Top Category"
        value={
          stats.categoryStats.sort((a, b) => b.total - a.total)[0]?._id || "-"
        }
        subValue="Most Active"
        icon={Layers}
        color="text-pink-400"
      />
    </div>
  );
};

export default StatsGrid;
