import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Upload, Trash2, Edit2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const CLOUDINARY_CLOUD_NAME = 'di2jkpsdb';
const CLOUDINARY_UPLOAD_PRESET = 'hiresmart_cvs';

function Admin() {
  const role = localStorage.getItem('role');

  const [products, setProducts] = useState([]);
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

  const fetchProducts = () => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (role !== 'ADMIN') {
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
        await api.put(`/admin/products/${editingId}`, payload);
        setMessage('Product updated successfully!');
      } else {
        await api.post('/admin/products', payload);
        setMessage('Product created successfully!');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      setMessage('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

        {message && (
          <div className="bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-8">
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

        <h2 className="font-semibold mb-4">All Products</h2>
        {loading ? (
          <p className="text-[var(--muted)]">Loading...</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-[var(--muted)]">RWF {product.price.toLocaleString()} · {product.stock} in stock</p>
                </div>
                <button onClick={() => startEdit(product)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;