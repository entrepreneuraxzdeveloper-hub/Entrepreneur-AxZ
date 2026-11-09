'use client';

import styles from './ProcessSection.module.css';
import { useCompany } from '@/context/CompanyContext';

const steps = [
  {
    step: 'STEP 01',
    title: 'Material Specifications',
    desc: 'Share your construction schedule, drawings, and required quantities for bricks, cement, TMT rebar, sand, or plumbing.',
  },
  {
    step: 'STEP 02',
    title: 'Universal Quotation',
    desc: 'Receive an itemized transparent quotation benchmarked against verified wholesale market rates with GST accuracy.',
  },
  {
    step: 'STEP 03',
    title: 'Batch Quality Check',
    desc: 'We verify compressive strength, Fe 550D rebar test certificates, and fresh factory packaging prior to dispatch.',
  },
  {
    step: 'STEP 04',
    title: 'On-Site Unloading',
    desc: 'Prompt delivery right to your construction site in Howrah and Kolkata with safe unloading and milestone progress terms.',
  },
];

export default function ProcessSection() {
  const { rawPhone } = useCompany();
  return (
    <section className={styles.section} id="process">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <div className={styles.eyebrow}>
              <span className={styles.redDot} />
              <span className={styles.eyebrowText}>OUR SUPPLY PROCESS</span>
            </div>
            <h2 className={styles.heading}>From quotation to on-site delivery.</h2>
          </div>
          <a href={`tel:${rawPhone}`} className={styles.howWeWorkBtn} id="process-how-we-work-btn">
            <span className={styles.btnDot} />
            <span>CALL TO ORDER: {rawPhone}</span>
          </a>
        </div>

        {/* 4 Step Cards */}
        <div className={styles.stepsGrid}>
          {steps.map((item) => (
            <div key={item.step} className={styles.stepCard}>
              <div className={styles.cardTop}>
                <span className={styles.stepLabel}>{item.step}</span>
                <span className={styles.stepDot} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}