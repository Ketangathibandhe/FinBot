import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BentoCard, CustomTooltip, getCategoryStyle } from "./DashboardUI";

const CategoryChart = ({ data, total }) => {
  return (
    <BentoCard className="flex flex-col h-[420px] xl:h-auto relative min-h-[400px]">
      <h3 className="text-lg font-semibold text-white mb-1 shrink-0">
        Breakdown
      </h3>

      {data.length > 0 ? (
        <>
          <div className="h-56 relative w-full shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="_id"
                  stroke="none"
                >
                  {data.map((entry, index) => {
                    const styles = getCategoryStyle(entry._id);
                    return <Cell key={`cell-${index}`} fill={styles.color} />;
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-gray-400 text-xs font-medium">Total</span>
              <span className="text-2xl font-bold text-white tracking-tight">
                ₹{(total / 1000).toFixed(1)}k
              </span>
            </div>
          </div>

          <div className="flex-1 w-full overflow-y-auto custom-scrollbar mt-2">
            <div className="flex flex-wrap justify-center content-start gap-x-3 gap-y-2">
              {data.map((entry, index) => {
                const styles = getCategoryStyle(entry._id);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-1 py-0.5 rounded-md bg-white/5 border border-white/5"
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: styles.color }}
                    ></div>
                    <span className="text-[11px] font-medium text-gray-300 whitespace-nowrap">
                      {entry._id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No data yet
        </div>
      )}
    </BentoCard>
  );
};

export default CategoryChart;
