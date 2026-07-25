import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Upload, FileText, ArrowRight } from 'lucide-react';
import api from '../services/api';

const FarmerOnboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    farmName: '',
    story: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    farmSizeAcres: 5
  });
  const [docFile, setDocFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (docFile) data.append('document', docFile);

      const res = await api.post('/farmers/onboard', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        navigate('/farmer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit farm profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-earth-500/20 text-earth-800 flex items-center justify-center mx-auto border border-earth-200">
            <Tractor className="w-7 h-7 text-earth-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Farm Profile & Verification Setup</h1>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            Submit your farm details and land accreditation documents for administrator review.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1">Farm Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sunny Valley Organic Farm"
              value={formData.farmName}
              onChange={e => setFormData({ ...formData, farmName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block mb-1">Farm Story & Agricultural Practices</label>
            <textarea
              rows="3"
              required
              placeholder="Tell customers about your farm history, soil practices, pesticide-free methods..."
              value={formData.story}
              onChange={e => setFormData({ ...formData, story: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="124 County Road 9"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">City</label>
              <input
                type="text"
                required
                placeholder="Greenfield"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">State</label>
              <input
                type="text"
                required
                placeholder="California"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                required
                value={formData.farmSizeAcres}
                onChange={e => setFormData({ ...formData, farmSizeAcres: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block mb-1">Land Registry / Organic Accreditation Document</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={e => setDocFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? 'Submitting Application...' : 'Submit Farm Verification Application'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default FarmerOnboarding;
