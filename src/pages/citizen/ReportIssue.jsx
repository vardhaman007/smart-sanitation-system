import React, { useState } from 'react';
import { 
  Upload, 
  MapPin, 
  Trash2, 
  Check, 
  X, 
  Send, 
  Camera, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ISSUE_TYPES } from '../../data/mockTickets';

export default function ReportIssue({ onSubmitTicket, onCancel, onViewTicket, onNavigate, userProfile, tickets }) {
  const [issueType, setIssueType] = useState('Overflowing Bin');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [ward, setWard] = useState('Ward 12 (North Zone)');
  
  // Optional contact information
  const [reporterName, setReporterName] = useState(userProfile?.name || 'Rahul Verma');
  const [reporterPhone, setReporterPhone] = useState(userProfile?.id || '+91 98765 43210');
  const [reporterEmail, setReporterEmail] = useState('rahul.verma@example.com');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null); // When set, renders the success confirmation modal

  // Quick preset sample images for easy hackathon demo without needing files
  const samplePresets = [
    {
      label: 'Overflowing Bin',
      url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80'
    },
    {
      label: 'Illegal Dumping',
      url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80'
    },
    {
      label: 'Street Waste',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate sequential SAN-xxxx ID
  const generateTicketId = () => {
    const existingNums = tickets
      .map(t => {
        const match = t.id.match(/^SAN-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));

    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 1000;
    const nextNum = Math.max(maxNum + 1, 1001);
    return `SAN-${nextNum}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      alert('Please provide both a description and a location.');
      return;
    }

    setIsSubmitting(true);

    const generatedId = generateTicketId();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newTicket = {
      id: generatedId,
      title: title.trim() || `${issueType} at ${location.split(',')[0]}`,
      issueType,
      priority: 'Medium', // Stage 2 Requirement: Initial priority is Medium
      status: 'New',      // Stage 2 Requirement: Initial status is New
      location: `${location}, ${ward}`,
      zone: ward,
      description: description.trim(),
      reportedBy: reporterName.trim() || 'Anonymous Citizen',
      citizenPhone: reporterPhone.trim() || null,
      contactEmail: reporterEmail.trim() || null,
      reportedDate: formattedDate,
      assignedWorker: null,
      assignedWorkerId: null,
      imageUrl: imagePreview || samplePresets[0].url,
      afterImageUrl: null,
      resolutionNotes: null,
      history: [
        {
          time: formattedDate,
          action: 'Ticket created',
          actor: `${reporterName.trim() || 'Citizen'}`,
          note: `Report registered with initial status 'New' and priority 'Medium'.`
        }
      ]
    };

    setTimeout(() => {
      onSubmitTicket(newTicket);
      setIsSubmitting(false);
      setCreatedTicket(newTicket); // Open confirmation modal
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Civic Grievance Redressal
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
          Report Sanitation & Waste Issue
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Submit details and photos to help municipal authorities dispatch sanitation teams quickly.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        
        {/* 1. Issue Type Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            1. Select Issue Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ISSUE_TYPES.map((type) => {
              const isSelected = issueType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => {
                    setIssueType(type.id);
                    if (!title) {
                      setTitle(`${type.label} Issue`);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/40'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Title & Initial Priority Notice */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Issue Headline / Short Summary
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Overflowing Bin near Bus Stand Gate"
            className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            All new civic tickets start with status <strong>"New"</strong> and default priority <strong>"Medium"</strong> (triageable by Admin).
          </p>
        </div>

        {/* 3. Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            2. Location / Landmark <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Opposite Central Library, MG Road, Sector 4"
              required
              className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Quick Location presets */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Quick fill:</span>
            {[
              "Sector 4 Community Market",
              "Metro Station Pillar 142",
              "Main Sabzi Mandi Gate 2",
              "Central Bus Terminal"
            ].map(loc => (
              <button
                type="button"
                key={loc}
                onClick={() => setLocation(loc)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors"
              >
                + {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Ward / Zone selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Municipal Zone / Ward
          </label>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          >
            <option value="Ward 12 (North Zone)">Ward 12 (North Zone)</option>
            <option value="Ward 9 (Central Zone)">Ward 9 (Central Zone)</option>
            <option value="Ward 7 (South-West Zone)">Ward 7 (South-West Zone)</option>
            <option value="Ward 3 (East Zone)">Ward 3 (East Zone)</option>
            <option value="Ward 15 (South Zone)">Ward 15 (South Zone)</option>
          </select>
        </div>

        {/* 4. Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            3. Issue Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the severity, smells, drainage obstruction, or public safety issues..."
            required
            className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          ></textarea>
        </div>

        {/* 5. Image Upload with Live Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            4. Photo Evidence (Camera / Upload)
          </label>

          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900/5 max-w-sm">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-2 bg-white/95 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Photo attached</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Attached
                </span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
              <Camera className="mx-auto h-10 w-10 text-slate-400" />
              <div className="mt-2 flex text-sm text-slate-600 justify-center">
                <label className="relative cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 focus-within:outline-hidden">
                  <span>Upload a file or take a photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>

              {/* Demo Sample Photos */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium mb-2">
                  Or pick a sample photo for quick testing:
                </p>
                <div className="flex justify-center gap-2">
                  {samplePresets.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImagePreview(preset.url)}
                      className="px-2.5 py-1 rounded-md text-xs bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 shadow-2xs transition-colors"
                    >
                      📷 {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Optional Reporter Contact Information (Stage 2 Requirement) */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            5. Reporter Contact Details <span className="text-slate-400 font-normal">(Optional for notifications)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="Mobile Phone"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting Grievance...' : 'Submit Grievance Ticket'}</span>
          </button>
        </div>

      </form>

      {/* Submission Success Confirmation Modal (Stage 2 Requirement) */}
      {createdTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Grievance Registered Successfully
            </span>

            <h2 className="mt-3 text-xl font-extrabold text-slate-900">
              Ticket #{createdTicket.id}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your grievance has been submitted to the Municipal Sanitation Board.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{createdTicket.issueType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <span className="font-bold text-blue-700">{createdTicket.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Priority:</span>
                <span className="font-bold text-amber-700">{createdTicket.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">{createdTicket.location}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onViewTicket(createdTicket.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>View Ticket & History</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('my-tickets')}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Go to "My Tickets"
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedTicket(null);
                  setTitle('');
                  setLocation('');
                  setDescription('');
                  setImagePreview(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 pt-1"
              >
                + Report another issue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
