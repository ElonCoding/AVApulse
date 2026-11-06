import { Link } from 'react-router-dom';
import { EXPLORER_URL } from '../config/contracts';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <div className="badge">
          <span className="badge-icon">🛡️</span>
          Built on iExec Nox Protocol · ERC-7984
        </div>
        <h1 className="hero-title">
          Confidential Payroll <br />
          <span className="highlight">Made Simple</span>
        </h1>
        <p className="hero-subtitle">
          Pay your team with encrypted amounts. Only authorized parties can decrypt.
          Full privacy with selective auditor disclosure.
        </p>
        <Link to="/employer" className="btn btn-primary btn-lg">
          Get Started →
        </Link>
      </div>

      <div className="role-cards">
        <Link to="/employer" className="role-card">
          <div className="role-icon">🏢</div>
          <h3>Employer</h3>
          <p>Wrap tokens, manage employees, execute confidential batch payments</p>
        </Link>
        <Link to="/employee" className="role-card">
          <div className="role-icon">👤</div>
          <h3>Employee</h3>
          <p>View encrypted balance, decrypt salary, unwrap to ERC-20</p>
        </Link>
        <Link to="/auditor" className="role-card">
          <div className="role-icon">🔍</div>
          <h3>Auditor</h3>
          <p>Review disclosed payment handles with read-only decrypt access</p>
        </Link>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '3rem' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Deployed Contracts</div>
              <div className="card-subtitle">Avalanche Fuji · Live on-chain</div>
            </div>
            <span className="badge badge-success">● Live</span>
          </div>
          <ul className="tx-list">
            <li className="tx-item">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>MockERC20</span>
              <a
                className="tx-hash"
                href={`${EXPLORER_URL}/address/0x968C84e7549020fF4dA1c6E2B0fc459f2ED90038`}
                target="_blank"
                rel="noopener noreferrer"
              >
                0x155b…3a00
              </a>
            </li>
            <li className="tx-item">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ConfPayToken (ERC-7984)</span>
              <a
                className="tx-hash"
                href={`${EXPLORER_URL}/address/0x03D47783137398bafF49B441dF063016984234Fa`}
                target="_blank"
                rel="noopener noreferrer"
              >
                0x08A1…BBa6
              </a>
            </li>
            <li className="tx-item">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>PayrollManager</span>
              <a
                className="tx-hash"
                href={`${EXPLORER_URL}/address/0xC247661F01b9c5aFCe6C2CA0bcB8Fc6273680635`}
                target="_blank"
                rel="noopener noreferrer"
              >
                0x0fA9…31D2
              </a>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Privacy Architecture</div>
              <div className="card-subtitle">How AVApulse works</div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>1. Wrap</strong> — ERC-20 tokens lock in the wrapper, producing an encrypted ERC-7984 handle.</p>
            <p style={{ marginTop: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>2. Pay</strong> — Employer calls <code style={{ color: 'var(--accent)' }}>batchPay()</code> with encrypted amounts. Nobody sees individual salaries.</p>
            <p style={{ marginTop: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>3. Decrypt</strong> — Only the employee (or a granted auditor) can decrypt their payment handle via Nox TEE.</p>
            <p style={{ marginTop: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>4. Unwrap</strong> — Employee converts confidential tokens back to standard ERC-20.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
