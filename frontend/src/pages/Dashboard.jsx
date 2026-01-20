import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/');
        return;
      }
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      // Clear the message
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/me');
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { class: 'status-pending', text: 'Pending' },
      paid: { class: 'status-paid', text: 'Paid' },
      in_progress: { class: 'status-progress', text: 'In Progress' },
      completed: { class: 'status-completed', text: 'Completed' }
    };
    const s = statuses[status] || statuses.pending;
    return <span className={`status-badge ${s.class}`}>{s.text}</span>;
  };

  const getPaymentBadge = (status) => {
    const statuses = {
      pending: { class: 'payment-pending', text: 'Pending' },
      paid: { class: 'payment-paid', text: 'Paid' },
      failed: { class: 'payment-failed', text: 'Failed' }
    };
    const s = statuses[status] || statuses.pending;
    return <span className={`payment-badge ${s.class}`}>{s.text}</span>;
  };

  if (authLoading || loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Orders</h1>
          <button onClick={() => navigate('/order')} className="btn-primary">
            New Order
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Create your first order to get started!</p>
            <button onClick={() => navigate('/order')} className="btn-primary">
              Place Order
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>{order.serviceType}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-badges">
                    {getStatusBadge(order.orderStatus)}
                    {getPaymentBadge(order.paymentStatus)}
                  </div>
                </div>
                
                <div className="order-body">
                  <p className="order-description">{order.description}</p>
                  <div className="order-details">
                    <div className="detail-item">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">{order.budget}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Method:</span>
                      <span className="detail-value">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {order.paymentStatus === 'pending' && order.paymentMethod !== 'manual' && (
                  <div className="order-actions">
                    <button 
                      onClick={() => navigate(`/payment/${order.id}`, { state: { order, paymentMethod: order.paymentMethod } })}
                      className="btn-primary btn-sm"
                    >
                      Complete Payment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
