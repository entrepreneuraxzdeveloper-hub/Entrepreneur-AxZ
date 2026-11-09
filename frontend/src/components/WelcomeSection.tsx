'use client';

import styles from './WelcomeSection.module.css';
import { useCompany } from '@/context/CompanyContext';

export default function WelcomeSection() {
  const { company, rawPhone } = useCompany();
  return (
    <section className={styles.welcomeSection} id="about">
      <div className={styles.container}>
        {/* Eyebrow badge */}
        <div className={styles.eyebrow}>
          <span className={styles.redDot} />
          <span className={styles.eyebrowText}>
            {company.brandName.toUpperCase()} • A BRAND BY {company.parentCompany.toUpperCase()}
          </span>
        </div>

        {/* Main Statement Heading */}
        <h2 className={styles.heading}>
          Enduring structures begin with
          <br />
          <span className={styles.highlight}>trusted building materials.</span>
        </h2>

        {/* Supporting Narrative Paragraph */}
        <p className={styles.subtext}>
          Covering every phase from site preparation and RCC structural casting to partitions,
          flooring, plumbing systems, and final painting closure. We supply verified brands
          including Ultratech, JSW, Tata, Shyam Steel, Dulux, and Berger with transparent universal
          market pricing and dependable on-site delivery.
        </p>

        {/* CTA Button */}
        <div className={styles.ctaWrapper}>
          <a href={`tel:${rawPhone}`} className={styles.ctaPillBtn} id="welcome-get-to-know-btn">
            <span className={styles.redDot} />
            <span>DIRECT INQUIRY: {rawPhone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
