import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Orders from './pages/Orders';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/shop" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
    </Routes>
  );
}

export default App;