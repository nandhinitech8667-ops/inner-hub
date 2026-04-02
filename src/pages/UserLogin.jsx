import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { RiUserSharedLine, RiLockPasswordLine, RiMailLine, RiPhoneLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useUserAuth } from '../context/UserAuthContext';

const UserLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isUserAuthenticated } = useUserAuth();

  const [loginType, setLoginType] = useState('email'); // 'email' or 'mobile'
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isUserAuthenticated) {
    navigate(redirect, { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const credentials = { password };
    if (loginType === 'email') {
      if (!email) { setError('Please enter your email'); return; }
      credentials.email = email;
    } else {
      if (!mobile) { setError('Please enter your mobile number'); return; }
      credentials.mobile = mobile;
    }

    if (!password) { setError('Please enter your password'); return; }

    try {
      setLoading(true);
      await login(credentials);
      toast.success('Welcome back!');
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <div className="user-auth-card animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="auth-logo-box">IH</div>
        </div>

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Inner Hub account</p>

        {/* Login Type Toggle */}
        <div className="auth-toggle">
          <button
            className={`auth-toggle-btn ${loginType === 'email' ? 'active' : ''}`}
            onClick={() => setLoginType('email')}
            type="button"
          >
            <RiMailLine /> Email
          </button>
          <button
            className={`auth-toggle-btn ${loginType === 'mobile' ? 'active' : ''}`}
            onClick={() => setLoginType('mobile')}
            type="button"
          >
            <RiPhoneLine /> Mobile
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="user-auth-form">
          {loginType === 'email' ? (
            <div className="login-input-group">
              <label>Email Address</label>
              <div className="login-input-wrapper">
                <span className="input-icon-left"><RiMailLine /></span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                  id="login-email"
                />
              </div>
            </div>
          ) : (
            <div className="login-input-group">
              <label>Mobile Number</label>
              <div className="login-input-wrapper">
                <span className="input-icon-left"><RiPhoneLine /></span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                  id="login-mobile"
                />
              </div>
            </div>
          )}

          <div className="login-input-group">
            <label>Password</label>
            <div className="login-input-wrapper">
              <span className="input-icon-left"><RiLockPasswordLine /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
                id="login-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '10px', width: '100%', justifyContent: 'center', fontSize: '16px' }}
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              <span className="btn-loading">Signing in...</span>
            ) : (
              <><RiUserSharedLine /> Sign In</>
            )}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link to="/admin" style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}>
            Go to Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
