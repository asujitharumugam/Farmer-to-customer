import React from 'react';
import { Sprout, ShieldCheck, Heart, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
          Our Farm-to-Table Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Reconnecting Local Communities To Clean Food
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
          FarmDirect was founded in 1998 with a simple goal: eliminate middleman exploitation, empower independent local growers, and give families direct access to fresh, seasonal, organic produce.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sustainable Cultivation</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            All onboarded farms strictly adhere to zero synthetic pesticide protocols and regenerative crop rotation.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-earth-100 text-earth-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-earth-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Admin Verified Accreditation</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Every farm document and land registry certificate is physically audited before public produce listing.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Fair Producer Income</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Farmers earn 100% of their set crop price without distributor commissions or corporate markups.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-10 text-center space-y-4">
        <h2 className="text-2xl font-extrabold">Support Local Family Farms Today</h2>
        <Link to="/shop" className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-lg">
          Browse Organic Marketplace
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;
