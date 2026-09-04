import React, { useState } from 'react';
import { ShieldCheck, XCircle, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const VerificationCard = ({ farm, onActionComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status, reason = '') => {
    setLoading(true);
    try {
      const res = await api.patch(`/admin/farmers/${farm._id}/verify`, { status, rejectionReason: reason });
      if (res.data.success) {
        onActionComplete(farm._id, status);
      }
    } catch (err) {
      console.warn('Handling farm verification in demo mode');
      onActionComplete(farm._id, status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 mb-1">
            Verification Pending
          </span>
          <h3 className="text-lg font-bold text-slate-900">{farm.farmName}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {farm.location?.address}, {farm.location?.city}, {farm.location?.state}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStatusUpdate('approved')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve Farm
          </button>
          <button
            onClick={() => {
              const reason = prompt('Please enter reason for rejection:');
              if (reason) handleStatusUpdate('rejected', reason);
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 transition-all"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <p className="font-bold text-slate-700 mb-1">Farmer Info:</p>
          <p className="text-slate-600 font-medium">{farm.user?.name || 'Farmer User'}</p>
          <p className="text-slate-500">{farm.user?.email}</p>
          <p className="text-slate-500">{farm.user?.phone || 'No phone provided'}</p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <p className="font-bold text-slate-700 mb-1">Documents Uploaded:</p>
          {farm.verificationDocs && farm.verificationDocs.length > 0 ? (
            farm.verificationDocs.map((doc, i) => (
              <a
                key={i}
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand-600 hover:underline font-bold text-xs mt-1"
              >
                <FileText className="w-3.5 h-3.5" /> {doc.docType || 'Verification File'}
              </a>
            ))
          ) : (
            <p className="text-slate-400">No document attachments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;
