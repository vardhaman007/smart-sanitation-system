import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  UserCheck,
  ChevronLeft
} from 'lucide-react';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your email/User ID and password.');
      return;
    }

    try {
      setLoading(true);

      const result = await api.login(identifier.trim(), password);

      if (!result.success || !result.token || !result.user) {
        throw new Error(result.message || 'Login failed.');
      }

      onLogin({
        user: result.user,
        token: result.token
      });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const continueAsCitizen = () => {
    onLogin({
      user: {
        id: 'public-citizen',
        name: 'Citizen',
        email: '',
        role: 'citizen',
        phone: ''
      },
      token: null
    });
  };

  if (!showStaffLogin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg mb-5">
              <Building2 className="w-9 h-9" />
            </div>

            <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              Smart India Hackathon 2026
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Smart Sanitation
              <span className="block text-emerald-600">Management System</span>
            </h1>

            <p className="mt-4 text-slate-500 text-base sm:text-lg">
              Report sanitation problems quickly and help keep your community clean.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <button
              type="button"
              onClick={continueAsCitizen}
              className="group bg-white border-2 border-emerald-200 hover:border-emerald-500 rounded-2xl p-7 text-left shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <UserCheck className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Raise a Ticket
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Report garbage, sanitation, drainage and other civic issues.
                No staff login required.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                Continue as Citizen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowStaffLogin(true)}
              className="group bg-slate-900 hover:bg-slate-800 rounded-2xl p-7 text-left shadow-sm hover:shadow-lg transition-all text-white"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold">
                Staff Login
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Secure access for municipal administrators and sanitation
                workers.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
                Sign in to Portal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            AI-powered waste and sanitation management platform
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <button
          type="button"
          onClick={() => {
            setShowStaffLogin(false);
            setError('');
          }}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
          <div className="text-center mb-7">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white shadow-md mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              Staff Login
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to access your staff dashboard
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStaffLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email / User ID
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your staff email"
                  autoComplete="username"
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Login'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Your account role is determined securely by the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
