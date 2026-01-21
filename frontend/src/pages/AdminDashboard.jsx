import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [statusFilter, setStatusFilter] = useState('');

  const ADMIN_GITHUB_ID = import.meta.env.VITE_ADMIN_GITHUB_ID;

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.githubId !== ADMIN_GITHUB_ID) {
        navigate('/');
        return;
      }
      fetchData();
    }
  }, [user, authLoading, navigate, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/orders${statusFilter ? `?status=${statusFilter}` : ''}`),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        orderStatus,
        paymentStatus
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update order');
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

  if (authLoading || loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.users.total}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.orders.total}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${stats.revenue.total.toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        )}

        <div className="admin-tabs">
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            Orders
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            Users
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="admin-content">
            <div className="filter-bar">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="orders-table">
              {orders.map(order => (
                <div key={order.id} className="admin-order-card">
                  <div className="order-info">
                    <div>
                      <h3>{order.serviceType}</h3>
                      <p>{order.userName} ({order.userEmail})</p>
                      <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="order-badges">
                      {getStatusBadge(order.orderStatus)}
                      <span className={`payment-badge ${order.paymentStatus === 'paid' ? 'payment-paid' : 'payment-pending'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <p className="order-description">{order.description}</p>
                  <div className="order-actions-admin">
                    <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order.id, e.target.value, order.paymentStatus)} className="status-select">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select value={order.paymentStatus} onChange={(e) => updateOrderStatus(order.id, order.orderStatus, e.target.value)} className="status-select">
                      <option value="pending">Payment Pending</option>
                      <option value="paid">Payment Paid</option>
                      <option value="failed">Payment Failed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <div className="users-table">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-avatar-large">
                    <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} alt={user.name} />
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <p className="user-meta">{user._count.orders} orders • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
