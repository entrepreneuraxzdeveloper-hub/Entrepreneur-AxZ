'use client';

import Image from 'next/image';
import styles from './Footer.module.css';
import { useCompany } from '@/context/CompanyContext';

export default function Footer() {
  const { company, rawPhone, formattedPhone } = useCompany();
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        {/* Top Info Grid */}
        <div className={styles.topGrid}>
          {/* Col 1: Socials & Mission Statement */}
          <div className={styles.brandCol}>
            <div className={styles.footerLogoWrap}>
              <Image
                src="/images/updated/Logo.png"
                alt="Entrepreneur AxZ Logo"
                width={150}
                height={60}
                className={styles.footerLogo}
              />
            </div>

            <div className={styles.parentBrandBadge}>
              <span className={styles.badgeDot} />
              <span>A Brand by {company.parentCompany}</span>
            </div>

            <h3 className={styles.missionHeadline}>
              Reliable Materials.
              <br />
              Built on Trust.
            </h3>
            <p className={styles.missionSubtext}>
              Commercial and residential building materials covering site preparation,
              masonry, structural casting, partitions, flooring, plumbing, and final painting closure.
            </p>
          </div>

          {/* Col 2: Materials & Quick Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>SUPPLIES & MATERIALS</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#materials" className={styles.navLink}>
                  Bricks (1 No. & Solling)
                </a>
              </li>
              <li>
                <a href="#materials" className={styles.navLink}>
                  Cement (Ultratech, JSW, ACC)
                </a>
              </li>
              <li>
                <a href="#materials" className={styles.navLink}>
                  TMT Steel Rebars (Fe 550D)
                </a>
              </li>
              <li>
                <a href="#materials" className={styles.navLink}>
                  Sand (River, M-Sand, Silver)
                </a>
              </li>
              <li>
                <a href="#materials" className={styles.navLink}>
                  Stone Aggregates (5/8&quot; &amp; 1/2&quot;)
                </a>
              </li>
              <li>
                <a href="#delivery-partners" className={styles.navLink}>
                  Our Delivery Fleet & Drivers
                </a>
              </li>
              <li>
                <a href="#materials" className={styles.navLink}>
                  Paints, Tiles & Plumbing
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details & Button */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>CONTACT & DEPOT</h4>
            <div className={styles.contactDetails}>
              <div className={styles.contactRow}>
                <span className={styles.contactLabel}>Phone:</span>
                <a href={`tel:${rawPhone}`} className={styles.phoneHighlight}>
                  {formattedPhone}
                </a>
              </div>
              <div className={styles.contactRow}>
                <span className={styles.contactLabel}>Location:</span>
                <span className={styles.contactText}>
                  {company.facilityName}
                </span>
              </div>
              <div className={styles.contactRow}>
                <span className={styles.contactLabel}>Authorized:</span>
                <span className={styles.contactText}>{company.parentCompany}</span>
              </div>
            </div>

            <div className={styles.btnWrap}>
              <a href={`tel:${rawPhone}`} className={styles.talkBtn} id="footer-talk-btn">
                <span className={styles.btnDot} />
                <span>CALL: {rawPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Copyright Row */}
        <div className={styles.legalRow}>
          <p className={styles.copyright}>
            © 2026 {company.brandName.toUpperCase()} • A BRAND BY {company.parentCompany.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>
          <div className={styles.legalLinks}>
            <a href={`tel:${rawPhone}`} className={styles.legalLink}>
              TEL: {rawPhone}
            </a>
            <a href="#materials" className={styles.legalLink}>
              UNIVERSAL PRICING
            </a>
          </div>
        </div>

        {/* Giant Outlined Typography Banner */}
        <div className={styles.giantOutlineWrap} aria-hidden="true">
          <div className={styles.giantOutlineWord}>
            <span className={styles.outlinePrimary}>ENTREPRENEUR</span>
            <span className={styles.outlineSecondary}>AxZ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}