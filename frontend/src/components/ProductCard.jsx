import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-square bg-gray-100">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-[var(--muted)] uppercase mb-1">{product.category}</p>
        <h3 className="font-semibold mb-1">{product.name}</h3>
        <p className="font-bold" style={{ color: 'var(--accent)' }}>
          RWF {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;