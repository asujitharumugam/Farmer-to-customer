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
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={displayImg}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.isOrganic && <Badge variant="organic">Organic</Badge>}
          <Badge variant="harvest" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {harvestFormatted}
          </Badge>
        </div>

        {/* Stock Badge */}
        {product.stockQuantity <= 0 ? (
          <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md">
            Out of Stock
          </span>
        ) : (
          <span className="absolute bottom-3 right-3 bg-emerald-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md">
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
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-brand-600 transition-colors mb-1"
            >
              <MapPin className="w-3 h-3 text-brand-600" />
              {product.farm.farmName || 'Verified Local Farm'}
            </Link>
          )}

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            <Link to={`/produce/${product._id}`}>{product.title}</Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer Price & Add Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-slate-900">
              ${product.pricePerUnit?.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400"> / {product.unit}</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stockQuantity <= 0}
            className="flex items-center gap-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white px-3.5 py-2 rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProduceCard;
