'use client';

import styles from './MarqueeStrip.module.css';
import { useCompany } from '@/context/CompanyContext';

export default function MarqueeStrip() {
  const { company, formattedPhone } = useCompany();

  const marqueeItems = [
    `${company.brandName.toUpperCase()} — A BRAND BY ${company.parentCompany.toUpperCase()}`,
    'BRICKS • CEMENT • TMT BARS • SAND • STONE AGGREGATES • PAINTS • TILES • PLUMBING',
    'RELIABLE MATERIALS • PROFESSIONAL SUPPLY • BUILT ON TRUST',
    `ORDER DIRECTLY: ${formattedPhone} • ${company.facilityName.split(',')[0].toUpperCase()}, HOWRAH`,
  ];

  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <div className={styles.marqueeStrip} aria-hidden="true">
      <div className={styles.track}>
        {doubled.map((item, index) => (
          <div key={index} className={styles.itemWrapper}>
            <span className={styles.bulletDot}>•</span>
            <span className={styles.itemText}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
