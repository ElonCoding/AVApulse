import React from 'react';

/**
 * Reusable modal dialog for transaction confirmation & role actions
 */
export default function ConfirmModal({ isOpen, title, children, onConfirm, onCancel, confirmText = 'Confirm', isDestructive = false }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#182032',
        border: '1px solid #26334d',
        borderRadius: '16px',
        maxWidth: '480px',
        width: '100%',
        padding: '2rem',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {title && <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#f8fafc' }}>{title}</h3>}
        <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: '1px solid #26334d',
              background: '#111827',
              color: '#f8fafc',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: isDestructive ? '#dc2626' : '#E84142',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
