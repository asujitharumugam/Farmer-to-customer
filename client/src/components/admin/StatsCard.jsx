import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'brand', subtext }) => {
  const colorMap = {
    brand: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h3>
        {subtext && <p className="text-[11px] font-semibold text-slate-500 mt-1">{subtext}</p>}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color] || colorMap.brand}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatsCard;
