'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

const DEFAULT_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function AdminPage() {
  const [backendUrl, setBackendUrl] = useState('');
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const targetUrl = isLocal
      ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000')
      : '/admin-panel';
    setBackendUrl(targetUrl);

    const checkHealth = async () => {
      try {
        const healthUrl = isLocal ? `${targetUrl}/api/health` : '/api/health';
        const res = await fetch(healthUrl, { cache: 'no-store' });
        if (isMounted) {
          setIsOnline(res.ok);
        }
      } catch {
        if (isMounted) {
          setIsOnline(false);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={styles.adminWrapper}>
      {isOnline === false ? (
        <div className={styles.offlineNotice}>
          <div className={styles.noticeCard}>
            <div className={styles.noticeIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7A5F9A" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            </div>
            <h2 className={styles.noticeTitle}>Backend Server Not Detected</h2>
            <p className={styles.noticeDesc}>
              The Admin Panel requires the backend server running on port <strong>5000</strong>.
            </p>
            <div className={styles.codeSnippet}>
              cd backend<br />
              npm start
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className={styles.retryBtn}
            >
              Check Connection Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <iframe
            key={refreshKey}
            src={`${backendUrl}?v=${refreshKey}`}
            title="Entrepreneur AxZ Admin Dashboard"
            className={styles.adminFrame}
            allow="clipboard-write"
          />
          <Link
            href="/"
            className={styles.floatingHomeBtn}
            title="Return to Public Website"
          >
            ← Live Website
          </Link>
        </>
      )}
    </div>
  );
}
