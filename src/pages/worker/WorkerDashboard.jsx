import React, { useState } from 'react';
import { 
  HardHat, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  Truck,
  MapPin,
  AlertTriangle,
  Users,
  UserCheck,
  AlertOctagon
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import TicketCard from '../../components/TicketCard';
import ResolveTicketModal from '../../components/ResolveTicketModal';
import { SANITATION_TEAMS } from '../../data/mockTickets';

export default function WorkerDashboard({ 
  tickets, 
  onNavigate, 
  onViewTicket, 
  onAcceptTicket, 
  onSubmitResolution,
  currentTeamId = 'TEAM-01',
  onSelectTeam
}) {
  const [ticketToResolve, setTicketToResolve] = useState(null);

  const currentTeam = SANITATION_TEAMS.find(t => t.id === currentTeamId) || SANITATION_TEAMS[0];

  // Filter ONLY tickets assigned to this team
  const myAssignedTickets = tickets.filter(t => 
    t.assignedWorkerId === currentTeam.id || 
    t.assignedWorker === currentTeam.name
  );

  // Dynamic Metrics for this Worker Team
  const totalCount = myAssignedTickets.length;
  const newCount = myAssignedTickets.filter(t => t.status === 'New').length;
  const assignedCount = myAssignedTickets.filter(t => t.status === 'Assigned').length;
  const inProgressCount = myAssignedTickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = myAssignedTickets.filter(t => t.status === 'Resolved').length;
  const highCriticalCount = myAssignedTickets.filter(t => 
    (t.priority === 'High' || t.priority === 'Critical') && t.status !== 'Resolved'
  ).length;

  // Active / Pending tasks requiring field action (Assigned or In Progress)
  const activeTasks = myAssignedTickets.filter(t => t.status === 'Assigned' || t.status === 'In Progress');

  return (
    <div className="space-y-8">
      
      {/* Field Worker Header Card with Team Switcher */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Field Worker Operations</span>
            </div>
            
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentTeam.name}
              </h1>
              <span className="text-amber-400 text-sm font-semibold">
                Lead: {currentTeam.leader}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400" /> {currentTeam.zone}
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-amber-400" /> {currentTeam.vehicle}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-400" /> {currentTeam.members} Crew Members
              </span>
            </p>
          </div>

          {/* Quick Team Switcher for Testing */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Switch Sanitation Squad:
            </label>
            <div className="flex items-center gap-1.5">
              {SANITATION_TEAMS.map(team => (
                <button
                  key={team.id}
                  onClick={() => onSelectTeam && onSelectTeam(team.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentTeam.id === team.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {team.name.replace('Sanitation ', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stage 2 Core Metrics (6 KPIs) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {currentTeam.name} Workload Summary
            </h2>
            <p className="text-xs text-slate-500">
              Showing tickets specifically assigned to this sanitation squad
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Assigned"
            value={totalCount}
            icon={Layers}
            color="slate"
            subtitle="All tasks logged"
            onClick={() => onNavigate('assigned-tickets')}
          />
          <StatCard
            title="New / Queued"
            value={newCount}
            icon={Clock}
            color="blue"
            subtitle="New in ward"
            onClick={() => onNavigate('assigned-tickets')}
          />
          <StatCard
            title="Assigned"
            value={assignedCount}
            icon={UserCheck}
            color="indigo"
            subtitle="Pending acceptance"
            onClick={() => onNavigate('assigned-tickets')}
          />
          <StatCard
            title="In-Progress"
            value={inProgressCount}
            icon={Clock}
            color="amber"
            subtitle="Currently cleaning"
            onClick={() => onNavigate('assigned-tickets')}
          />
          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Completed by squad"
            onClick={() => onNavigate('assigned-tickets')}
          />
          <StatCard
            title="High / Critical"
            value={highCriticalCount}
            icon={AlertOctagon}
            color="rose"
            subtitle="Urgent tasks"
            onClick={() => onNavigate('assigned-tickets')}
          />
        </div>
      </div>

      {/* Active Tasks Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending Field Tasks</h2>
              <p className="text-xs text-slate-500">
                Tickets assigned to {currentTeam.name} awaiting start or completion
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('assigned-tickets')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All Assigned</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeTasks.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewDetails={onViewTicket}
                showWorkerActions={true}
                onAcceptTicket={onAcceptTicket}
                onOpenResolveModal={(t) => setTicketToResolve(t)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No pending tasks!</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              All tasks assigned to {currentTeam.name} are resolved or cleared.
            </p>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {ticketToResolve && (
        <ResolveTicketModal
          ticket={ticketToResolve}
          onClose={() => setTicketToResolve(null)}
          onSubmitResolution={onSubmitResolution}
        />
      )}

    </div>
  );
}
