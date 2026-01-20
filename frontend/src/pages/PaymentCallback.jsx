import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './PaymentCallback.css';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const provider = searchParams.get('provider');
  const orderId = searchParams.get('orderId');
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
    setLoading(false);
  }, [success, navigate]);

  if (loading) {
    return (
      <div className="payment-callback">
        <div className="container">
          <div className="callback-content">
            <div className="loading">Processing...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-callback">
      <div className="container">
        <div className="callback-content">
          {success ? (
            <>
              <div className="callback-icon success">✓</div>
              <h2>Payment Successful!</h2>
              <p>Your payment has been processed. Redirecting to dashboard...</p>
            </>
          ) : (
            <>
              <div className="callback-icon error">✗</div>
              <h2>Payment Cancelled</h2>
              <p>Your payment was not completed. Redirecting to dashboard...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
