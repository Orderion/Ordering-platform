import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthCallback.css';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuth();
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    const handleCallback = async () => {
      if (success) {
        await checkAuth();
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    handleCallback();
  }, [success, navigate, checkAuth]);

  return (
    <div className="auth-callback">
      <div className="container">
        <div className="callback-content">
          {success ? (
            <>
              <div className="callback-icon success">✓</div>
              <h2>Login Successful!</h2>
              <p>Redirecting to your dashboard...</p>
            </>
          ) : (
            <>
              <div className="callback-icon error">✗</div>
              <h2>Login Failed</h2>
              <p>Please try again.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
