import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Filter, X } from 'lucide-react';
import ProduceCard from '../components/customer/ProduceCard';
import api from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const isOrganicOnly = searchParams.get('organic') === 'true';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (searchQuery) queryParams.append('search', searchQuery);
        if (isOrganicOnly) queryParams.append('organic', 'true');
        if (sortBy) queryParams.append('sort', sortBy);

        const [prodRes, catRes] = await Promise.all([
          api.get(`/products?${queryParams.toString()}`),
          api.get('/admin/categories')
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.data.products);
        if (catRes.data.success) setCategories(catRes.data.data.categories);
      } catch (err) {
        console.warn('Using demo dataset for shop');
        setProducts(demoShopProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchQuery, isOrganicOnly, sortBy]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Farm Produce Marketplace</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Showing {products.length} fresh harvests available for pre-booking and instant delivery.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Organic Filter Toggle */}
          <button
            onClick={() => updateFilter('organic', isOrganicOnly ? '' : 'true')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isOrganicOnly
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🌿 Organic Only
          </button>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="newest">Sort by Newest Harvest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => updateFilter('category', '')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            !selectedCategory
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Produce
        </button>
        {categories.map((c) => (
          <button
            key={c._id || c.slug}
            onClick={() => updateFilter('category', c.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.slug
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-slate-200 h-80 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Produce Listings Found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query, clearing category filters, or turning off the organic filter.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProduceCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

const demoShopProducts = [
  {
    _id: 'p1',
    title: 'Heirloom Vine Tomatoes',
    description: 'Naturally ripened on the vine with rich juicy flavor.',
    pricePerUnit: 3.50,
    unit: 'kg',
    stockQuantity: 120,
    isOrganic: true,
    harvestDate: new Date(Date.now() + 86400000 * 2),
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Valley' }
  },
  {
    _id: 'p2',
    title: 'Organic Hass Avocados',
    description: 'Creamy, rich avocados hand-picked at peak maturity.',
    pricePerUnit: 4.99,
    unit: 'box',
    stockQuantity: 45,
    isOrganic: true,
    harvestDate: new Date(Date.now() + 86400000 * 1),
    images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Valley' }
  },
  {
    _id: 'p3',
    title: 'Farm Fresh Spinach Bunch',
    description: 'Crisp green spinach washed in natural spring water.',
    pricePerUnit: 2.20,
    unit: 'piece',
    stockQuantity: 80,
    isOrganic: true,
    harvestDate: new Date(),
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Valley' }
  },
  {
    _id: 'p4',
    title: 'Wild Mountain Forest Honey',
    description: 'Unfiltered raw wildflower honey collected directly from farm apiaries.',
    pricePerUnit: 8.50,
    unit: 'piece',
    stockQuantity: 30,
    isOrganic: true,
    harvestDate: new Date(Date.now() - 86400000 * 5),
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
    farm: { _id: 'f1', farmName: 'Green Acres Valley' }
  }
];

export default Shop;
