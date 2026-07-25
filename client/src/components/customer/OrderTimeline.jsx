import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, Home } from 'lucide-react';

const OrderTimeline = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'accepted', label: 'Accepted by Farm', icon: CheckCircle2 },
    { key: 'harvested_packed', label: 'Harvested & Packed', icon: PackageCheck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'completed', label: 'Delivered', icon: Home },
  ];

  const statusOrder = ['pending', 'accepted', 'harvested_packed', 'out_for_delivery', 'completed'];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Active Line Progress */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 scale-110 shadow-lg'
                    : isDone
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-bold mt-2 text-center max-w-[80px] ${
                  isCurrent ? 'text-brand-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
