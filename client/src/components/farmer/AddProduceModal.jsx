import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Sprout, Sparkles, Check, Camera, Video, RefreshCw, XCircle } from 'lucide-react';
import api from '../../services/api';

const TN_PRODUCE_PRESETS = [
  {
    name: 'Chinna Vengayam',
    title: 'Perambalur Small Onions / Chinna Vengayam (சின்ன வெங்காயம்)',
    pricePerUnit: 45.00,
    unit: 'kg',
    stockQuantity: 200,
    description: 'Pungent, highly aromatic authentic Tamil Nadu small shallot onions (Chinna Vengayam), essential for Sambar and Rasam.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Madurai Tomatoes',
    title: 'Madurai Country Organic Tomatoes (மதுரை தக்காளி)',
    pricePerUnit: 22.00,
    unit: 'kg',
    stockQuantity: 180,
    description: 'Juicy, rich sour-sweet country tomatoes harvested fresh from Madurai fields. 100% organic without chemicals.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Salem Mangoes',
    title: 'Salem Malgova & Alphonso Mangoes (சேலம் மாம்பழம்)',
    pricePerUnit: 120.00,
    unit: 'kg',
    stockQuantity: 100,
    description: 'World-famous Salem organic Malgova mangoes, tree-ripened with irresistible natural sweetness.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Thanjavur Rice',
    title: 'Thanjavur Deluxe Ponni Boiled Rice (தஞ்சாவூர் பொன்னி அரிசி)',
    pricePerUnit: 62.00,
    unit: 'kg',
    stockQuantity: 400,
    description: 'Premium aged Thanjavur Cauvery delta Ponni rice, fluffy and highly nutritious for daily meals.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ooty Carrots',
    title: 'Ooty Hillside Organic Carrots (ஊட்டி கேரட்)',
    pricePerUnit: 40.00,
    unit: 'kg',
    stockQuantity: 150,
    description: 'Sweet, crunchy, deep orange carrots harvested straight from the cool Nilgiris hill terraces.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Pollachi Coconut',
    title: 'Pollachi Fresh Tender Coconut (பொள்ளாச்சி இளநீர்)',
    pricePerUnit: 35.00,
    unit: 'piece',
    stockQuantity: 250,
    description: 'Sweet, natural electrolyte-packed tender coconut with rich water content straight from Pollachi groves.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1525257831700-18389ad16575?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Erode Turmeric',
    title: 'Erode Pure Organic Turmeric Powder / Manjal (ஈரோடு மஞ்சள்)',
    pricePerUnit: 110.00,
    unit: 'kg',
    stockQuantity: 150,
    description: 'High curcumin natural vibrant yellow turmeric cultivated in Erode district.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Theni Murungakkai',
    title: 'Theni Fresh Organic Murungakkai / Drumstick (முருங்கைக்காய்)',
    pricePerUnit: 38.00,
    unit: 'kg',
    stockQuantity: 120,
    description: 'Tender long green drumsticks grown naturally in Theni & Dindigul region. Loaded with iron.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Chettinad Red Chillies',
    title: 'Chettinad Organic Dry Red Chillies (செட்டிநாடு மிளகாய்)',
    pricePerUnit: 180.00,
    unit: 'kg',
    stockQuantity: 90,
    description: 'Vibrant red, sun-dried fiery aromatic chillies cultivated in Chettinad region.',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80'
  }
];

const AddProduceModal = ({ isOpen, onClose, onRefresh, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    pricePerUnit: '',
    unit: 'kg',
    stockQuantity: '',
    harvestDate: new Date().toISOString().split('T')[0],
    isOrganic: true
  });
  const [images, setImages] = useState([]);
  const [presetImageUrl, setPresetImageUrl] = useState('');
  const [preview, setPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Live Camera Capture State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [capturedPhotoPreview, setCapturedPhotoPreview] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: categories[0]._id }));
    }
  }, [categories]);

  if (!isOpen) return null;

  const startCamera = async (mode = 'environment') => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      setCapturedPhotoPreview(null);
      setFacingMode(mode);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      alert('Camera access denied or unavailable. Select an image file directly.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedPhotoPreview(null);
  };

  const switchCameraMode = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(newMode);
  };

  const snapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhotoPreview(dataUrl);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `live_produce_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setImages([file]);
        setPreview([dataUrl]);
        setPresetImageUrl(dataUrl);
      }
    }, 'image/jpeg', 0.85);
  };

  const handleApplyPreset = (preset) => {
    setSelectedPreset(preset.name);
    setPresetImageUrl(preset.imageUrl);
    setPreview([preset.imageUrl]);
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      description: preset.description,
      pricePerUnit: preset.pricePerUnit,
      unit: preset.unit,
      stockQuantity: preset.stockQuantity,
      isOrganic: preset.isOrganic
    }));
  };

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
      
      if (images.length > 0) {
        images.forEach(img => data.append('images', img));
      } else if (presetImageUrl) {
        data.append('imageUrl', presetImageUrl);
      }

      const res = await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        onRefresh();
        onClose();
      }
    } catch (err) {
      onRefresh();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 my-8">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-brand-600" />
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">List New Tamil Nadu Farm Produce</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Publish authentic Tamil Nadu regional vegetables & organic crops</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tamil Nadu Quick Presets Bar */}
        <div className="mb-5 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tamil Nadu Authentic Crop Presets:
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700">Quick Fill</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TN_PRODUCE_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl transition-all border ${
                  selectedPreset === preset.name
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {selectedPreset === preset.name && <Check className="w-3 h-3 inline mr-1" />}
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Camera Upload Bar */}
        <div className="mb-4 p-3 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <p className="text-xs font-black text-slate-900">Live Produce Camera Capture</p>
              <p className="text-[10px] text-slate-500 font-semibold">Snap live picture of your harvest with webcam/phone</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => startCamera('environment')}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0"
          >
            <Camera className="w-4 h-4" /> Snap Live Camera
          </button>
        </div>

        {/* Image Preview Box if image ready */}
        {preview.length > 0 && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
            <img src={preview[0]} alt="Produce Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-300 shadow-sm" />
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Photo Attached</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">Produce Image Ready</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1">Produce Title (with Tamil Name)</label>
            <input
              type="text"
              required
              placeholder="e.g. Perambalur Small Onions / Chinna Vengayam (சின்ன வெங்காயம்)"
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
                placeholder="45.00"
                value={formData.pricePerUnit}
                onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">Stock Quantity Available</label>
              <input
                type="number"
                required
                placeholder="200"
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
            <label className="block mb-1">Description & Harvest Location Notes</label>
            <textarea
              rows="3"
              required
              placeholder="Describe farming practices, Tamil Nadu region origin (Madurai, Thanjavur, Salem, Pollachi, Ooty...)..."
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
              🌿 Certified Organic / Pesticide-Free Tamil Nadu Crop
            </label>
          </div>

          <div>
            <label className="block mb-1">Or Select Local Image File</label>
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
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20"
            >
              {submitting ? 'Publishing...' : 'Publish Tamil Nadu Produce'}
            </button>
          </div>
        </form>

      </div>

      {/* HTML5 WebRTC Produce Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-900">Live Produce Camera Viewfinder</h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              {capturedPhotoPreview ? (
                <img src={capturedPhotoPreview} alt="Captured preview" className="w-full h-full object-cover" />
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
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Flip Camera ({facingMode === 'environment' ? 'Rear' : 'Front'})
              </button>

              {capturedPhotoPreview ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCapturedPhotoPreview(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all"
                  >
                    Retake Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" /> Attach Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={snapPhoto}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <Camera className="w-5 h-5" /> Snap Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddProduceModal;
