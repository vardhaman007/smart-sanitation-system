import React from 'react';
import { 
  PlusCircle, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  UserCheck,
  AlertOctagon,
  Camera
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import TicketCard from '../../components/TicketCard';

export default function CitizenDashboard({ tickets, onNavigate, onViewTicket }) {
  // Compute Stage 2 Dynamic Metrics
  const totalCount = tickets.length;
  const newCount = tickets.filter(t => t.status === 'New').length;
  const assignedCount = tickets.filter(t => t.status === 'Assigned').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const highCriticalCount = tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;

  // Recent 3 tickets
  const recentTickets = [...tickets].slice(0, 3);

  return (
    <div className="space-y-8">
      
      {/* Welcome & Call-to-Action Hero */}
      <div className="bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 backdrop-blur-xs text-xs font-semibold text-emerald-200 border border-emerald-600/50 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Citizen Sanitation Redressal Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Keep Our City Clean, Green & Healthy
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Spot overflowing dustbins, uncollected waste, or dirty public places?
            Report directly with photo evidence to municipal sanitation field teams.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('report-issue')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>Report Waste Issue</span>
            </button>
            <button
              onClick={() => onNavigate('my-tickets')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/70 text-white font-semibold text-sm border border-emerald-500/40 transition-colors"
            >
              <span>Track My Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Camera className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Stage 2 Core Dashboard Metrics (6 KPIs) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Sanitation Activity Overview
          </h2>
          <span className="text-xs text-slate-500">
            Real-time municipal status
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Tickets"
            value={totalCount}
            icon={Layers}
            color="slate"
            subtitle="Registered citywide"
            onClick={() => onNavigate('my-tickets')}
          />
          <StatCard
            title="New"
            value={newCount}
            icon={Clock}
            color="blue"
            subtitle="Pending review"
            onClick={() => onNavigate('my-tickets')}
          />
          <StatCard
            title="Assigned"
            value={assignedCount}
            icon={UserCheck}
            color="indigo"
            subtitle="Assigned to squad"
            onClick={() => onNavigate('my-tickets')}
          />
          <StatCard
            title="In-Progress"
            value={inProgressCount}
            icon={Clock}
            color="amber"
            subtitle="Crew cleaning on-site"
            onClick={() => onNavigate('my-tickets')}
          />
          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Cleaned & verified"
            onClick={() => onNavigate('my-tickets')}
          />
          <StatCard
            title="High / Critical"
            value={highCriticalCount}
            icon={AlertOctagon}
            color="rose"
            subtitle="High & Critical priority"
            onClick={() => onNavigate('my-tickets')}
          />
        </div>
      </div>

      {/* Recent Community Tickets Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Public Reports</h2>
            <p className="text-xs text-slate-500">Live sanitation issues being resolved across municipal wards</p>
          </div>
          <button
            onClick={() => onNavigate('my-tickets')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onViewDetails={onViewTicket}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
