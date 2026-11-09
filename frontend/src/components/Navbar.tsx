'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useCompany } from '@/context/CompanyContext';

export default function Navbar() {
  const { company, rawPhone, formattedPhone } = useCompany();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#hero', active: true },
    { label: 'MATERIALS', href: '#materials' },
    { label: 'DELIVERY FLEET', href: '#delivery-partners' },
    { label: 'WHY US', href: '#approach' },
    { label: 'GUIDES', href: '#journal' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Brand Logo with Parent Brand subtitle right below Company Name */}
        <a href="#hero" className={styles.logo} aria-label="Entrepreneur AxZ">
          <Image
            src="/images/updated/Logo.png"
            alt="Entrepreneur AxZ Logo"
            width={48}
            height={48}
            className={styles.brandLogoImg}
            priority
          />
          <div className={styles.logoText}>
            <span className={styles.brandTitle}>ENTREPRENEUR AxZ</span>
            <span className={styles.brandSub}>A Brand by Roychowdhury and Sons</span>
          </div>
        </a>

        {/* Center Pill Nav */}
        <nav className={styles.centerNav} aria-label="Main Navigation">
          <ul className={styles.pillList}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`${styles.navItem} ${link.active ? styles.activeNavItem : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Call CTA Button */}
        <div className={styles.ctaGroup}>
          <a href={`tel:${rawPhone}`} className={styles.advisorBtn} id="nav-advisor-cta">
            <svg
              className={styles.phoneIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
            </svg>
            <span className={styles.phoneNum}>{formattedPhone}</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          id="hamburger-btn"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.mobileNavContainer}>
          <div className={styles.mobileBrandTag}>
            <span className={styles.tagDot} />
            <span>A Brand by Roychowdhury and Sons</span>
          </div>
          <ul className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`${styles.mobileLink} ${link.active ? styles.mobileActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`tel:${rawPhone}`}
            className={styles.mobileAdvisorBtn}
            onClick={() => setMenuOpen(false)}
          >
            <svg
              className={styles.phoneIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
            </svg>
            <span>CALL: {rawPhone}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
