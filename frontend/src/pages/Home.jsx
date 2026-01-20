import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Get Your Website & Digital Services
              <span className="gradient-text"> Delivered Fast</span>
            </h1>
            <p className="hero-subtitle">
              Professional web development, design, and digital solutions tailored to your needs.
              Order now and get started in minutes.
            </p>
            <div className="hero-cta">
              <Link to="/order" className="btn-primary btn-large">
                Order Now
              </Link>
              {!user && (
                <Link to="/dashboard" className="btn-secondary btn-large">
                  View Orders
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Get your website or service delivered quickly with our streamlined process.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Pay securely with Paystack or Stripe. We support multiple payment methods.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Professional Quality</h3>
              <p>High-quality work delivered by experienced developers and designers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>All websites are mobile-first and work perfectly on all devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Place your order today and let's bring your vision to life.</p>
            <Link to="/order" className="btn-primary btn-large">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
