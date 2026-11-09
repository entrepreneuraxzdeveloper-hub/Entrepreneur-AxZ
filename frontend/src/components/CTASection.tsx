'use client';

import Image from 'next/image';
import styles from './CTASection.module.css';
import { useCompany } from '@/context/CompanyContext';

export default function CTASection() {
  const { company, rawPhone, waLinkPhone } = useCompany();
  return (
    <section className={styles.section} id="contact-cta">
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.content}>
            <div className={styles.cornerTag}>
              <span className={styles.tagDot} />
              <span>A Brand by {company.parentCompany}</span>
            </div>
            <h2 className={styles.heading}>
              Construct anything with certified strength.
              <br />
              Connect with {company.brandName}.
            </h2>
            <p className={styles.subtext}>
              Need bulk Bricks, Cement, TMT Rebar, Sand, Stone, Paints, Tiles, or Plumbing?
              Get an instant itemized universal quotation today.
            </p>
          </div>
          <div className={styles.actionWrap}>
            <a href={`tel:${rawPhone}`} className={styles.talkBtn} id="cta-talk-btn">
              <svg className={styles.ctaPhoneIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
              </svg>
              <span>CALL: {rawPhone}</span>
            </a>
            <a
              href={`https://wa.me/${waLinkPhone}?text=Hello%20${encodeURIComponent(company.brandName)},%20I%20would%20like%20to%20request%20a%20quotation%20for%20construction%20materials.`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
              aria-label="Chat on WhatsApp"
            >
              <Image
                src="/images/updated/whatsapp_logo.png"
                alt="WhatsApp"
                width={26}
                height={26}
                className={styles.whatsappLogoImg}
                unoptimized
              />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}