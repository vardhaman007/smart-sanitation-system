import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  LayoutGrid, 
  List, 
  ChevronRight,
  Users,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/StatusBadge';
import TicketCard from '../../components/TicketCard';
import { ISSUE_TYPES, SANITATION_TEAMS } from '../../data/mockTickets';

export default function AllTickets({ 
  tickets, 
  onNavigate, 
  onViewTicket, 
  onAssignWorker, 
  onPriorityChange,
  onStatusChange 
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filtering
  const filteredTickets = tickets.filter(ticket => {
    const matchesTab = activeTab === 'All' || ticket.status === activeTab;
    const matchesCategory = categoryFilter === 'All' || ticket.issueType === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.reportedBy && ticket.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.assignedWorker && ticket.assignedWorker.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesCategory && matchesPriority && matchesSearch;
  });

  const tabs = ['All', 'New', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            Central Municipal Registry
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Municipal Sanitation Grievance Registry
          </h1>
          <p className="text-sm text-slate-500">
            Total of {tickets.length} city grievances recorded. Dispatch squads, escalate priorities, and audit progress.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Status Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1">
            {tabs.map(tab => {
              const count = tab === 'All' 
                ? tickets.length 
                : tickets.filter(t => t.status === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters: Category, Priority & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Issue Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Categories ({tickets.length})</option>
              {ISSUE_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Urgency / Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Search Grievance
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SAN-xxxx, location, reporter, squad..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Tickets Presentation: Table vs Grid */}
      {filteredTickets.length > 0 ? (
        viewMode === 'table' ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Ticket ID</th>
                    <th className="px-4 py-3">Issue & Location</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reporter Info</th>
                    <th className="px-4 py-3">Assigned Squad</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {ticket.id}
                      </td>
                      <td className="px-4 py-3 max-w-[260px]">
                        <div className="font-semibold text-slate-900 truncate">{ticket.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">{ticket.location}</div>
                        <div className="mt-0.5">
                          <CategoryBadge category={ticket.issueType} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {/* Admin Inline Priority Changer */}
                        <select
                          value={ticket.priority}
                          onChange={(e) => onPriorityChange && onPriorityChange(ticket.id, e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Critical">🔴 Critical</option>
                          <option value="High">🟠 High</option>
                          <option value="Medium">🟡 Medium</option>
                          <option value="Low">⚪ Low</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-4 py-3 text-[11px]">
                        <div className="text-slate-800 font-semibold">{ticket.reportedBy}</div>
                        <div className="text-slate-400">{ticket.citizenPhone || ticket.contactEmail || 'No contact'}</div>
                        <div className="text-slate-400 text-[10px]">{ticket.reportedDate}</div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={ticket.assignedWorkerId || ''}
                          onChange={(e) => {
                            const team = SANITATION_TEAMS.find(t => t.id === e.target.value);
                            if (team && onAssignWorker) {
                              onAssignWorker(ticket.id, team.name, team.id);
                            }
                          }}
                          className={`text-xs rounded px-2 py-1 font-semibold border cursor-pointer ${
                            ticket.assignedWorkerId 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                              : 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
                          }`}
                        >
                          <option value="" disabled>+ Assign Squad</option>
                          {SANITATION_TEAMS.map(team => (
                            <option key={team.id} value={team.id}>
                              {team.name} ({team.leader})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onViewTicket(ticket.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewDetails={onViewTicket}
              />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No tickets match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, issue category, or priority filter.
          </p>
          <button
            onClick={() => {
              setActiveTab('All');
              setCategoryFilter('All');
              setPriorityFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </button>
        </div>
      )}

    </div>
  );
}
