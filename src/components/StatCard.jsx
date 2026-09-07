import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, subtitle, onClick, isActive }) {
  const colorMap = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50/70',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    },
    amber: {
      border: 'border-amber-500',
      bg: 'bg-amber-50/70',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800'
    },
    emerald: {
      border: 'border-emerald-600',
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    rose: {
      border: 'border-rose-500',
      bg: 'bg-rose-50/70',
      text: 'text-rose-700',
      badge: 'bg-rose-100 text-rose-800'
    },
    slate: {
      border: 'border-slate-500',
      bg: 'bg-slate-50/70',
      text: 'text-slate-700',
      badge: 'bg-slate-200 text-slate-800'
    }
  };

  const scheme = colorMap[color] || colorMap.slate;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 shadow-sm transition-all duration-200 relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${isActive ? `ring-2 ring-offset-1 ${scheme.border} border-transparent` : 'border-slate-200'}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${scheme.bg.replace('/70', '')} ${scheme.border.replace('border-', 'bg-')}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}
