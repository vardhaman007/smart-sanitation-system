import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Users, 
  ShieldCheck, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Camera, 
  Check, 
  AlertOctagon,
  RefreshCw,
  CheckCheck
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/StatusBadge';
import ResolveTicketModal from '../../components/ResolveTicketModal';
import { SANITATION_TEAMS } from '../../data/mockTickets';

export default function TicketDetails({ 
  ticket, 
  currentRole, 
  onBack, 
  onStatusChange, 
  onAssignWorker, 
  onPriorityChange,
  onAcceptTicket,
  onSubmitResolution,
  onCloseTicket,
  onReopenTicket
}) {
  const [showImageModal, setShowImageModal] = useState(null); // image url to view in modal
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  if (!ticket) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Ticket Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This grievance ticket could not be located.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      
      {/* Top Bar: Back & Ticket Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-800 text-white shadow-2xs">
            #{ticket.id}
          </span>
          <CategoryBadge category={ticket.issueType} />
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Main Grid: Details (Left 2/3) & Actions / History (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Complaint Details, Photos, Reporter Info */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                <span>Sanitation Grievance</span>
                <span>•</span>
                <span>{ticket.zone || 'Municipal Ward'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {ticket.title}
              </h1>
            </div>

            {/* Location Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Location & Landmark
                </h2>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {ticket.location}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Description
              </h2>
              <p className="text-sm text-slate-700 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
{/* AI Complaint Analysis */}
{currentRole !== 'citizen' && ticket.aiReason && (
  <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5 space-y-4">
    
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-violet-950">
            AI Complaint Analysis
          </h2>
          <p className="text-[11px] text-violet-700">
            Automated sanitation triage
          </p>
        </div>
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-violet-100 text-violet-700">
        AI Score: {ticket.aiScore ?? 0}
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-white rounded-xl border border-violet-100 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Detected Category
        </div>
        <div className="text-sm font-bold text-slate-900 mt-1">
          {ticket.issueType}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-violet-100 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          AI Priority
        </div>
        <div className="text-sm font-bold text-slate-900 mt-1">
          {ticket.priority}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-violet-100 p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        Why this priority?
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">
        {ticket.aiReason}
      </p>
    </div>

    {ticket.aiRecommendedAction && (
      <div className="bg-white rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Recommended Action
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {ticket.aiRecommendedAction}
        </p>
      </div>
    )}

  </div>
)}

            {/* Visual Evidence: Before & After Photos (Stage 2 Requirement) */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  Site Photographic Evidence
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Click to enlarge</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Before Photo (Citizen Report) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Before Cleaning (Reported Issue)
                  </span>
                  {ticket.imageUrl ? (
                    <div 
                      onClick={() => setShowImageModal({ url: ticket.imageUrl, title: 'Original Citizen Complaint Evidence' })}
                      className="rounded-xl overflow-hidden border border-slate-200 h-48 bg-slate-900/5 cursor-pointer group relative"
                    >
                      <img
                        src={ticket.imageUrl}
                        alt="Before cleaning"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        View Full Photo
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                      No photo attached
                    </div>
                  )}
                </div>

                {/* 2. After Photo (Worker Resolution Proof) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    After Cleaning (Worker Proof)
                  </span>
                  {ticket.afterImageUrl ? (
                    <div 
                      onClick={() => setShowImageModal({ url: ticket.afterImageUrl, title: 'Worker Cleaning Verification Proof' })}
                      className="rounded-xl overflow-hidden border border-emerald-300 h-48 bg-slate-900/5 cursor-pointer group relative"
                    >
                      <img
                        src={ticket.afterImageUrl}
                        alt="After cleaning proof"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        View Full Photo
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                      <Camera className="w-6 h-6 text-slate-300 mb-1" />
                      <span>Pending resolution proof</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Uploaded by worker upon cleanup</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Proof / Notes (if resolved) */}
            {ticket.resolutionNotes && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Field Resolution Verification Notes
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                  {ticket.resolutionNotes}
                </p>
              </div>
            )}

            {/* Citizen & Worker Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <div className="text-slate-500 font-medium">Reported By</div>
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {ticket.reportedBy}
                </div>
                {ticket.citizenPhone && (
                  <div className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {ticket.citizenPhone}
                  </div>
                )}
                {ticket.contactEmail && (
                  <div className="text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {ticket.contactEmail}
                  </div>
                )}
                <div className="text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {ticket.reportedDate}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-500 font-medium">Assigned Sanitation Squad</div>
                {ticket.assignedWorker ? (
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      {ticket.assignedWorker}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Assigned Squad ID: {ticket.assignedWorkerId}
                    </div>
                  </div>
                ) : (
                  <div className="inline-block px-2 py-0.5 rounded text-amber-800 bg-amber-50 border border-amber-200 font-semibold text-[11px]">
                    Pending Assignment
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Role Actions & Live History Audit Trail */}
        <div className="space-y-6">
          
          {/* Role-Specific Action Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Action Controls ({currentRole.toUpperCase()})
            </h2>

            {/* WORKER CONTROLS */}
            {currentRole === 'worker' && (
              <div className="space-y-3">
                {ticket.status === 'Assigned' && (
                  <div>
                    <p className="text-xs text-slate-600 mb-2">
                      This ticket is assigned to your squad. Accept it to log that cleaning is beginning.
                    </p>
                    <button
                      type="button"
                      onClick={() => onAcceptTicket && onAcceptTicket(ticket.id)}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Accept Ticket & Start Work</span>
                    </button>
                  </div>
                )}

                {ticket.status === 'In Progress' && (
                  <div>
                    <p className="text-xs text-slate-600 mb-2">
                      Cleaning is underway. Once finished, submit your resolution summary and after-photo.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsResolveModalOpen(true)}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Issue as Resolved</span>
                    </button>
                  </div>
                )}

                {ticket.status === 'Resolved' && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resolved by Sanitation Squad
                    </p>
                    <p className="mt-1 text-emerald-800 text-[11px]">
                      Your cleaning proof has been logged and is awaiting municipal administrative sign-off.
                    </p>
                  </div>
                )}

                {ticket.status === 'Closed' && (
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCheck className="w-4 h-4 text-slate-500" /> Ticket Closed
                    </p>
                    <p className="mt-1 text-slate-500 text-[11px]">
                      This complaint has been verified and permanently closed by municipal administration.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN CONTROLS */}
            {currentRole === 'admin' && (
              <div className="space-y-4">
                {/* 1. Assign Squad */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Field Sanitation Squad:
                  </label>
                  <select
                    value={ticket.assignedWorkerId || ''}
                    onChange={(e) => {
                      const team = SANITATION_TEAMS.find(t => t.id === e.target.value);
                      if (team && onAssignWorker) {
                        onAssignWorker(ticket.id, team.name, team.id);
                      }
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                  >
                    <option value="" disabled>Select Squad</option>
                    {SANITATION_TEAMS.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.leader} - {team.zone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Triage Priority */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Triage Priority Level:
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => onPriorityChange && onPriorityChange(ticket.id, e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                  >
                    <option value="Critical">🔴 Critical (Urgent public risk)</option>
                    <option value="High">🟠 High (Choked drains, heavy dumping)</option>
                    <option value="Medium">🟡 Medium (Routine cleanup)</option>
                    <option value="Low">⚪ Low (Minor unsegregated waste)</option>
                  </select>
                </div>

                {/* 3. Status Transitions (Close / Reopen) */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Administrative Lifecycle Actions:
                  </label>

                  {ticket.status === 'Resolved' && (
                    <button
                      type="button"
                      onClick={() => onCloseTicket && onCloseTicket(ticket.id)}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Verify & Close Ticket</span>
                    </button>
                  )}

                  {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                    <button
                      type="button"
                      onClick={() => onReopenTicket && onReopenTicket(ticket.id)}
                      className="w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reopen Grievance</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500">Override:</span>
                    <select
                      value={ticket.status}
                      onChange={(e) => onStatusChange && onStatusChange(ticket.id, e.target.value)}
                      className="flex-1 text-[11px] bg-white border border-slate-200 rounded p-1 text-slate-700"
                    >
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                      <option value="Reopened">Reopened</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* CITIZEN VIEW NOTE */}
            {currentRole === 'citizen' && (
              <div className="text-xs text-slate-600 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                <p className="font-bold text-emerald-900">
                  Citizen Redressal Tracking
                </p>
                <p className="text-[11px] leading-relaxed">
                  Your grievance is registered with the Municipal Board. Any updates by the admin or field sanitation teams appear automatically in the history log below.
                </p>
              </div>
            )}

          </div>

          {/* Ticket History / Timeline (Stage 2 Requirement) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Ticket History Audit Log</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </h2>

            <div className="relative pl-4 space-y-4 border-l-2 border-slate-200 ml-2 text-xs">
              {(ticket.history || []).map((entry, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800 ring-2 ring-slate-200" />
                  <div className="text-[10px] font-semibold text-slate-400">
                    {entry.time}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {entry.action}
                  </div>
                  {entry.actor && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      By: {entry.actor}
                    </div>
                  )}
                  {entry.note && (
                    <div className="text-[11px] text-slate-600 mt-0.5 bg-slate-50 p-1.5 rounded border border-slate-100">
                      {entry.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Resolution Modal for Worker */}
      {isResolveModalOpen && (
        <ResolveTicketModal
          ticket={ticket}
          onClose={() => setIsResolveModalOpen(false)}
          onSubmitResolution={onSubmitResolution}
        />
      )}

      {/* Full Image Modal */}
      {showImageModal && (
        <div 
          onClick={() => setShowImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl relative">
            <img
              src={showImageModal.url}
              alt={showImageModal.title}
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
            <div className="p-3 bg-slate-900 text-white text-xs flex justify-between items-center">
              <span>{showImageModal.title}</span>
              <button
                onClick={() => setShowImageModal(null)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
