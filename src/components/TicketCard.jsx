import React from 'react';
import { MapPin, Calendar, Users, ArrowRight, Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from './StatusBadge';

export default function TicketCard({ ticket, onViewDetails, showWorkerActions, onAcceptTicket, onOpenResolveModal }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header: ID, Category, Priority */}
        <div className="p-4 pb-2.5 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
              #{ticket.id}
            </span>
            <CategoryBadge category={ticket.issueType} />
          </div>
          <PriorityBadge priority={ticket.priority} />
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div className="flex gap-3">
            {ticket.imageUrl && (
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative group">
                <img
                  src={ticket.imageUrl}
                  alt={ticket.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                  }}
                />
                {ticket.afterImageUrl && (
                  <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-0.5 rounded-tl text-[9px]" title="Cleaned proof uploaded">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                {ticket.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                {ticket.description}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{ticket.location}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ticket.reportedDate}</span>
              </div>
              {ticket.assignedWorker ? (
                <div className="flex items-center gap-1 text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[11px] font-medium">
                  <Users className="w-3 h-3 text-indigo-500" />
                  <span className="truncate max-w-[130px]">{ticket.assignedWorker}</span>
                </div>
              ) : (
                <div className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Unassigned
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Status & Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <StatusBadge status={ticket.status} />

        <div className="flex items-center gap-2">
          {showWorkerActions && ticket.status === 'Assigned' && onAcceptTicket && (
            <button
              onClick={() => onAcceptTicket(ticket.id)}
              className="text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Accept & Start
            </button>
          )}

          {showWorkerActions && ticket.status === 'In Progress' && onOpenResolveModal && (
            <button
              onClick={() => onOpenResolveModal(ticket)}
              className="text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Mark Resolved
            </button>
          )}

          <button
            onClick={() => onViewDetails(ticket.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
