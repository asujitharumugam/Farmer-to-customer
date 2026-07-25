import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingBag, MapPin, Star } from 'lucide-react';
import Badge from '../common/Badge';
import { useCart } from '../../context/CartContext';

const ProduceCard = ({ product }) => {
  const { addToCart } = useCart();

  const harvestFormatted = product.harvestDate
    ? new Date(product.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Harvest Ready';

  const defaultImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  const displayImg = product.images && product.images.length > 0 ? product.images[0] : defaultImg;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={displayImg}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.isOrganic && <Badge variant="organic" className="shadow-sm">Organic 🌿</Badge>}
          <Badge variant="harvest" className="flex items-center gap-1 shadow-sm">
            <Calendar className="w-3 h-3 text-amber-500" /> {harvestFormatted}
          </Badge>
        </div>

        {/* Stock Badge */}
        {product.stockQuantity <= 0 ? (
          <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-xl backdrop-blur-md border border-white/20">
            Out of Stock
          </span>
        ) : (
          <span className="absolute bottom-3 right-3 bg-emerald-950/80 text-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-xl backdrop-blur-md border border-emerald-500/30">
            {product.stockQuantity} {product.unit}s left
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          {/* Farm Origin Badge */}
          {product.farm && (
            <Link
              to={`/farmer/public/${product.farm._id || product.farm}`}
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 transition-colors mb-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60"
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              {product.farm.farmName || 'Verified Local Farm'}
            </Link>
          )}

          <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            <Link to={`/produce/${product._id}`}>{product.title}</Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        {/* Footer Price & Add Button */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-slate-900 font-sans tracking-tight">
              ₹{product.pricePerUnit?.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400"> / {product.unit}</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stockQuantity <= 0}
            className="flex items-center gap-1.5 text-xs font-extrabold bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-300 text-white px-4 py-2.5 rounded-2xl shadow-md shadow-brand-600/20 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProduceCard;
