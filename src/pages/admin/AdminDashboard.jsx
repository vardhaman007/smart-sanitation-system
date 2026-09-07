import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  AlertTriangle, 
  MapPin, 
  UserCheck, 
  AlertOctagon,
  Users
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import { ISSUE_TYPES, SANITATION_TEAMS } from '../../data/mockTickets';

export default function AdminDashboard({ tickets, onNavigate, onViewTicket, onAssignWorker, backendStats }) {
  // 6 Core Metrics: Prefer PostgreSQL backend stats when available, fallback to tickets state
  const totalCount = backendStats?.totalTickets ?? tickets.length;
  const newCount = backendStats?.newTickets ?? tickets.filter(t => t.status === 'New').length;
  const assignedCount = backendStats?.assignedTickets ?? tickets.filter(t => t.status === 'Assigned').length;
  const inProgressCount = backendStats?.inProgressTickets ?? tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = backendStats?.resolvedTickets ?? tickets.filter(t => t.status === 'Resolved').length;
  const highCriticalCount = backendStats?.highCriticalTickets ?? tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;

  // Urgent triage: High or Critical tickets that are still "New"
  const urgentNew = tickets.filter(t => 
    (t.priority === 'High' || t.priority === 'Critical') && t.status === 'New'
  );

  // Category counts
  const categoryCounts = ISSUE_TYPES.map(type => ({
    ...type,
    count: tickets.filter(t => t.issueType === type.id).length
  }));

  // Team workload stats
  const teamWorkload = SANITATION_TEAMS.map(team => ({
    ...team,
    activeTasks: tickets.filter(t => 
      (t.assignedWorkerId === team.id || t.assignedWorker === team.name) && 
      t.status !== 'Resolved' && t.status !== 'Closed'
    ).length
  }));

  return (
    <div className="space-y-8">
      
      {/* Admin Executive Header */}
      <div className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Municipal Sanitation Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Citywide Grievance & Dispatch Oversight
            </h1>
            <p className="text-sm text-slate-300">
              Real-time monitoring, triage escalation, and field squad dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('all-tickets')}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Manage All Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage 2 Core Dashboard Metrics (6 KPIs) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Municipal Sanitation Metrics
          </h2>
          <span className="text-xs text-slate-500">
            Live municipal registry status
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Tickets"
            value={totalCount}
            icon={Layers}
            color="slate"
            subtitle="Logged citywide"
            onClick={() => onNavigate('all-tickets')}
          />
          <StatCard
            title="New"
            value={newCount}
            icon={Clock}
            color="blue"
            subtitle="Awaiting triage"
            onClick={() => onNavigate('all-tickets')}
          />
          <StatCard
            title="Assigned"
            value={assignedCount}
            icon={UserCheck}
            color="indigo"
            subtitle="Dispatched to squad"
            onClick={() => onNavigate('all-tickets')}
          />
          <StatCard
            title="In-Progress"
            value={inProgressCount}
            icon={Clock}
            color="amber"
            subtitle="Field work underway"
            onClick={() => onNavigate('all-tickets')}
          />
          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Verified & cleaned"
            onClick={() => onNavigate('all-tickets')}
          />
          <StatCard
            title="High / Critical"
            value={highCriticalCount}
            icon={AlertOctagon}
            color="rose"
            subtitle="High & Critical priority"
            onClick={() => onNavigate('all-tickets')}
          />
        </div>
      </div>

      {/* High-Priority Triage Alert Banner */}
      {urgentNew.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-600 text-white">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-900">
                  Immediate Dispatch Required: {urgentNew.length} Unassigned High/Critical Ticket{urgentNew.length > 1 ? 's' : ''}
                </h3>
                <p className="text-xs text-red-700 mt-0.5">
                  These tickets represent critical health or blockage hazards awaiting assignment to a sanitation squad.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('all-tickets')}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Assign Squads Now
            </button>
          </div>
        </div>
      )}

      {/* Category Breakdown & Field Squad Workloads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Issue Categories Distribution</span>
            <span className="text-xs text-slate-500 font-normal">Active Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categoryCounts.map(cat => (
              <div
                key={cat.id}
                onClick={() => onNavigate('all-tickets')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 truncate">{cat.label}</span>
                  <span className="text-xs font-bold text-slate-900 px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {cat.count}
                  </span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${totalCount > 0 ? (cat.count / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Squad Deployment Load */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Sanitation Squad Workload</span>
            <span className="text-xs text-slate-500 font-normal">Active Tasks</span>
          </h3>

          <div className="space-y-3">
            {teamWorkload.map((team) => (
              <div key={team.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{team.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {team.leader} • {team.zone.split('(')[0]}
                  </div>
                </div>
                <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                  team.activeTasks > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {team.activeTasks} active
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Master Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Citywide Complaints</h3>
            <p className="text-xs text-slate-500">Live incoming grievances across all municipal wards</p>
          </div>
          <button
            onClick={() => onNavigate('all-tickets')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All in Master Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Category & Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned Squad</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.slice(0, 5).map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">
                    {ticket.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{ticket.title}</div>
                    <div className="text-[11px] text-slate-400">{ticket.issueType}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate">
                    {ticket.location}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3">
                    {ticket.assignedWorker ? (
                      <span className="text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {ticket.assignedWorker}
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onViewTicket(ticket.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
