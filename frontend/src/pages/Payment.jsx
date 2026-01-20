import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Payment.css';

const Payment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { order, paymentMethod } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order || !paymentMethod) {
      navigate('/dashboard');
    }
  }, [order, paymentMethod, navigate]);

  const handlePaystack = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Extract amount from budget (simplified - in production, parse properly)
      const amount = parseFloat(order.budget.replace(/[^0-9.]/g, '')) || 100;
      
      const response = await api.post('/payments/paystack', {
        orderId: order.id,
        amount,
        email: user?.email || order.userEmail
      });

      // Redirect to Paystack
      window.location.href = response.data.authorizationUrl;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  const handleFlutterwave = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Extract amount from budget
      const amount = parseFloat(order.budget.replace(/[^0-9.]/g, '')) || 100;
      
      const response = await api.post('/payments/flutterwave', {
        orderId: order.id,
        amount,
        currency: 'NGN',
        email: user?.email || order.userEmail
      });

      // Redirect to Flutterwave hosted payment page
      window.location.href = response.data.paymentLink;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  if (!order || !paymentMethod) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-container">
          <h1>Complete Payment</h1>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span className="summary-label">Service:</span>
              <span className="summary-value">{order.serviceType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Budget:</span>
              <span className="summary-value">{order.budget}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Description:</span>
              <span className="summary-value">{order.description.substring(0, 100)}...</span>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="payment-options">
            {paymentMethod === 'paystack' && (
              <button
                onClick={handlePaystack}
                disabled={loading}
                className="btn-primary btn-large btn-block"
              >
                {loading ? 'Processing...' : 'Pay with Paystack'}
              </button>
            )}

            {paymentMethod === 'flutterwave' && (
              <button
                onClick={handleFlutterwave}
                disabled={loading}
                className="btn-primary btn-large btn-block"
              >
                {loading ? 'Processing...' : 'Pay with Flutterwave'}
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary btn-block"
            style={{ marginTop: '1rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
