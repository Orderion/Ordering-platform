import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './OrderForm.css';

const OrderForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    serviceType: '',
    description: '',
    budget: '',
    paymentMethod: 'manual'
  });

  const serviceTypes = [
    'Website Development',
    'Web Design',
    'E-commerce Store',
    'Landing Page',
    'Mobile App',
    'SEO Services',
    'Content Writing',
    'Other'
  ];

  const budgetRanges = [
    '$100 - $500',
    '$500 - $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000+',
    'Custom Quote'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/orders', formData);
      const order = response.data;

      // Redirect based on payment method
      if (formData.paymentMethod === 'manual') {
        navigate('/dashboard', { 
          state: { message: 'Order created successfully! We will contact you soon.' } 
        });
      } else {
        // Redirect to payment page
        navigate(`/payment/${order.id}`, { state: { order, paymentMethod: formData.paymentMethod } });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-page">
      <div className="container">
        <div className="form-container">
          <h1>Place Your Order</h1>
          <p className="form-subtitle">Fill out the form below to get started</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={!!user}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!user}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="serviceType">Service Type *</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
              >
                <option value="">Select a service</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description / Requirements *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
                placeholder="Describe your project in detail..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget Range *</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
              >
                <option value="">Select budget range</option>
                {budgetRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="manual">Manual Payment (Pay Later)</option>
                <option value="paystack">Paystack (Online)</option>
                <option value="stripe">Stripe (Online)</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-large btn-block"
              disabled={loading}
            >
              {loading ? 'Creating Order...' : 'Create Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
