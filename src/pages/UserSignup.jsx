import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { RiUserAddLine, RiLockPasswordLine, RiMailLine, RiUserLine, RiPhoneLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useUserAuth } from '../context/UserAuthContext';

const UserSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { signup, isUserAuthenticated } = useUserAuth();

  const [signupType, setSignupType] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isUserAuthenticated) {
    navigate(redirect, { replace: true });
    return null;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Name is required'); return; }
    if (signupType === 'email' && !email) { setError('Email is required'); return; }
    if (signupType === 'mobile' && !mobile) { setError('Mobile number is required'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    const data = { name: name.trim(), password };
    if (signupType === 'email') {
      data.email = email;
    } else {
      data.mobile = mobile;
    }

    try {
      setLoading(true);
      await signup(data);
      toast.success('Account created successfully!');
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <div className="user-auth-card animate-fade-in" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="auth-logo-box accent">IH</div>
        </div>

        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Inner Hub and start shopping today</p>

        {/* Signup Type Toggle */}
        <div className="auth-toggle">
          <button
            className={`auth-toggle-btn ${signupType === 'email' ? 'active' : ''}`}
            onClick={() => setSignupType('email')}
            type="button"
          >
            <RiMailLine /> Email
          </button>
          <button
            className={`auth-toggle-btn ${signupType === 'mobile' ? 'active' : ''}`}
            onClick={() => setSignupType('mobile')}
            type="button"
          >
            <RiPhoneLine /> Mobile
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSignup} className="user-auth-form">
          <div className="login-input-group">
            <label>Full Name</label>
            <div className="login-input-wrapper">
              <span className="input-icon-left"><RiUserLine /></span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
                id="signup-name"
              />
            </div>
          </div>

          {signupType === 'email' ? (
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
                  id="signup-email"
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
                  id="signup-mobile"
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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
                id="signup-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Must be at least 8 characters long.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '10px', width: '100%', justifyContent: 'center', fontSize: '16px', background: 'var(--accent)' }}
            disabled={loading}
            id="signup-submit"
          >
            {loading ? (
              <span className="btn-loading">Creating Account...</span>
            ) : (
              <><RiUserAddLine /> Create Account</>
            )}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
