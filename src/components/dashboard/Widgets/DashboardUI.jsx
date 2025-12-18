import React from 'react';
export const CATEGORY_STYLES = {
  Food: { color: '#3b82f6', bg: 'bg-blue-500', shadow: 'shadow-blue-500/50' }, 
  Travel: { color: '#a855f7', bg: 'bg-purple-500', shadow: 'shadow-purple-500/50' }, 
  Fuel: { color: '#10b981', bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' }, 
  Shopping: { color: '#ec4899', bg: 'bg-pink-500', shadow: 'shadow-pink-500/50' }, 
  Entertainment: { color: '#f59e0b', bg: 'bg-amber-500', shadow: 'shadow-amber-500/50' }, 
  Bills: { color: '#ef4444', bg: 'bg-red-500', shadow: 'shadow-red-500/50' }, 
  Health: { color: '#06b6d4', bg: 'bg-cyan-500', shadow: 'shadow-cyan-500/50' }, 
  Others: { color: '#6b7280', bg: 'bg-gray-500', shadow: 'shadow-gray-500/50' } 
};

export const getCategoryStyle = (cat) => CATEGORY_STYLES[cat] || CATEGORY_STYLES['Others'];

// CARD WRAPPER 
export const BentoCard = ({ children, className }) => (
  <div className={`
    relative isolate flex flex-col overflow-hidden
    bg-[#0F1219]/90 backdrop-blur-2xl 
    border border-white/5 rounded-3xl p-6 
    shadow-xl 
    transition-all duration-300 
    hover:shadow-2xl hover:shadow-blue-500/10 hover:border-white/20
    ${className}
  `}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
    <div className="relative z-10 flex-1 flex flex-col w-full">
        {children}
    </div>
  </div>
);


export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};