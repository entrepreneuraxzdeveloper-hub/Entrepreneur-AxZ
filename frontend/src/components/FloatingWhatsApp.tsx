'use client';

import Image from 'next/image';
import styles from './FloatingWhatsApp.module.css';
import { useCompany } from '@/context/CompanyContext';

export default function FloatingWhatsApp() {
  const { company, formattedPhone, waLinkPhone } = useCompany();
  return (
    <aside aria-label="WhatsApp Contact">
      <a
        href={`https://wa.me/${waLinkPhone}?text=Hello%20${encodeURIComponent(company.brandName)},%20I%20would%20like%20to%20inquire%20about%20construction%20materials.`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatingBtn}
        aria-label={`Chat with ${company.brandName} on WhatsApp`}
        title={`Chat on WhatsApp (${formattedPhone})`}
      >
        <Image
          src="/images/updated/whatsapp_logo.png"
          alt="WhatsApp Logo"
          width={58}
          height={58}
          priority
          unoptimized
          className={styles.logoImg}
        />
        <span className={styles.tooltip}>Chat on WhatsApp</span>
      </a>
    </aside>
  );
}
