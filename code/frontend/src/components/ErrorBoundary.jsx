import React from 'react';

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{
        padding: '32px',
        textAlign: 'center',
        background: '#1F2937',
        borderRadius: '12px',
        margin: '24px auto',
        maxWidth: '600px',
        border: '1px solid #374151'
      }}>
        <h2 style={{ color: '#EF4444', marginBottom: '12px' }}>Application Encountered an Error</h2>
        <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>{errorMessage}</p>
        <button
          onClick={() => {
            setHasError(false);
            window.location.reload();
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#E84142',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return children;
}
