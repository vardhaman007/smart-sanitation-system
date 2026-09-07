import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  CheckSquare, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  HardHat, 
  User,
  Layers
} from 'lucide-react';

export default function Navbar({ currentRole, currentPage, onNavigate, onLogout, userProfile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Role configs
  const roleConfig = {
    citizen: {
      label: 'Citizen Portal',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: User,
      navItems: [
        { id: 'citizen-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'report-issue', label: 'Report Issue', icon: PlusCircle, highlight: true },
        { id: 'my-tickets', label: 'My Tickets', icon: FileText }
      ]
    },
    worker: {
      label: 'Sanitation Worker Portal',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: HardHat,
      navItems: [
        { id: 'worker-dashboard', label: 'Worker Dashboard', icon: LayoutDashboard },
        { id: 'assigned-tickets', label: 'Assigned Tickets', icon: CheckSquare }
      ]
    },
    admin: {
      label: 'Municipal Admin Portal',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Shield,
      navItems: [
        { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'all-tickets', label: 'All Tickets', icon: Layers }
      ]
    }
  };

  const currentConfig = roleConfig[currentRole] || roleConfig.citizen;
  const RoleIcon = currentConfig.icon;

  const handleNavClick = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick(`${currentRole}-dashboard`)}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-600/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent tracking-tight leading-tight">
                    SmartSanitation
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    SIH 2026
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Smart Waste & Sanitation Management System
                </p>
              </div>
            </button>

            {/* Current Role Tag */}
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentConfig.badgeColor} ml-2`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{currentConfig.label}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {currentConfig.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.highlight
                      ? isActive
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-800">
                {userProfile?.name || 'Authorized User'}
              </div>
              <div className="text-[11px] text-slate-500 capitalize">
                {userProfile?.roleTitle || currentRole}
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 mb-2">
            <RoleIcon className="w-4 h-4 text-emerald-600" />
            <span>Active Role: {currentConfig.label}</span>
          </div>

          {currentConfig.navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 text-slate-500" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">{userProfile?.name}</div>
              <div className="text-[11px] text-slate-500">{userProfile?.roleTitle}</div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
