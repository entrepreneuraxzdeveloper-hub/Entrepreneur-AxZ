'use client';

import styles from './StatsSection.module.css';
import { useCompany } from '@/context/CompanyContext';

const stats = [
  {
    num: '500+',
    label: 'BUILDING SITES SUPPLIED',
    index: '(01)',
  },
  {
    num: '100%',
    label: 'CERTIFIED TESTED BATCHES',
    index: '(02)',
  },
  {
    num: '24-48h',
    label: 'FAST ON-SITE DISPATCH',
    index: '(03)',
  },
  {
    num: '8+',
    label: 'CORE MATERIAL CATEGORIES',
    index: '(04)',
  },
];

export default function StatsSection() {
  const { rawPhone } = useCompany();
  return (
    <section className={styles.section} id="stats">
      <div className={styles.container}>
        {/* Top Header Row */}
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>
            Strength & reliability that
            <br />
            build solid foundations.
          </h2>
          <a href={`tel:${rawPhone}`} className={styles.advisorBtn} id="stats-advisor-btn">
            <span className={styles.redDot} />
            <span>DISCUSS SUPPLY: {rawPhone}</span>
          </a>
        </div>

        {/* 4 Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.index} className={styles.statCol}>
              <div className={styles.colTop}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statIndex}>{stat.index}</span>
              </div>
              <p className={styles.statNumber}>{stat.num}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}