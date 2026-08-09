import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Package, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../hooks/useWishlist';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const token = localStorage.getItem('token');

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const [related, setRelated] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setReviewsLoading(true);
    api.get(`/products/${id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    api.get('/products')
      .then((res) => {
        const sameCategory = res.data.filter(
          (p) => p.id !== product.id && p.category && p.category === product.category
        );
        setRelated(sameCategory.slice(0, 4));
      })
      .catch(() => {});
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleHeartClick = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    toggleWishlist(product.id, wishlistIds.has(product.id));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');

    if (!token) {
      navigate('/login');
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setReviews((prev) => [res.data, ...prev]);
      setReviewComment('');
      setReviewRating(5);
      // Refresh the product so the average rating badge updates too.
      api.get(`/products/${id}`).then((r) => setProduct(r.data)).catch(() => {});
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Could not submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <div className="flex items-center gap-2 text-[var(--muted)] py-20 justify-center">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <p className="text-center mt-10 text-[var(--muted)]">Product not found.</p>
      </div>
    );
  }

  const isWishlisted = wishlistIds.has(product.id);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                <Package size={40} strokeWidth={1.5} />
              </div>
            )}
            <button
              onClick={handleHeartClick}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition-transform"
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#78716C'} />
            </button>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2">{product.category}</p>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            {product.reviewCount > 0 ? (
              <div className="mb-3">
                <StarRating rating={product.averageRating} showCount count={product.reviewCount} />
              </div>
            ) : (
              <p className="text-xs text-[var(--muted)] mb-3">No reviews yet</p>
            )}

            <p className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
              RWF {product.price.toLocaleString()}
            </p>
            <p className="text-[var(--muted)] mb-6 leading-relaxed">{product.description}</p>
            <p className="text-sm text-[var(--muted)] mb-1">Sold by {product.sellerName}</p>
            <p className="text-sm text-[var(--muted)] mb-6">{product.stock} in stock</p>

            <div className="flex items-center gap-3 mb-6">
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)]"
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
              style={{ background: 'var(--accent)' }}
            >
              {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-14">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold mb-3 text-sm">Leave a review</h3>

            {reviewError && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReviewRating(n)}
                    className="p-0.5"
                  >
                    <Star
                      size={22}
                      fill={n <= reviewRating ? '#F59E0B' : 'none'}
                      color={n <= reviewRating ? '#F59E0B' : 'var(--border)'}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this product (optional)"
                rows={3}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 mb-3 bg-[var(--surface)]"
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="text-white px-5 py-2.5 rounded-lg font-medium text-sm disabled:opacity-50"
                style={{ background: 'var(--accent)' }}
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              {!token && (
                <p className="text-xs text-[var(--muted)] mt-2">You'll need to log in to leave a review.</p>
              )}
            </form>
          </div>

          {reviewsLoading ? (
            <div className="flex items-center gap-2 text-[var(--muted)] py-6 justify-center">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No reviews yet — be the first to leave one.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-medium text-sm">{review.userName}</p>
                    <StarRating rating={review.rating} size={13} />
                  </div>
                  {review.comment && <p className="text-sm text-[var(--muted)]">{review.comment}</p>}
                  <p className="text-xs text-[var(--muted)] mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlistIds.has(p.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
