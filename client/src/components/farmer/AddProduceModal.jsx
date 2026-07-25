import React, { useState, useEffect } from 'react';
import { X, Upload, Sprout } from 'lucide-react';
import api from '../../services/api';

const AddProduceModal = ({ isOpen, onClose, onRefresh, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    pricePerUnit: '',
    unit: 'kg',
    stockQuantity: '',
    harvestDate: '',
    isOrganic: true
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categories && categories.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: categories[0]._id }));
    }
  }, [categories]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      images.forEach(img => data.append('images', img));

      const res = await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        onRefresh();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add produce listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-brand-600" />
            <h3 className="text-lg font-extrabold text-slate-900">List New Farm Produce</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1">Produce Name / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Heirloom Organic Tomatoes"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Category</label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-brand-500"
              >
                {categories?.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Unit Type</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-brand-500"
              >
                <option value="kg">Per Kilogram (kg)</option>
                <option value="gram">Per Gram</option>
                <option value="piece">Per Piece / Item</option>
                <option value="dozen">Per Dozen</option>
                <option value="box">Per Farm Box</option>
                <option value="litre">Per Litre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Price per Unit (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="40.00"
                value={formData.pricePerUnit}
                onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">Initial Stock Quantity</label>
              <input
                type="number"
                required
                placeholder="100"
                value={formData.stockQuantity}
                onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Expected Harvest Date</label>
            <input
              type="date"
              required
              value={formData.harvestDate}
              onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block mb-1">Description & Harvest Notes</label>
            <textarea
              rows="3"
              required
              placeholder="Describe farming practices, taste profile, harvest condition..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="organicToggle"
              checked={formData.isOrganic}
              onChange={e => setFormData({ ...formData, isOrganic: e.target.checked })}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
            />
            <label htmlFor="organicToggle" className="cursor-pointer font-bold text-slate-800">
              🌿 Certified Organic / Pesticide Free Produce
            </label>
          </div>

          <div>
            <label className="block mb-1">Produce Photos (Cloudinary Upload)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-600/20"
            >
              {submitting ? 'Publishing...' : 'Publish Produce'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddProduceModal;
