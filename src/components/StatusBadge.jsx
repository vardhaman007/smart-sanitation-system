import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  UserCheck, 
  RefreshCw, 
  CheckCheck,
  AlertOctagon
} from 'lucide-react';

export function StatusBadge({ status }) {
  switch (status) {
    case 'New':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping mr-0.5"></span>
          New
        </span>
      );
    case 'Assigned':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <UserCheck className="w-3.5 h-3.5" />
          Assigned
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolved
        </span>
      );
    case 'Reopened':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <RefreshCw className="w-3.5 h-3.5" />
          Reopened
        </span>
      );
    case 'Closed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Info className="w-3.5 h-3.5" />
          {status}
        </span>
      );
  }
}

export function PriorityBadge({ priority }) {
  switch (priority) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-red-600 text-white border border-red-700 shadow-xs">
          <AlertOctagon className="w-3 h-3 animate-pulse" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <ShieldAlert className="w-3 h-3" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3" />
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {priority}
        </span>
      );
  }
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
      {category}
    </span>
  );
}
