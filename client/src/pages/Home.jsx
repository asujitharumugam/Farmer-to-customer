import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, ShieldCheck, Truck, Zap, Sparkles, Star, Tag, Clock, Flame, ShoppingBag } from 'lucide-react';
import ProduceCard from '../components/customer/ProduceCard';
import api from '../services/api';
import { handleImageError } from '../utils/imageUtils';

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
    <div className="space-y-16 pb-12 font-sans">
      
      {/* Superstore E-Commerce Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full border border-amber-400/40 shadow-sm animate-pulse">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                ⚡ 10-Minute Superfast Express Delivery Active
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Fresh Groceries <br />
                <span className="bg-gradient-to-r from-emerald-400 via-brand-400 to-amber-400 bg-clip-text text-transparent">
                  Delivered In Minutes
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Order 100% farm-fresh vegetables, organic fruits, fresh dairy, atta, rice, snacks & beverages. Instant doorstep delivery with 0% extra markup!
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-brand-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" /> Shop Grocery Mart <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Use Code <strong className="text-amber-400">FRESH50</strong> for ₹50 OFF</span>
                </div>
              </div>

              {/* Delivery Guarantee Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="text-xl font-black text-amber-400">⚡ 10 Mins</h4>
                  <p className="text-[11px] font-bold text-slate-400">Express Delivery</p>
                </div>
                <div>
                  <h4 className="text-xl font-black text-emerald-400">100% Organic</h4>
                  <p className="text-[11px] font-bold text-slate-400">Farm Fresh Harvest</p>
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-400">Best Price</h4>
                  <p className="text-[11px] font-bold text-slate-400">Zero Middlemen</p>
                </div>
              </div>
            </div>

            {/* Hero Banner Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500 to-amber-400 opacity-25 blur-2xl -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Grocery Superstore Harvest Basket"
                  onError={(e) => handleImageError(e, 'produce')}
                  className="rounded-3xl shadow-2xl border-4 border-white/20 object-cover aspect-[4/3] w-full"
                />
                
                <div className="absolute -bottom-5 -left-5 glass-dark p-4 rounded-2xl shadow-xl border border-white/20 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Superfast Express</p>
                    <p className="text-[10px] font-bold text-amber-300">Live order dispatch</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Grocery Department Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Grocery Departments</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Select from fresh vegetables, fruits, dairy, staples, snacks & beverages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 hover:-translate-y-1 transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 bg-slate-100 p-1 border border-slate-100">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80'}
                  alt={cat.name}
                  onError={(e) => handleImageError(e, 'produce')}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Flash Deals & Super Savings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-brand-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-slate-950/40 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> Flash Grocery Sale • Limited Time
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">Up to 30% OFF On Daily Essentials!</h3>
            <p className="text-xs text-amber-100 font-semibold max-w-md">
              Fresh tomatoes, Alphonso mangoes, organic milk, and basmati rice at wholesale prices.
            </p>
          </div>

          <Link
            to="/shop?sort=price-asc"
            className="inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs px-6 py-3.5 rounded-2xl shadow-lg hover:scale-105 transition-all shrink-0 relative z-10"
          >
            Claim Deals Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Bestseller Groceries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Popular Daily Items</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
              Top-selling farm produce & groceries delivered in 10 minutes.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-black text-brand-700 hover:text-brand-800"
          >
            Explore All ({products.length}) <ArrowRight className="w-4 h-4" />
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

    </div>
  );
};

const fallbackCategories = [
  { slug: 'vegetables', name: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
  { slug: 'fruits', name: 'Seasonal Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80' },
  { slug: 'grains', name: 'Traditional Rice & Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' },
  { slug: 'dairy', name: 'Country Milk & Eggs', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=500&q=80' }
];

const fallbackProducts = [
  { _id: '1', title: 'Madurai Country Organic Tomatoes (மதுரை தக்காளி)', pricePerUnit: 22.00, unit: 'kg', stockQuantity: 180, isOrganic: true, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'], farm: { farmName: 'Kongu Organic Agriculture Farm' } },
  { _id: '2', title: 'Perambalur Small Onions / Chinna Vengayam (சின்ன வெங்காயம்)', pricePerUnit: 45.00, unit: 'kg', stockQuantity: 220, isOrganic: true, images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'], farm: { farmName: 'Kongu Organic Agriculture Farm' } },
  { _id: '3', title: 'Salem Malgova & Alphonso Mangoes (சேலம் மாம்பழம்)', pricePerUnit: 120.00, unit: 'kg', stockQuantity: 100, isOrganic: true, images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'], farm: { farmName: 'Kongu Organic Agriculture Farm' } },
  { _id: '4', title: 'Thanjavur Deluxe Ponni Boiled Rice (தஞ்சாவூர் அரிசி)', pricePerUnit: 62.00, unit: 'kg', stockQuantity: 400, isOrganic: true, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'], farm: { farmName: 'Cauvery Delta Bio Farms' } }
];

export default Home;
