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

export default function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  
  // Log all parameters for debugging
  console.log('Failure page - All URL parameters:', Object.fromEntries(params));
  
  // eSewa sends data encoded in base64
  const encodedData = params.get('data');
  const decoded = encodedData ? base64Decode(encodedData) : null;
  
  console.log('Decoded failure data:', decoded);

  // Try to get reason from multiple possible sources
  let reason = params.get('message') || params.get('reason');
  
  if (decoded) {
    reason = decoded.message || decoded.status || reason;
  }

  const handleTryAgain = () => {
    navigate('/home');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ padding: '2rem 2.5rem', borderRadius: '12px', background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '520px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', color: '#f44336', marginBottom: '1rem' }}>✗</div>
        
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Payment Failed</h2>
        
        <p style={{ marginTop: '0.8rem', color: '#666', fontSize: '1rem' }}>
          Your eSewa payment was not completed.
        </p>
        
        {reason && (
          <div style={{ 
            background: '#fff3f3', 
            padding: '1rem', 
            borderRadius: '6px', 
            marginTop: '1rem',
            border: '1px solid #ffcdd2'
          }}>
            <p style={{ marginTop: '0.4rem', color: '#d32f2f', fontSize: '0.95rem' }}>
              <strong>Reason:</strong> {reason}
            </p>
          </div>
        )}

        {decoded && (
          <div style={{ 
            background: '#f9f9f9', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            marginTop: '1.5rem', 
            textAlign: 'left' 
          }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#333' }}>Transaction Details</h3>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {decoded.transaction_uuid && (
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Transaction ID:</strong> {decoded.transaction_uuid}
                </p>
              )}
              {decoded.total_amount && (
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Amount:</strong> Rs. {decoded.total_amount}
                </p>
              )}
              {decoded.ref_id && (
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Reference ID:</strong> {decoded.ref_id}
                </p>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Please try again or contact support if the issue persists.
          </p>
          
          <button 
            onClick={handleTryAgain} 
            style={{ 
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
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}