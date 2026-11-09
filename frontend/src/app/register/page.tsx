'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessRole, setBusinessRole] = useState('Contractor / Builder');
  const [password, setPassword] = useState('');
  const [gstin, setGstin] = useState('');
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
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: 'user', // standard registered account
          phone: phone.trim(),
          businessRole,
          gstin: gstin.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please check your details.');
      }

      // Store Auth Session
      if (typeof window !== 'undefined') {
        localStorage.setItem('axz_token', data.token);
        localStorage.setItem('axz_user', JSON.stringify(data.user));
        document.cookie = `axz_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      setSuccess(`Account registered successfully! Welcome to Entrepreneur AxZ, ${data.user?.name}.`);

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to complete registration. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.splitLayout}>
        {/* Left Side: Brand Visuals */}
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
              Direct manufacturer supply for <span>ambitious projects</span>.
            </h1>
            <p className={styles.brandSubtext}>
              Register as a contractor, civil engineer, or individual developer. Unlock wholesale volume pricing slabs, 
              direct mill test certificates, and milestone credit payment terms.
            </p>

            <div className={styles.perksGrid}>
              <div className={styles.perkCard}>
                <div className={styles.perkTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#beafcb" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Wholesale Slabs
                </div>
                <p className={styles.perkDesc}>Discounted truckload rates on Ultratech, JSW & Tata TMT.</p>
              </div>

              <div className={styles.perkCard}>
                <div className={styles.perkTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#beafcb" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  GST Credit Invoicing
                </div>
                <p className={styles.perkDesc}>Instant 100% compliant e-way bills and input tax invoices.</p>
              </div>

              <div className={styles.perkCard}>
                <div className={styles.perkTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#beafcb" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Batch Certificates
                </div>
                <p className={styles.perkDesc}>Verified compressive strength & Fe 550D laboratory reports.</p>
              </div>

              <div className={styles.perkCard}>
                <div className={styles.perkTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#beafcb" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Priority Dispatch
                </div>
                <p className={styles.perkDesc}>Scheduled 6 & 10-wheeler dumper deliveries across Howrah & Kolkata.</p>
              </div>
            </div>
          </div>

          <div className={styles.brandFooter}>
            <span>Direct Desk: +91 9073453034</span>
            <span>Kolkata & Howrah Regional Hub</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
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
              <span className={styles.formBadge}>New Account Onboarding</span>
              <h2 className={styles.formTitle}>Register Trade Account</h2>
              <p className={styles.formSubtitle}>
                Create an account to manage construction orders, billings, and wholesale quotations.
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
                <label className={styles.formLabel} htmlFor="reg-name">Full Name or Company Name *</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="e.g. Roy Chowdhury Constructions / Tanmay Dutta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="reg-email">Work Email *</label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="reg-phone">Phone Number *</label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                    </svg>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      placeholder="+91 98300 XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="reg-role">Business Category *</label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <select
                      id="reg-role"
                      value={businessRole}
                      onChange={(e) => setBusinessRole(e.target.value)}
                      className={styles.selectField}
                    >
                      <option value="Contractor / Builder">Contractor / Builder</option>
                      <option value="Civil Engineer / Architect">Civil Engineer / Architect</option>
                      <option value="Material Dealer / Stockist">Material Dealer / Stockist</option>
                      <option value="Individual Homeowner">Individual Homeowner</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="reg-gstin">GSTIN (Optional)</label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="9" x2="20" y2="9" />
                      <line x1="4" y1="15" x2="20" y2="15" />
                      <line x1="10" y1="3" x2="8" y2="21" />
                      <line x1="16" y1="3" x2="14" y2="21" />
                    </svg>
                    <input
                      id="reg-gstin"
                      type="text"
                      placeholder="19XXXXX1234X1ZX"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="reg-pass">Create Password (min. 6 characters) *</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="reg-pass"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
                id="register-submit-button"
              >
                {loading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Trade Account</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>

              <p className={styles.termsNote}>
                By registering, you agree to verified trade supply terms, GST invoicing schedules, and milestone delivery notifications.
              </p>
            </form>

            <div className={styles.switchAuthPrompt}>
              <span>Already have an account?</span>
              <Link href="/login" className={styles.switchAuthLink}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

