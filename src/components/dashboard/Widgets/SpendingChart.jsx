import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BentoCard, CustomTooltip } from './DashboardUI';

const SpendingChart = ({ data }) => {
  return (
    <BentoCard className="xl:col-span-2 flex flex-col h-[400px] xl:h-auto">
        <h3 className="text-lg font-semibold text-white mb-6">Spending Activity</h3>
        <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis 
                dataKey="_id" 
                tickFormatter={(str) => str.slice(8)} 
                stroke="#4b5563" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
            />
            <YAxis 
                stroke="#4b5563" 
                fontSize={12} 
                tickFormatter={(val) => `₹${val/1000}k`} 
                tickLine={false}
                axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                fill="url(#colorTotal)" 
            />
            </AreaChart>
        </ResponsiveContainer>
        </div>
    </BentoCard>
  );
};

export default SpendingChart;