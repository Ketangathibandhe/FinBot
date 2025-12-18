import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BentoCard, CustomTooltip, getCategoryStyle } from './DashboardUI';

const CategoryChart = ({ data, total }) => {
  return (
    <BentoCard className="flex flex-col h-[400px] xl:h-auto relative">
        <h3 className="text-lg font-semibold text-white mb-4">Breakdown</h3>
        
        {data.length > 0 ? (
            <div className="flex-1 relative flex items-center justify-center pb-12">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70} 
                            outerRadius={100}
                            paddingAngle={5} 
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
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
                    <span className="text-gray-400 text-sm font-medium">Total</span>
                    <span className="text-3xl font-bold text-white tracking-tight">
                        ₹{(total / 1000).toFixed(1)}k
                    </span>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                No data yet
            </div>
        )}
        
       
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2 mt-auto">
            {data.map((entry, index) => {
                const styles = getCategoryStyle(entry._id);
                return (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: styles.color }}></div>
                        <span className="text-xs text-gray-300">{entry._id}</span>
                    </div>
                );
            })}
        </div>
    </BentoCard>
  );
};

export default CategoryChart;