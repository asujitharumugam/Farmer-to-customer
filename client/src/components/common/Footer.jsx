import React from 'react';
import { Sprout, ShieldCheck, Heart, Truck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 font-sans mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800 text-center md:text-left">
          <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Farm Origin</h4>
              <p className="text-xs text-slate-400">100% trace-back to local family farms and organic growers.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-earth-500/20 text-earth-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Peak Freshness Delivery</h4>
              <p className="text-xs text-slate-400">Produce is harvested within 24 hours of scheduled dispatch.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Farm Accreditation</h4>
              <p className="text-xs text-slate-400">Admin-reviewed organic certifications & land safety audits.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                🌱
              </div>
              <span className="text-xl font-extrabold text-white">FarmDirect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering independent farmers with fair prices while giving consumers direct access to fresh, seasonal, and organic harvest.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Produce Categories</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/shop?category=vegetables" className="hover:text-brand-400 transition-colors">Heirloom Vegetables</Link></li>
              <li><Link to="/shop?category=fruits" className="hover:text-brand-400 transition-colors">Tree-Ripened Fruits</Link></li>
              <li><Link to="/shop?category=grains" className="hover:text-brand-400 transition-colors">Whole Grains & Rice</Link></li>
              <li><Link to="/shop?category=dairy" className="hover:text-brand-400 transition-colors">Artisanal Dairy & Eggs</Link></li>
              <li><Link to="/shop?category=herbs" className="hover:text-brand-400 transition-colors">Fresh Microgreens & Herbs</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Platform Roles</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/register?role=customer" className="hover:text-brand-400 transition-colors">Customer Account</Link></li>
              <li><Link to="/register?role=farmer" className="hover:text-brand-400 transition-colors">Sell Produce as Farmer</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Admin Verification Portal</Link></li>
              <li><Link to="/customer/orders" className="hover:text-brand-400 transition-colors">Order Tracking System</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Farm Community</h5>
            <p className="text-xs text-slate-400 mb-3">Subscribe to get weekly harvest alerts & farm stories directly.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 w-full"
              />
              <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors shrink-0">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FarmDirect Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" /> for Local Farming Communities
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
