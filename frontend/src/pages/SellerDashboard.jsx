import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Upload, Trash2, Edit2, Package, ShoppingBag, Loader2, Inbox } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const CLOUDINARY_CLOUD_NAME = 'di2jkpsdb';
const CLOUDINARY_UPLOAD_PRESET = 'hiresmart_cvs';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
  PAID: 'bg-green-100 text-green-800 ring-1 ring-green-200',
  FAILED: 'bg-red-100 text-red-800 ring-1 ring-red-200',
};

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

const AVATAR_COLORS = [
  'bg-orange-100 text-orange-700',
  'bg-blue-100 text-blue-700',
  'bg-teal-100 text-teal-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-amber-100 text-amber-700',
];

const avatarColor = (seed = '') => {
  const code = seed.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-[var(--muted)]">
      <Inbox size={28} strokeWidth={1.5} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function SellerDashboard() {
  const role = localStorage.getItem('role');
  const [tab, setTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMyProducts = () => {
    setLoading(true);
    api.get('/seller/products/me')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchMySales = () => {
    setLoading(true);
    api.get('/seller/sales')
      .then((res) => setSales(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'products') fetchMyProducts();
    else fetchMySales();
  }, [tab]);

  if (role !== 'SELLER') {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setStock('');
    setImageUrl('');
    setImageFile(null);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price);
    setCategory(product.category || '');
    setStock(product.stock);
    setImageUrl(product.imageUrl || '');
    setImageFile(null);
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setUploading(true);

    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImageToCloudinary(imageFile);
      }

      const payload = {
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        imageUrl: finalImageUrl,
      };

      if (editingId) {
        await api.put(`/seller/products/${editingId}`, payload);
        setMessage('Product updated successfully!');
      } else {
        await api.post('/seller/products', payload);
        setMessage('Product created successfully!');
      }

      resetForm();
      fetchMyProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/seller/products/${id}`);
      fetchMyProducts();
    } catch (err) {
      setMessage('Failed to delete product');
    }
  };

  // Group flat sale rows into one card per order, since one order can span
  // multiple products of mine (and possibly other sellers' products too,
  // which we never see here).
  const salesByOrder = sales.reduce((groups, sale) => {
    if (!groups[sale.orderId]) {
      groups[sale.orderId] = {
        orderId: sale.orderId,
        status: sale.status,
        createdAt: sale.createdAt,
        buyerName: sale.buyerName,
        items: [],
      };
    }
    groups[sale.orderId].items.push(sale);
    return groups;
  }, {});

  const orderedSales = Object.values(salesByOrder).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPaidEarnings = sales
    .filter((s) => s.status === 'PAID')
    .reduce((sum, s) => sum + s.subtotal, 0);

  const TABS = [
    { key: 'products', label: 'My Products', icon: Package },
    { key: 'sales', label: 'My Sales', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Store</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Manage your listings and track what's sold.</p>
        </div>

        {message && (
          <div className="bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <div className="flex gap-2 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1.5 w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
              style={
                tab === key
                  ? { background: 'var(--accent)', color: 'white', boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)' }
                  : { color: 'var(--muted)' }
              }
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <>
            <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-8 shadow-sm">
              <h2 className="font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Price (RWF)</label>
                  <input type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Stock</label>
                  <input type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-2" />
                </div>
              </div>

              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-[var(--border)] rounded-lg px-3 py-2 mb-4" />

              <label className="block text-sm font-medium mb-1.5">Product Image</label>
              {imageUrl && !imageFile && (
                <img src={imageUrl} alt="Current" className="w-20 h-20 object-cover rounded-lg mb-2" />
              )}
              <label className="flex items-center gap-2 border-2 border-dashed border-[var(--border)] rounded-lg px-4 py-3 mb-4 cursor-pointer text-sm text-[var(--muted)]">
                <Upload size={16} />
                {imageFile ? imageFile.name : 'Click to select an image'}
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
              </label>

              <div className="flex gap-3">
                <button type="submit" disabled={uploading} className="text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50" style={{ background: 'var(--accent)' }}>
                  {uploading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-lg border border-[var(--border)]">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h2 className="font-semibold mb-4">My Products</h2>
            {loading ? (
              <div className="flex items-center gap-2 text-[var(--muted)] py-10 justify-center">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : products.length === 0 ? (
              <EmptyState label="You haven't listed any products yet." />
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-[var(--muted)]">RWF {product.price.toLocaleString()} · {product.stock} in stock</p>
                    </div>
                    <button onClick={() => startEdit(product)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'sales' && (
          <>
            <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm mb-6 w-fit">
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: 'color-mix(in srgb, var(--accent) 12%, white)' }} />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)', color: 'var(--accent)' }}>
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-tight" style={{ color: 'var(--accent)' }}>
                    RWF {totalPaidEarnings.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Total earned from paid orders</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-[var(--muted)] py-10 justify-center">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : orderedSales.length === 0 ? (
              <EmptyState label="No sales yet — once someone buys one of your products, it'll show up here." />
            ) : (
              <div className="space-y-4">
                {orderedSales.map((order) => {
                  const orderSubtotal = order.items.reduce((sum, i) => sum + i.subtotal, 0);
                  return (
                    <div key={order.orderId} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColor(order.buyerName)}`}>
                            {initials(order.buyerName) || '?'}
                          </div>
                          <div>
                            <p className="font-semibold">Order #{order.orderId} — {order.buyerName}</p>
                            <p className="text-sm text-[var(--muted)]">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                              {item.productImageUrl ? (
                                <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={14} />
                                </div>
                              )}
                            </div>
                            <p>
                              {item.productName} × {item.quantity} — RWF {item.subtotal.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="font-bold mt-3 pt-3 border-t border-[var(--border)] flex justify-between items-baseline">
                        <span className="text-sm font-medium text-[var(--muted)]">Your total from this order</span>
                        <span className="text-lg" style={{ color: 'var(--accent)' }}>RWF {orderSubtotal.toLocaleString()}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
