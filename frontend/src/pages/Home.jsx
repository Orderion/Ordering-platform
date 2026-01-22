import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <main className="hero">
        {/* LEFT */}
        <div className="hero-left">
          <span className="badge">✨ New: React + Tailwind Support</span>

          <h1>
            Get Your Website <br />
            & Digital Services <br />
            Delivered Fast
          </h1>

          <p>
            Professional web development, design, and digital solutions tailored
            to your needs. Order now and get started in minutes.
          </p>

          <div className="hero-cta">
            <Link to="/order" className="signup">
              Order Now →
            </Link>

            {!user && (
              <Link to="/dashboard" className="signin">
                View Orders
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <div className="video-card">
            <div className="play-btn">▶</div>
          </div>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>
                Get your website or service delivered quickly with our streamlined
                process.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>
                Pay securely with Paystack or Stripe. We support multiple payment
                methods.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Professional Quality</h3>
              <p>
                High-quality work delivered by experienced developers and designers.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>
                All websites are mobile-first and work perfectly on all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Place your order today and let's bring your vision to life.</p>
            <Link to="/order" className="signup">
              Start Your Order →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
