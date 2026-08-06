import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <p className="text-center mt-10 text-[var(--muted)]">Loading...</p>
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

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div>
          <p className="text-xs text-[var(--muted)] uppercase mb-2">{product.category}</p>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <p className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
            RWF {product.price.toLocaleString()}
          </p>
          <p className="text-[var(--muted)] mb-6">{product.description}</p>
          <p className="text-sm text-[var(--muted)] mb-6">{product.stock} in stock</p>

          <div className="flex items-center gap-3 mb-6">
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 border border-[var(--border)] rounded-lg px-3 py-2"
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;