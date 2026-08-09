import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !activeCategory || p.category === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectCategory = (cat) => {
    if (cat === activeCategory) {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Shop</h1>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-3 text-[var(--muted)]" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--surface)]"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSearchParams({})}
              className="px-4 py-1.5 rounded-full text-sm font-medium"
              style={!activeCategory ? { background: 'var(--accent)', color: 'white' } : { border: '1px solid var(--border)' }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium"
                style={activeCategory === cat ? { background: 'var(--accent)', color: 'white' } : { border: '1px solid var(--border)' }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-[var(--muted)]">Loading products...</p>}

        {!loading && filteredProducts.length === 0 && (
          <p className="text-[var(--muted)]">No products match your search.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;