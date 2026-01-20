import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OrderForm from './pages/OrderForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/AuthCallback';
import PaymentCallback from './pages/PaymentCallback';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
