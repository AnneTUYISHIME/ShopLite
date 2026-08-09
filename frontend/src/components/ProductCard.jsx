import { Link, useNavigate } from 'react-router-dom';
import { Heart, Package } from 'lucide-react';
import StarRating from './StarRating';

function ProductCard({ product, isWishlisted, onToggleWishlist }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const canWishlist = role !== 'SELLER' && role !== 'ADMIN';

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    onToggleWishlist?.(product.id, isWishlisted);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-square bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
            <Package size={28} strokeWidth={1.5} />
          </div>
        )}

        {canWishlist && onToggleWishlist && (
          <button
            onClick={handleHeartClick}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#78716C'} />
          </button>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs font-medium text-center py-1.5">
            Out of stock
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-semibold mb-1.5 leading-snug">{product.name}</h3>
        {product.reviewCount > 0 && (
          <div className="mb-1.5">
            <StarRating rating={product.averageRating} size={12} showCount count={product.reviewCount} />
          </div>
        )}
        <p className="font-bold" style={{ color: 'var(--accent)' }}>
          RWF {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
