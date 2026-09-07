import React, { useState } from 'react';
import { Camera, X, CheckCircle2, Upload, Sparkles, Check } from 'lucide-react';

export default function ResolveTicketModal({ ticket, onClose, onSubmitResolution }) {
  const [note, setNote] = useState('');
  const [afterImagePreview, setAfterImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset clean photos for quick hackathon testing
  const cleanPresets = [
    {
      label: 'Clean Road & Cleared Bin',
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80'
    },
    {
      label: 'Disinfected Pavement',
      url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80'
    },
    {
      label: 'Clean Public Area',
      url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) {
      alert('Please provide a resolution note describing the cleaning action taken.');
      return;
    }

    setIsSubmitting(true);
    const finalImage = afterImagePreview || cleanPresets[0].url;

    setTimeout(() => {
      onSubmitResolution(ticket.id, note.trim(), finalImage);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mark Issue as Resolved
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                #{ticket.id} — {ticket.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Resolution Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Resolution Note & Work Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Cleared 2 tons of overflowing garbage via compactor truck. Washed pavement with high pressure jet and sprayed disinfectant powder."
              required
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* After-Cleaning Image Upload (Stage 2 Requirement) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Upload After-Cleaning Image Proof
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Attach a photo of the cleared area (saved for verification).
            </p>

            {afterImagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-emerald-300 max-h-48 bg-slate-900/5">
                <img
                  src={afterImagePreview}
                  alt="After cleaning preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setAfterImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="p-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center justify-between border-t border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> After-photo attached
                  </span>
                  <span className="text-[10px] text-emerald-600">Ready</span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 text-center bg-slate-50/50">
                <Camera className="mx-auto h-7 w-7 text-slate-400" />
                <div className="mt-1 flex text-xs text-slate-600 justify-center">
                  <label className="relative cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700">
                    <span>Upload after-cleaning photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200">
                  <p className="text-[10px] text-slate-400 mb-1">Or pick a demo clean photo:</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {cleanPresets.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAfterImagePreview(preset.url)}
                        className="px-2 py-0.5 rounded text-[11px] bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-800"
                      >
                        ✨ {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Confirm Resolution'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
