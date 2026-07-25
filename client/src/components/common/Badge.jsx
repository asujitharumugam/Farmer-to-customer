import React from 'react';

const Badge = ({ variant = 'organic', children, className = '' }) => {
  const styles = {
    organic: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    verified: 'bg-blue-100 text-blue-800 border-blue-300',
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rejected: 'bg-rose-100 text-rose-800 border-rose-300',
    harvest: 'bg-purple-100 text-purple-800 border-purple-300',
    tag: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${styles[variant] || styles.tag} ${className}`}>
      {variant === 'organic' && <span className="text-emerald-600">🌿</span>}
      {variant === 'verified' && <span className="text-blue-600">✓</span>}
      {children}
    </span>
  );
};

export default Badge;
