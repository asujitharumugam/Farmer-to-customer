import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, ShieldCheck, Truck, MapPin, Heart, Sparkles, Star } from 'lucide-react';
import ProduceCard from '../components/customer/ProduceCard';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?status=available'),
          api.get('/admin/categories')
        ]);
        if (prodRes.data.success) setProducts(prodRes.data.data.products);
        if (catRes.data.success) setCategories(catRes.data.data.categories);
      } catch (err) {
        console.warn('Using demo data fallback for homepage');
        setProducts(fallbackProducts);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-50/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Direct Harvest • 0% Intermediaries • 100% Organic Origin
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Fresh Harvest <br />
                <span className="text-gradient">Direct From Farm To Table</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with verified local organic farmers. Pre-book upcoming harvest batches, support sustainable family farms, and enjoy peak nutrition produce delivered directly to your doorstep.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-7 py-4 rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-xl transition-all hover:scale-105"
                >
                  Explore Seasonal Harvest <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register?role=farmer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-earth-50 text-earth-800 hover:bg-earth-100 font-bold text-sm px-6 py-4 rounded-2xl border border-earth-200 transition-all"
                >
                  Sell Produce As Farmer
                </Link>
              </div>

              {/* Stat Highlights */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-900">100%</h4>
                  <p className="text-xs font-semibold text-slate-500">Verified Local Farms</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-900">&lt; 24 hrs</h4>
                  <p className="text-xs font-semibold text-slate-500">Harvest to Dispatch</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-900">4.9 ★</h4>
                  <p className="text-xs font-semibold text-slate-500">Customer Quality Score</p>
                </div>
              </div>
            </div>

            {/* Hero Image Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-400 to-emerald-200 opacity-30 blur-2xl -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh farm produce harvest basket"
                  className="rounded-3xl shadow-2xl border-4 border-white object-cover aspect-[4/3] w-full"
                />
                
                <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl shadow-xl border border-white/60 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Certified Organic</p>
                    <p className="text-[10px] font-semibold text-slate-500">No synthetic pesticides</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore Produce Categories</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Pick from fresh seasonal greens, tree-ripened fruits, organic dairy, and heirloom grains.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Fresh Harvest Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Fresh Harvest</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Produce available for immediate booking directly from local farms.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
          >
            View All ({products.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-200 h-80 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProduceCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Farm Origin Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-brand-400">
              Why FarmDirect Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Fair Earnings For Farmers, <br /> Peak Freshness For Families.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Traditional supply chains add 4+ middlemen, causing produce to sit in storage for up to 2 weeks while farmers lose over 60% of crop value. FarmDirect connects you directly to the soil.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand-500/30"
              >
                Order Direct Harvest
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// Fallback static data for instant demo render
const fallbackCategories = [
  { _id: 'cat1', name: 'Fresh Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80' },
  { _id: 'cat2', name: 'Seasonal Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80' },
  { _id: 'cat3', name: 'Grains & Pulses', slug: 'grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80' },
  { _id: 'cat4', name: 'Dairy & Farm Eggs', slug: 'dairy', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=200&q=80' },
  { _id: 'cat5', name: 'Herbs & Spices', slug: 'herbs', image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=200&q=80' },
  { _id: 'cat6', name: 'Honey & Oils', slug: 'oils-honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80' }
];

const fallbackProducts = [
  {
    _id: 'p1',
    title: 'Farm Fresh Red Tomatoes (Tamatar)',
    description: 'Naturally ripened fresh juicy red tomatoes harvested daily.',
    pricePerUnit: 20.00,
    unit: 'kg',
    stockQuantity: 150,
    isOrganic: true,
    harvestDate: new Date(Date.now() + 86400000 * 2),
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Organic Valley' }
  },
  {
    _id: 'p2',
    title: 'Sweet Alphonso Mangoes (Aam)',
    description: 'Naturally tree-ripened organic sweet Alphonso mangoes with rich aroma.',
    pricePerUnit: 65.00,
    unit: 'kg',
    stockQuantity: 80,
    isOrganic: true,
    harvestDate: new Date(Date.now() + 86400000 * 1),
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Organic Valley' }
  },
  {
    _id: 'p3',
    title: 'Fresh Organic Palak (Spinach)',
    description: 'Crisp green spinach washed in natural farm water.',
    pricePerUnit: 12.00,
    unit: 'piece',
    stockQuantity: 100,
    isOrganic: true,
    harvestDate: new Date(),
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Organic Valley' }
  },
  {
    _id: 'p4',
    title: 'Wild Forest Raw Honey (Madhu)',
    description: 'Unfiltered raw wildflower honey collected directly from farm apiaries.',
    pricePerUnit: 120.00,
    unit: 'piece',
    stockQuantity: 40,
    isOrganic: true,
    harvestDate: new Date(Date.now() - 86400000 * 5),
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Organic Valley' }
  }
];

export default Home;
