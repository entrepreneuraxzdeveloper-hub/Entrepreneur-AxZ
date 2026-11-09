'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiUrl = isRemote ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      // Store Auth Token & User Info
      if (typeof window !== 'undefined') {
        localStorage.setItem('axz_token', data.token);
        localStorage.setItem('axz_user', JSON.stringify(data.user));
        document.cookie = `axz_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      setSuccess(`Welcome back, ${data.user?.name || 'User'}! Authenticated successfully.`);

      setTimeout(() => {
        if (data.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to connect to the authentication server.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.splitLayout}>
        {/* Left Side: Brand & Visuals */}
        <div className={styles.brandSide}>
          <div className={styles.brandTop}>
            <Link href="/" className={styles.backHomeLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Website</span>
            </Link>

            <Link href="/" className={styles.brandLogoWrap}>
              <Image
                src="/images/updated/Logo.png"
                alt="Entrepreneur AxZ Logo"
                width={130}
                height={55}
                className={styles.brandLogo}
                priority
              />
            </Link>
          </div>

          <div className={styles.brandCenter}>
            <div className={styles.eyebrowTag}>
              <span>A Brand by Roychowdhury and Sons</span>
            </div>
            <h1 className={styles.brandHeading}>
              Enduring structures begin with <span>trusted supply</span>.
            </h1>
            <p className={styles.brandSubtext}>
              Sign in to your wholesale trade account to view volume price benchmarks,
              track active site deliveries, download GST billing invoices, and lock raw material rates.
            </p>

            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Wholesale volume price slabs for cement, saria, & bricks</span>
              </li>
              <li className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Official Fe 550D rebar & cement test certificates</span>
              </li>
              <li className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Direct on-site unloading & GPS fleet tracking in Howrah & Kolkata</span>
              </li>
            </ul>
          </div>

          <div className={styles.brandFooter}>
            <span>Order Desk: +91 9073453034</span>
            <span>depot@roychowdhury.com</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <div className={styles.formLogoWrap}>
                <Image
                  src="/images/updated/Logo.png"
                  alt="Entrepreneur AxZ Logo"
                  width={110}
                  height={48}
                  className={styles.formLogo}
                  priority
                />
              </div>
              <span className={styles.formBadge}>Trade & Client Portal</span>
              <h2 className={styles.formTitle}>Sign In</h2>
              <p className={styles.formSubtitle}>
                Access your builder quotation dashboard, past orders, and project accounts.
              </p>
            </div>

            {error && (
              <div className={`${styles.alertBox} ${styles.alertError}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">Work Email / Username</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. contractor@firm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.formOptionsRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me logged in</span>
                </label>
                <a href="tel:9073453034" className={styles.forgotLink}>
                  Need help?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
                id="login-submit-button"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className={styles.switchAuthPrompt}>
              <span>Do not have a contractor trade account?</span>
              <Link href="/register" className={styles.switchAuthLink}>
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

