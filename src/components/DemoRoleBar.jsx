import React from 'react';
import { UserCheck, ShieldCheck, HardHat, RefreshCw, Sparkles, Users } from 'lucide-react';
import { SANITATION_TEAMS } from '../data/mockTickets';

export default function DemoRoleBar({ 
  currentRole, 
  onRoleSwitch, 
  onResetData, 
  isLoggedIn,
  currentWorkerTeamId = 'TEAM-01',
  onSelectWorkerTeam
}) {
  return (
    <aside aria-label="SIH Prototype Quick Role Switcher" className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            SIH 2026 Prototype (Stage 2)
          </span>
          <span className="hidden sm:inline text-slate-400">
            Switch perspective to test the full lifecycle:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => onRoleSwitch('citizen')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'citizen' && isLoggedIn
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => onRoleSwitch('worker')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'worker' && isLoggedIn
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Worker</span>
            </button>

            <button
              onClick={() => onRoleSwitch('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'admin' && isLoggedIn
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Quick squad picker if worker role is active */}
          {currentRole === 'worker' && isLoggedIn && (
            <div className="hidden md:flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700 text-[11px]">
              <span className="text-slate-400">Squad:</span>
              {SANITATION_TEAMS.map(team => (
                <button
                  key={team.id}
                  onClick={() => onSelectWorkerTeam && onSelectWorkerTeam(team.id)}
                  className={`px-1.5 py-0.5 rounded font-semibold ${
                    currentWorkerTeamId === team.id 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {team.name.replace('Sanitation ', '')}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onResetData}
            title="Reset tickets to default sample data"
            className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Mock Data</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
