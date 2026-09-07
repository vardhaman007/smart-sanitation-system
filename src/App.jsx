import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_TICKETS, SANITATION_TEAMS } from './data/mockTickets';
import Navbar from './components/Navbar';
import api from './services/api';

// Page components
import Login from './pages/Login';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyTickets from './pages/citizen/MyTickets';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import AssignedTickets from './pages/worker/AssignedTickets';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllTickets from './pages/admin/AllTickets';
import TicketDetails from './pages/shared/TicketDetails';

export default function App() {
  // 1. App & Role State
  const [currentRole, setCurrentRole] = useState(() => {
    const savedUser = localStorage.getItem('sanitation_user');
    return savedUser ? JSON.parse(savedUser).role : 'citizen';
  }); // 'citizen' | 'worker' | 'admin'
  const [currentWorkerTeamId, setCurrentWorkerTeamId] = useState('TEAM-01');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('sanitation_auth_token'));
  const [userProfile, setUserProfile] = useState(() => {
    const savedUser = localStorage.getItem('sanitation_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem('sanitation_user');
    return savedUser ? `${JSON.parse(savedUser).role}-dashboard` : 'citizen-dashboard';
  });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [notification, setNotification] = useState(null);

  // 2. Backend API & PostgreSQL State (Stage 3)
  const [backendStatus, setBackendStatus] = useState({
    isOnline: false,
    dbConnected: false,
    checked: false
  });
  const [backendStats, setBackendStats] = useState(null);

  // 3. Tickets State (persisted locally and synced with PostgreSQL)
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('sih_sanitation_tickets_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tickets', e);
      }
    }
    return INITIAL_TICKETS;
  });

  // Save to localStorage as secondary backup
  useEffect(() => {
    localStorage.setItem('sih_sanitation_tickets_v3', JSON.stringify(tickets));
  }, [tickets]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Format current timestamp
  const getFormattedTimestamp = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${timeStr}, Today`;
  };

  // 4. Fetch data from PostgreSQL Backend API
  const fetchBackendData = useCallback(async () => {
    try {
      // 1. Health check
      const health = await api.checkHealth();
      const isOnline = health.status === 'ok';
      const dbConnected = health.database?.connected || false;

      setBackendStatus({
        isOnline,
        dbConnected,
        checked: true
      });

      // 2. If backend is online, fetch tickets and stats
      if (isOnline) {
        try {
          const ticketsRes = await api.getTickets();
          if (ticketsRes.success && ticketsRes.data && ticketsRes.data.length > 0) {
            setTickets(ticketsRes.data);
          }
        } catch (ticketErr) {
          console.warn('Could not load tickets from backend DB:', ticketErr.message);
        }

        try {
          const statsRes = await api.getStats();
          if (statsRes.success && statsRes.data) {
            setBackendStats(statsRes.data);
          }
        } catch (statsErr) {
          console.warn('Could not load stats from backend DB:', statsErr.message);
        }
      }
    } catch (err) {
      setBackendStatus({
        isOnline: false,
        dbConnected: false,
        checked: true
      });
      console.log('Backend API offline or unreachable. Using local store mode.');
    }
  }, []);

  // Run initial fetch on mount
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // 5. Navigation & Role Handlers
  const handleRoleSwitch = (newRole) => {
    setCurrentRole(newRole);
    setIsLoggedIn(true);

    const activeTeam = SANITATION_TEAMS.find(t => t.id === currentWorkerTeamId) || SANITATION_TEAMS[0];

    const defaultProfiles = {
      citizen: { id: '9876543210', name: 'Rahul Verma', roleTitle: 'Citizen' },
      worker: { id: activeTeam.id, name: activeTeam.name, roleTitle: `${activeTeam.name} (${activeTeam.leader})` },
      admin: { id: 'ADMIN-01', name: 'Dr. Neha Saxena', roleTitle: 'Municipal Admin' }
    };

    setUserProfile(defaultProfiles[newRole]);
    setCurrentPage(`${newRole}-dashboard`);
    setSelectedTicketId(null);
    showToast(`Switched perspective to ${defaultProfiles[newRole].roleTitle}`);
  };

  const handleSelectWorkerTeam = (teamId) => {
    setCurrentWorkerTeamId(teamId);
    const team = SANITATION_TEAMS.find(t => t.id === teamId) || SANITATION_TEAMS[0];
    setUserProfile({
      id: team.id,
      name: team.name,
      roleTitle: `${team.name} (${team.leader})`
    });
    showToast(`Active squad set to ${team.name} (Lead: ${team.leader})`);
  };

  const handleLogin = ({ user, token }) => {
    if (token) {
      localStorage.setItem('sanitation_auth_token', token);
    } else {
      localStorage.removeItem('sanitation_auth_token');
    }
    localStorage.setItem('sanitation_user', JSON.stringify(user));

    setCurrentRole(user.role);
    setUserProfile({
      id: user.id,
      name: user.name,
      roleTitle: user.role === 'admin' ? 'Municipal Administrator' : user.role === 'worker' ? 'Sanitation Worker' : 'Citizen',
      email: user.email,
      phone: user.phone
    });
    setIsLoggedIn(true);
    setCurrentPage(`${user.role}-dashboard`);

    showToast(`Signed in as ${user.name}`);
    fetchBackendData();
  };
  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setUserProfile(null);
    setCurrentRole('citizen');
    setCurrentPage('citizen-dashboard');
    showToast('Signed out of session');
  };

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    setSelectedTicketId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setCurrentPage('ticket-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Ticket Lifecycle Handlers (Connected to Backend API)

  // Citizen creates ticket
  const handleCreateTicket = async (newTicket, imageFile = null) => {
    // 1. Optimistic local update
    setTickets(prev => [newTicket, ...prev]);
    showToast(`Grievance #${newTicket.id} registered with initial status 'New'!`);

    // 2. Sync to Backend API if online
    if (backendStatus.isOnline) {
      try {
        const res = await api.createTicket(newTicket, imageFile);
        if (res.success && res.data) {
          setTickets(prev => [res.data, ...prev.filter(t => t.id !== newTicket.id)]);
          // Refresh backend stats
          api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
        }
      } catch (err) {
        console.warn('Backend save notice:', err.message);
      }
    }
  };

  // Admin assigns worker / squad
  const handleAssignWorker = async (ticketId, workerName, workerId) => {
    const timeNow = getFormattedTimestamp();

    // 1. Update local state
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const nextStatus = t.status === 'New' ? 'Assigned' : t.status;
        const newHistory = [
          ...(t.history || []),
          {
            time: timeNow,
            action: `Assigned to ${workerName}`,
            actor: `Municipal Admin (${userProfile.name})`,
            note: `Dispatched to ${workerName}. Status updated to '${nextStatus}'.`
          }
        ];
        return {
          ...t,
          assignedWorker: workerName,
          assignedWorkerId: workerId,
          status: nextStatus,
          history: newHistory
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} assigned to ${workerName}`);

    // 2. Sync to Backend API
    if (backendStatus.isOnline) {
      try {
        // Map TEAM-01 -> 2, TEAM-02 -> 3, TEAM-03 -> 2
        const numericWorkerId = workerId === 'TEAM-02' ? 3 : 2;
        await api.assignWorker(ticketId, numericWorkerId, userProfile.name);
        api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
      } catch (err) {
        console.warn('Backend assignment notice:', err.message);
      }
    }
  };

  // Admin changes priority
  const handlePriorityChange = async (ticketId, newPriority) => {
    const timeNow = getFormattedTimestamp();

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHistory = [
          ...(t.history || []),
          {
            time: timeNow,
            action: `Priority changed to ${newPriority}`,
            actor: `Municipal Admin (${userProfile.name})`,
            note: `Administrative severity triage updated.`
          }
        ];
        return {
          ...t,
          priority: newPriority,
          history: newHistory
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} priority changed to ${newPriority}`);

    if (backendStatus.isOnline) {
      try {
        await api.updateTicket(ticketId, { priority: newPriority, changed_by: userProfile.name });
        api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
      } catch (err) {
        console.warn('Backend priority notice:', err.message);
      }
    }
  };

  // Worker accepts assigned ticket
  const handleAcceptTicket = async (ticketId) => {
    const timeNow = getFormattedTimestamp();
    const activeTeam = SANITATION_TEAMS.find(t => t.id === currentWorkerTeamId) || SANITATION_TEAMS[0];

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHistory = [
          ...(t.history || []),
          {
            time: timeNow,
            action: `Worker started work (Status: In Progress)`,
            actor: activeTeam.name,
            note: `Field crew reached site and commenced sanitation cleanup.`
          }
        ];
        return {
          ...t,
          status: 'In Progress',
          history: newHistory
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} accepted! Status moved to 'In Progress'`);

    if (backendStatus.isOnline) {
      try {
        await api.updateTicketStatus(ticketId, {
          status: 'In Progress',
          note: 'Worker started work (Status: In Progress)',
          changedBy: activeTeam.name
        });
        api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
      } catch (err) {
        console.warn('Backend status notice:', err.message);
      }
    }
  };

  // Worker marks ticket as resolved with after-cleaning photo and note
  const handleSubmitResolution = async (ticketId, resolutionNote, afterImageUrl) => {
    const timeNow = getFormattedTimestamp();
    const activeTeam = SANITATION_TEAMS.find(t => t.id === currentWorkerTeamId) || SANITATION_TEAMS[0];

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHistory = [
          ...(t.history || []),
          {
            time: timeNow,
            action: `Worker marked issue as Resolved`,
            actor: activeTeam.name,
            note: `${resolutionNote} (After-cleaning verification photo attached)`
          }
        ];
        return {
          ...t,
          status: 'Resolved',
          resolutionNotes: resolutionNote,
          afterImageUrl: afterImageUrl,
          history: newHistory
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} marked as Resolved! Proof photo saved.`);

    if (backendStatus.isOnline) {
      try {
        await api.updateTicketStatus(ticketId, {
          status: 'Resolved',
          resolution_note: resolutionNote,
          after_image_url: afterImageUrl,
          changedBy: activeTeam.name
        });
        api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
      } catch (err) {
        console.warn('Backend resolution notice:', err.message);
      }
    }
  };

  // Admin closes ticket
  const handleCloseTicket = async (ticketId) => {
    const timeNow = getFormattedTimestamp();

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHistory = [
          ...(t.history || []),
          {
            time: timeNow,
            action: `Ticket Closed`,
            actor: `Municipal Admin (${userProfile.name})`,
            note: `Resolution audited and verified. Grievance closed.`
          }
        ];
        return {
          ...t,
          status: 'Closed',
          history: newHistory
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} successfully closed.`);

    if (backendStatus.isOnline) {
      try {
        await api.updateTicketStatus(ticketId, {
          status: 'Closed',
          note: 'Ticket Closed by Municipal Admin',
          changedBy: userProfile.name
        });
        api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
      } catch (err) {
        console.warn('Backend close notice:', err.message);
      }
    }
  };

  // Admin reopens ticket
  const handleReopenTicket = async (ticketId) => {
    const timeNow = getFormattedTimestamp();

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHistory = [
          ...(t.history || []),
          {
            time: timeNow,
            action: `Ticket Reopened`,
            actor: `Municipal Admin (${userProfile.name})`,
            note: `Grievance reopened for secondary sanitation review.`
          }
        ];
        return {
          ...t,
          status: 'Reopened',
          history: newHistory
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} reopened for re-inspection.`);

    if (backendStatus.isOnline) {
      try {
        await api.updateTicketStatus(ticketId, {
          status: 'Reopened',
          note: 'Ticket Reopened by Municipal Admin',
          changedBy: userProfile.name
        });
        api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
      } catch (err) {
        console.warn('Backend reopen notice:', err.message);
      }
    }
  };

  // Manual status override
  const handleStatusChange = async (ticketId, newStatus) => {
    const timeNow = getFormattedTimestamp();

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHistory = [
          ...(t.history || []),
          {
            time: timeNow,
            action: `Status updated to ${newStatus}`,
            actor: userProfile.name,
            note: `Manual override status adjustment.`
          }
        ];
        return {
          ...t,
          status: newStatus,
          history: newHistory
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId} status changed to '${newStatus}'`);

    if (backendStatus.isOnline) {
      try {
        await api.updateTicketStatus(ticketId, {
          status: newStatus,
          note: `Status updated to ${newStatus}`,
          changedBy: userProfile.name
        });
        api.getStats().then(s => s.data && setBackendStats(s.data)).catch(() => {});
      } catch (err) {
        console.warn('Backend status notice:', err.message);
      }
    }
  };

  // Reset sample data
  const handleResetData = () => {
    if (window.confirm('Reset all tickets to default Stage 3 sample dataset?')) {
      localStorage.removeItem('sih_sanitation_tickets_v3');
      setTickets(INITIAL_TICKETS);
      showToast('Sample dataset restored to initial state');
    }
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // 7. Page Content Resolver
  const renderCurrentPage = () => {
    if (!isLoggedIn) {
      return (
        <Login
          initialRole={currentRole}
          onLogin={handleLogin}
          onSelectTeam={handleSelectWorkerTeam}
        />
      );
    }

    if (currentPage === 'ticket-details') {
      return (
        <TicketDetails
          ticket={selectedTicket}
          currentRole={currentRole}
          onBack={() => {
            if (currentRole === 'citizen') setCurrentPage('my-tickets');
            else if (currentRole === 'worker') setCurrentPage('assigned-tickets');
            else setCurrentPage('all-tickets');
          }}
          onStatusChange={handleStatusChange}
          onAssignWorker={handleAssignWorker}
          onPriorityChange={handlePriorityChange}
          onAcceptTicket={handleAcceptTicket}
          onSubmitResolution={handleSubmitResolution}
          onCloseTicket={handleCloseTicket}
          onReopenTicket={handleReopenTicket}
        />
      );
    }

    switch (currentPage) {
      // Citizen Views
      case 'citizen-dashboard':
        return (
          <CitizenDashboard
            tickets={tickets}
            onNavigate={handleNavigate}
            onViewTicket={handleViewTicket}
          />
        );
      case 'report-issue':
        return (
          <ReportIssue
            onSubmitTicket={handleCreateTicket}
            onCancel={() => handleNavigate('citizen-dashboard')}
            onViewTicket={handleViewTicket}
            onNavigate={handleNavigate}
            userProfile={userProfile}
            tickets={tickets}
          />
        );
      case 'my-tickets':
        return (
          <MyTickets
            tickets={tickets}
            onNavigate={handleNavigate}
            onViewTicket={handleViewTicket}
          />
        );

      // Worker Views
      case 'worker-dashboard':
        return (
          <WorkerDashboard
            tickets={tickets}
            onNavigate={handleNavigate}
            onViewTicket={handleViewTicket}
            onAcceptTicket={handleAcceptTicket}
            onSubmitResolution={handleSubmitResolution}
            currentTeamId={currentWorkerTeamId}
            onSelectTeam={handleSelectWorkerTeam}
          />
        );
      case 'assigned-tickets':
        return (
          <AssignedTickets
            tickets={tickets}
            onNavigate={handleNavigate}
            onViewTicket={handleViewTicket}
            onAcceptTicket={handleAcceptTicket}
            onSubmitResolution={handleSubmitResolution}
            currentTeamId={currentWorkerTeamId}
            onSelectTeam={handleSelectWorkerTeam}
          />
        );

      // Admin Views
      case 'admin-dashboard':
        return (
          <AdminDashboard
            tickets={tickets}
            onNavigate={handleNavigate}
            onViewTicket={handleViewTicket}
            onAssignWorker={handleAssignWorker}
            backendStats={backendStats}
          />
        );
      case 'all-tickets':
        return (
          <AllTickets
            tickets={tickets}
            onNavigate={handleNavigate}
            onViewTicket={handleViewTicket}
            onAssignWorker={handleAssignWorker}
            onPriorityChange={handlePriorityChange}
            onStatusChange={handleStatusChange}
          />
        );

      default:
        return (
          <CitizenDashboard
            tickets={tickets}
            onNavigate={handleNavigate}
            onViewTicket={handleViewTicket}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* 1. Evaluation Demo Role Switcher Bar */}
        currentRole={currentRole}
        onRoleSwitch={handleRoleSwitch}
        onResetData={handleResetData}
        isLoggedIn={isLoggedIn}
        currentWorkerTeamId={currentWorkerTeamId}
        onSelectWorkerTeam={handleSelectWorkerTeam}
      />

      {/* 2. Backend API Status Banner */}
      <div className="bg-slate-800 text-white text-[11px] py-1 px-4 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Backend API:</span>
            {backendStatus.isOnline ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                http://localhost:5000 (Online)
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Local Mode (Run start-backend.bat to connect Node.js API)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">PostgreSQL:</span>
              {backendStatus.dbConnected ? (
                <span className="font-semibold text-emerald-400">Connected</span>
              ) : (
                <span className="font-semibold text-slate-300">
                  {backendStatus.isOnline ? 'Pending DB Setup' : 'Local Fallback'}
                </span>
              )}
            </div>
            <button
              onClick={fetchBackendData}
              className="text-[10px] text-slate-300 hover:text-white underline"
            >
              Refresh API
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Portal Header */}
      {isLoggedIn && (
        <Navbar
          currentRole={currentRole}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userProfile={userProfile}
        />
      )}

      {/* 4. Toast Notification Pill */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 5. Page Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentPage()}
      </main>

      {/* 6. Civic Tech Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              AI-Powered Smart Waste & Sanitation Management System
            </span>
            <span className="mx-2">•</span>
            <span>Stage 3: Node.js, Express & PostgreSQL Integration</span>
          </div>
          <div className="text-slate-400">
            Civic Tech Infrastructure • Swachh Bharat Urban Mission Aligned
          </div>
        </div>
      </footer>

    </div>
  );
}











