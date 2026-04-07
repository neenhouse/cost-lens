import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        background: 'var(--bg, #0a0a0f)',
        color: 'var(--text, #f4f4f5)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem', fontFamily: 'monospace', color: '#10b981' }}>404</div>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Page not found</h1>
      <p style={{ margin: 0, color: 'var(--text-muted, #71717a)' }}>
        This cost center doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1.25rem',
          background: '#10b981',
          color: '#0a0a0f',
          borderRadius: '6px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Back to CostLens
      </Link>
    </div>
  );
}
