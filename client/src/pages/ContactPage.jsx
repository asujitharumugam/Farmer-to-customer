import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact & Support Center</h1>
        <p className="text-xs text-slate-500 font-medium">
          Have questions about produce bookings, farm accreditation, or order tracking? We're here to help.
        </p>
      </div>

      {sent && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 max-w-xl mx-auto">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Thank you for contacting us! Our team will respond within 24 hours.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-600" /> Send Us A Message
          </h3>

          <div className="space-y-3 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block mb-1">Message / Inquiry</label>
              <textarea
                rows="4"
                required
                placeholder="How can we assist you with your farm order or onboarding?"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Inquiry
            </button>
          </div>
        </form>

        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400">Email Support</h4>
              <p className="text-sm font-bold text-slate-900">support@farmdirect.com</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-earth-100 text-earth-800 flex items-center justify-center font-bold">
              <Phone className="w-6 h-6 text-earth-600" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400">Phone Support</h4>
              <p className="text-sm font-bold text-slate-900">+1 (800) 555-FARM</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400">Headquarters</h4>
              <p className="text-sm font-bold text-slate-900">124 Organic Valley Way, Greenfield, CA</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
