import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Helper function to decode base64
const base64Decode = (str) => {
  try {
    const decoded = atob(str);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding base64:', error);
    return null;
  }
};

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Log all parameters for debugging
    console.log('All URL parameters:', Object.fromEntries(params));
    
    // eSewa sends data encoded in base64 in the 'data' parameter
    const encodedData = params.get('data');
    
    if (!encodedData) {
      setStatus('error');
      setMessage('Missing payment parameters from eSewa. No data parameter found.');
      return;
    }

    // Decode the base64 data
    const decoded = base64Decode(encodedData);
    console.log('Decoded eSewa data:', decoded);

    if (!decoded) {
      setStatus('error');
      setMessage('Failed to decode payment data from eSewa.');
      return;
    }

    // Extract transaction details from decoded data
    const transactionUuid = decoded.transaction_uuid;
    const totalAmount = decoded.total_amount;
    const transactionCode = decoded.transaction_code;
    const refId = decoded.ref_id;

    if (!transactionUuid || !totalAmount) {
      setStatus('error');
      setMessage('Incomplete payment data received from eSewa.');
      return;
    }

    // Store transaction details for display
    setTransactionDetails({
      transactionUuid,
      totalAmount,
      transactionCode,
      refId,
      status: decoded.status
    });

    // Verify payment with backend (using pid and amt parameters to match backend)
    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/payment/esewa/verify/?pid=${encodeURIComponent(transactionUuid)}&amt=${encodeURIComponent(totalAmount)}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          }
        );
        
        const data = await res.json();
        console.log('Verification response:', data);
        
        if (res.ok && data.status === 'success') {
          setStatus('success');
          setMessage('Payment verified successfully. Thank you for your order!');
        } else {
          setStatus('error');
          setMessage(data.detail || 'Payment could not be verified.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('Something went wrong while verifying payment.');
      }
    };

    verify();
  }, [location.search]);

  const handleBackHome = () => {
    navigate('/home');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ padding: '2rem 2.5rem', borderRadius: '12px', background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '520px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Payment Status</h2>
        
        {status === 'verifying' && (
          <div>
            <p style={{ color: '#666' }}>Verifying your payment with eSewa...</p>
            <div style={{ margin: '1.5rem auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #A31621', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '1rem' }}>✓</div>
            <p style={{ color: '#4CAF50', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div style={{ fontSize: '3rem', color: '#f44336', marginBottom: '1rem' }}>✗</div>
            <p style={{ color: '#f44336', marginBottom: '1.5rem' }}>{message}</p>
          </div>
        )}

        {transactionDetails && (
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#333' }}>Transaction Details</h3>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Transaction ID:</strong> {transactionDetails.transactionUuid}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Amount:</strong> Rs. {transactionDetails.totalAmount}
              </p>
              {transactionDetails.refId && (
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Reference ID:</strong> {transactionDetails.refId}
                </p>
              )}
              {transactionDetails.transactionCode && (
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Transaction Code:</strong> {transactionDetails.transactionCode}
                </p>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={handleBackHome} 
          style={{ 
            marginTop: '1.5rem', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '6px', 
            border: 'none', 
            background: '#A31621', 
            color: '#fff', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Back to Home
        </button>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}