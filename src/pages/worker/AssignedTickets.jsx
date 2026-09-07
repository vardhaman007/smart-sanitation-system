import React, { useState } from 'react';
import { Search, HardHat, CheckCircle2, Users } from 'lucide-react';
import TicketCard from '../../components/TicketCard';
import ResolveTicketModal from '../../components/ResolveTicketModal';
import { SANITATION_TEAMS } from '../../data/mockTickets';

export default function AssignedTickets({ 
  tickets, 
  onNavigate, 
  onViewTicket, 
  onAcceptTicket, 
  onSubmitResolution,
  currentTeamId = 'TEAM-01',
  onSelectTeam
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [ticketToResolve, setTicketToResolve] = useState(null);

  const currentTeam = SANITATION_TEAMS.find(t => t.id === currentTeamId) || SANITATION_TEAMS[0];

  // Filter ONLY tickets assigned to this team
  const myTickets = tickets.filter(t => 
    t.assignedWorkerId === currentTeam.id || 
    t.assignedWorker === currentTeam.name
  );

  const filteredTickets = myTickets.filter(ticket => {
    const matchesTab = activeTab === 'All' || ticket.status === activeTab;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesPriority && matchesSearch;
  });

  const tabs = ['All', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-1">
            <HardHat className="w-3.5 h-3.5 text-amber-700" />
            Field Worker Tasks: {currentTeam.name}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Assigned Field Work Queue
          </h1>
          <p className="text-sm text-slate-500">
            Accept pending tasks, update field progress, and submit cleaning verification proofs.
          </p>
        </div>

        {/* Squad Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Squad:</span>
          {SANITATION_TEAMS.map(team => (
            <button
              key={team.id}
              onClick={() => onSelectTeam && onSelectTeam(team.id)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentTeam.id === team.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {team.name.replace('Sanitation ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {tabs.map(tab => {
            const count = tab === 'All' 
              ? myTickets.length 
              : myTickets.filter(t => t.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Priority & Search Filters */}
        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="relative w-48 sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, location..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

      </div>

      {/* Ticket Grid */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTickets.map(ticket => (
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
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No tickets found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No complaints currently match the selected status or priority filters for {currentTeam.name}.
          </p>
          <button
            onClick={() => {
              setActiveTab('All');
              setPriorityFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold text-amber-600 hover:text-amber-700"
          >
            Reset Filters
          </button>
        </div>
      )}

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
