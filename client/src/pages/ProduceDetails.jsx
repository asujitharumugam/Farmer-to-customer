import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ShoppingBag, MapPin, Star, ShieldCheck, Plus, Minus, ArrowLeft, Heart, MessageSquare } from 'lucide-react';
import Badge from '../components/common/Badge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import { handleImageError, getImageUrl } from '../utils/imageUtils';

const ProduceDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`)
        ]);

        if (prodRes.data.success) setProduct(prodRes.data.data.product);
        if (revRes.data.success) setReviews(revRes.data.data.reviews);
      } catch (err) {
        console.warn('Using demo data fallback for produce detail page');
        setProduct(fallbackProductDetail);
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        productId: id,
        rating,
        comment
      });
      if (res.data.success) {
        setReviews([res.data.data.review, ...reviews]);
        setComment('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review. Make sure you are logged in as a Customer.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!product) return null;

  const harvestFormatted = product.harvestDate
    ? new Date(product.harvestDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'Harvest Ready';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <Link to="/shop" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      {/* Main Grid: Gallery + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={getImageUrl(product.images?.[0], 'produce')}
              alt={product.title}
              onError={(e) => handleImageError(e, 'produce')}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {product.isOrganic && <Badge variant="organic">Certified Organic</Badge>}
              <Badge variant="harvest" className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Harvest Date: {harvestFormatted}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Ordering */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Farm Origin Badge */}
            {product.farm && (
              <div className="flex items-center justify-between">
                <Link
                  to={`/farmer/public/${product.farm._id || product.farm}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200 hover:bg-brand-100 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {product.farm.farmName || 'Green Acres Organic Valley'}
                </Link>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {product.farm.ratingAverage || 4.9} ({product.farm.ratingCount || 12} reviews)
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.title}
              </h1>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-2xl shadow-sm border transition-all active:scale-90 ${
                  isInWishlist(product._id)
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
                }`}
                title={isInWishlist(product._id) ? 'Saved in Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{product.pricePerUnit?.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-500">per {product.unit}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {product.description}
            </p>

            {/* Farm Practice Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900">Pesticide Free</h4>
                  <p className="text-[10px] text-slate-400">100% natural bio-fertilizers</p>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900">Picked to Order</h4>
                  <p className="text-[10px] text-slate-400">Dispatched morning of harvest</p>
                </div>
              </div>
            </div>

          </div>

          {/* Action Box: Quantity & Add to Cart */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-extrabold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                ({product.stockQuantity} {product.unit}s available)
              </span>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stockQuantity <= 0}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.01]"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Produce Cart - ₹{(product.pricePerUnit * quantity).toFixed(2)}
            </button>
          </div>

        </div>

      </div>

      {/* Farm Story Card */}
      {product.farm && (
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-400 text-xs font-extrabold uppercase tracking-wider">
              <MapPin className="w-4 h-4" /> About The Origin Farm
            </div>
            <h3 className="text-2xl font-extrabold">{product.farm.farmName || 'Green Acres Valley'}</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
              {product.farm.story || 'Family-owned certified organic farm operating since 1998. We specialize in heirloom crops, crisp brassicas, and natural honey with zero synthetic fertilizers.'}
            </p>
          </div>

          {/* Real Farm Site Images Gallery */}
          {product.farm.siteImages && product.farm.siteImages.length > 0 && (
            <div className="pt-6 border-t border-emerald-800/80 space-y-3">
              <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                📸 Real Current Farm Site & Field Photos (Uploaded by Farmer)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {product.farm.siteImages.map((img, idx) => (
                  <div key={idx} className="group relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] border border-white/10 shadow-lg">
                    <img
                      src={img.url}
                      alt={img.caption || 'Farm site photo'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-3 flex flex-col justify-end">
                      <p className="text-[11px] font-bold text-white line-clamp-2">
                        {img.caption}
                      </p>
                      <span className="text-[9px] font-medium text-emerald-400 mt-0.5">
                        Verified Farm Site Update
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-600" /> Customer Ratings & Reviews ({reviews.length})
        </h3>

        {/* Submit Review Form (For Logged in Customers) */}
        {user?.role === 'customer' ? (
          <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-800">Write a Review for this Produce:</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Rating:</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
              >
                <option value="5">5 ★★★★★ (Excellent)</option>
                <option value="4">4 ★★★★☆ (Good)</option>
                <option value="3">3 ★★★☆☆ (Average)</option>
                <option value="2">2 ★★☆☆☆ (Fair)</option>
                <option value="1">1 ★☆☆☆☆ (Poor)</option>
              </select>
            </div>
            <textarea
              rows="2"
              placeholder="Share how fresh the produce was..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        ) : (
          <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl">
            Please log in as a Customer to leave a verified review.
          </p>
        )}

        {/* Reviews List */}
        <div className="space-y-4 divide-y divide-slate-100">
          {reviews.map((rev, i) => (
            <div key={rev._id || i} className="pt-4 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rev.customer?.name || 'Verified Customer'}</span>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{rev.comment}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

const fallbackProductDetail = {
  _id: 'p1',
  title: 'Heirloom Vine Tomatoes',
  description: 'Naturally ripened on the vine with rich juicy flavor. Harvested daily every morning directly from Green Acres Organic Valley.',
  pricePerUnit: 3.50,
  unit: 'kg',
  stockQuantity: 120,
  isOrganic: true,
  harvestDate: new Date(Date.now() + 86400000 * 2),
  images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
  farm: {
    _id: 'f1',
    farmName: 'Green Acres Organic Valley',
    story: 'Family-owned 45-acre certified organic farm operating since 1998. We specialize in heirloom tomatoes, crisp brassicas, and natural honey with 0% synthetic pesticides.',
    ratingAverage: 4.9,
    ratingCount: 38
  }
};

const fallbackReviews = [
  { _id: 'r1', customer: { name: 'Alice M.' }, rating: 5, comment: 'Incredibly fresh tomatoes! You can really taste the difference compared to supermarket store-bought.', createdAt: new Date() },
  { _id: 'r2', customer: { name: 'David K.' }, rating: 5, comment: 'Arrived firm and fragrant. Great packing by Green Acres farm.', createdAt: new Date() }
];

export default ProduceDetails;
