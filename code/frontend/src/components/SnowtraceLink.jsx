import React from 'react';

export default function SnowtraceLink({ hash, type = 'tx', label, truncate = true }) {
  if (!hash) return null;

  const baseUrl = 'https://testnet.snowtrace.io';
  const url = `${baseUrl}/${type}/${hash}`;

  const display = label || (truncate && hash.length > 14
    ? `${hash.slice(0, 6)}...${hash.slice(-4)}`
    : hash);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#E84142',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 500,
        fontSize: '0.875rem'
      }}
      className="snowtrace-link"
    >
      <span>{display}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  );
}
