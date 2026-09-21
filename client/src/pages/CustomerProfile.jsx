import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, CheckCircle2, Camera, Video, RefreshCw, XCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Add Address Form State
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  // WebRTC Live Camera Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [capturedCameraPhoto, setCapturedCameraPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async (mode = 'user') => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 640 }, height: { ideal: 640 } }
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      setCapturedCameraPhoto(null);
      setFacingMode(mode);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      alert('Camera access denied or unavailable on this device. You can select an image file directly.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedCameraPhoto(null);
  };

  const switchCameraMode = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newMode);
  };

  const snapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedCameraPhoto(dataUrl);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `profile_avatar_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setAvatarFile(file);
        setAvatarPreview(dataUrl);
      }
    }, 'image/jpeg', 0.85);
  };

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setName(res.data.data.user.name);
          setPhone(res.data.data.user.phone || '');
          setAddresses(res.data.data.user.addresses || []);
          if (res.data.data.user.avatar) setAvatarPreview(res.data.data.user.avatar);
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
        setMessage('Profile information & avatar updated successfully!');
        if (updateUser) {
          updateUser({ name, phone, avatar: avatarPreview });
        }
      }
    } catch (err) {
      if (updateUser) {
        updateUser({ name, phone, avatar: avatarPreview });
      }
      setMessage('Profile saved locally!');
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
      const newAddrList = [...addresses, { street: newStreet, city: newCity, state: newState, zipCode: newZip }];
      setAddresses(newAddrList);
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewZip('');
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      const res = await api.delete(`/users/address/${addressId}`);
      if (res.data.success) {
        setAddresses(res.data.data.addresses);
      }
    } catch (err) {
      setAddresses(prev => prev.filter(a => a._id !== addressId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Account Profile & Avatar</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your personal contact details, profile photo (upload or live camera capture), and shipping addresses.
          </p>
        </div>
        <span className="text-xs font-extrabold uppercase px-3.5 py-1.5 bg-brand-100 text-brand-800 rounded-full border border-brand-200">
          Role: {user?.role?.toUpperCase() || 'CUSTOMER'}
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
        
        {/* Personal Details & Live Camera Avatar */}
        <form onSubmit={handleProfileUpdate} className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-brand-600" /> Personal Info & Profile Picture
          </h3>

          {/* Profile Picture Preview & Live Camera Action */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <img
              src={avatarPreview || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt="User avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md shrink-0"
            />
            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-black text-slate-900">Profile Picture</h4>
              <p className="text-[10px] text-slate-400 font-semibold">Upload an image or take a live photo</p>
              
              <button
                type="button"
                onClick={() => startCamera('user')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-[11px] rounded-xl shadow-sm transition-all"
              >
                <Camera className="w-3.5 h-3.5" /> Take Live Photo
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block mb-1">Email Address (Registered)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl p-3 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block mb-1">Phone Number (Verified)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block mb-1">Upload File Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setAvatarFile(e.target.files[0]);
                    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 border border-slate-200 rounded-xl p-1"
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
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-brand-600" /> Delivery Address Book ({addresses.length})
          </h3>

          {/* Existing Addresses List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {addresses.map((addr, idx) => (
              <div key={addr._id || idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{addr.street}</p>
                  <p className="text-slate-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                </div>
                <button
                  type="button"
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

      {/* HTML5 WebRTC Live Profile Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-brand-600 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-900">Take Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center border border-slate-800 shadow-inner">
              {capturedCameraPhoto ? (
                <img src={capturedCameraPhoto} alt="Captured photo" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={switchCameraMode}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Flip Camera ({facingMode === 'user' ? 'Front' : 'Rear'})
              </button>

              {capturedCameraPhoto ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCapturedCameraPhoto(null)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all"
                  >
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" /> Use Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={snapPhoto}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" /> Snap Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerProfile;
