import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CustomerProfile = () => {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Add Address Form State
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setName(res.data.data.user.name);
          setPhone(res.data.data.user.phone || '');
          setAddresses(res.data.data.user.addresses || []);
        }
      } catch (err) {
        console.warn('Profile fetch warning');
      }
    };
    fetchFullProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('name', name);
      data.append('phone', phone);
      if (avatarFile) data.append('avatar', avatarFile);

      const res = await api.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessage('Profile information updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newState) return;

    try {
      const res = await api.post('/users/address', {
        street: newStreet,
        city: newCity,
        state: newState,
        zipCode: newZip
      });

      if (res.data.success) {
        setAddresses(res.data.data.addresses);
        setNewStreet('');
        setNewCity('');
        setNewState('');
        setNewZip('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      const res = await api.delete(`/users/address/${addressId}`);
      if (res.data.success) {
        setAddresses(res.data.data.addresses);
      }
    } catch (err) {
      alert('Failed to remove address');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Account Profile & Address Book</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your personal contact details, avatar, and default shipping addresses.
          </p>
        </div>
        <span className="text-xs font-extrabold uppercase px-3 py-1 bg-brand-100 text-brand-800 rounded-full">
          Role: {user?.role || 'Customer'}
        </span>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Personal Details */}
        <form onSubmit={handleProfileUpdate} className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" /> Personal Info
          </h3>

          <div className="space-y-3 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl p-3 text-xs"
              />
            </div>

            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">Profile Avatar Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setAvatarFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              {updating ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Address Book */}
        <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" /> Delivery Address Book ({addresses.length})
          </h3>

          {/* Existing Addresses List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {addresses.map((addr) => (
              <div key={addr._id || addr.street} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{addr.street}</p>
                  <p className="text-slate-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                </div>
                <button
                  onClick={() => handleRemoveAddress(addr._id)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Address Form */}
          <form onSubmit={handleAddAddress} className="pt-3 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-700">
            <p className="text-slate-500">Add New Address:</p>
            <input
              type="text"
              required
              placeholder="Street Line"
              value={newStreet}
              onChange={e => setNewStreet(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="City"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
              <input
                type="text"
                required
                placeholder="State"
                value={newState}
                onChange={e => setNewState(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
              <input
                type="text"
                placeholder="Zip"
                value={newZip}
                onChange={e => setNewZip(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default CustomerProfile;
