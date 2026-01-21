import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Placeholder function - will be connected to backend later
    console.log('Login attempt:', { email, password });
    // TODO: Connect to backend API
    // Example: await api.post('/auth/login', { email, password });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Placeholder - non-functional for now
    console.log('Forgot password clicked');
  };

  const handleSocialLogin = (provider) => {
    // Placeholder - UI only for now
    console.log(`Social login with ${provider}`);
  };

  return (
    <div className="auth-page">
      {/* Header Section */}
      <div className="auth-header">
        <div className="auth-header-content">
          <h1>Hello! Welcome to Orderion</h1>
          <p>Sign in to continue to your account</p>
        </div>
      </div>

      {/* Card Container */}
      <div className="auth-card-container">
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>

          <form className="auth-form" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="auth-input-group">
              <svg
                className="auth-input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="auth-input-group">
              <svg
                className="auth-input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="auth-forgot-link">
              <a href="#" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" className="auth-submit-btn">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Or login with</span>
          </div>

          {/* Social Login */}
          <div className="auth-social-login">
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialLogin('facebook')}
              aria-label="Login with Facebook"
            >
              <svg
                className="auth-social-icon"
                viewBox="0 0 24 24"
                fill="#1877F2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialLogin('google')}
              aria-label="Login with Google"
            >
              <svg
                className="auth-social-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>

            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialLogin('apple')}
              aria-label="Login with Apple"
            >
              <svg
                className="auth-social-icon"
                viewBox="0 0 24 24"
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="auth-footer-link">
            Don't have an account?{' '}
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
