import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, ShieldCheck, Truck, MapPin, Heart, Sparkles, Star, Users, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-16 font-sans">
      
      {/* High-Impact Hero Banner */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-gradient-to-b from-brand-50/80 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-800 text-xs font-extrabold px-4 py-2 rounded-full border border-emerald-300 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Empowering Local Agriculture • Direct Producer-to-Consumer
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Taste The Pure Difference Of <br />
                <span className="text-gradient">Direct Farm Fresh Produce</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Bypass middleman distribution networks. Book harvest batches directly from verified family farms in your region with 100% origin traceability and peak nutrition guarantee.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-brand-600/30 hover:shadow-2xl transition-all hover:scale-105"
                >
                  Explore Marketplace <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register?role=farmer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-earth-50 text-earth-800 hover:bg-earth-100 font-bold text-sm px-7 py-4 rounded-2xl border border-earth-200 transition-all"
                >
                  Join As A Farmer
                </Link>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <h4 className="text-3xl font-extrabold text-slate-900">120+</h4>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">Verified Organic Farms</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-slate-900">0%</h4>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">Middleman Markup</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-slate-900">4.9/5</h4>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">Consumer Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500 to-emerald-300 opacity-25 blur-2xl -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh farm produce harvest basket"
                  className="rounded-3xl shadow-2xl border-4 border-white object-cover aspect-[4/3] w-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Why FarmDirect Revolutionizes Food</h2>
          <p className="text-sm text-slate-500 font-medium">Re-connecting local communities to the soil with technology transparency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl mx-auto md:mx-0">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Harvest-to-Order Freshness</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Produce is harvested only after your order is confirmed, avoiding storage degradation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-earth-100 text-earth-800 flex items-center justify-center font-bold text-xl mx-auto md:mx-0">
              <ShieldCheck className="w-7 h-7 text-earth-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Fair Income For Farmers</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Farmers keep 100% of their set produce prices without distributor exploitation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xl mx-auto md:mx-0">
              <Truck className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Direct Gate & Doorstep Logistics</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Flexible options: pick up at the farm gate or enjoy refrigerated local doorstep delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-10 sm:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Taste True Farm Freshness?</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Join thousands of families supporting local farmers today.
            </p>
            <Link
              to="/register"
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg transition-all"
            >
              Create Free Account Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
