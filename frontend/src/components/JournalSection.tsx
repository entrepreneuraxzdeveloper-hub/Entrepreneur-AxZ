'use client';

import Image from 'next/image';
import styles from './JournalSection.module.css';
import { useCompany } from '@/context/CompanyContext';

const articles = [
  {
    id: 'art-1',
    category: 'STRUCTURAL STEEL',
    readTime: '5 MIN READ',
    title: 'Comparative Guide to Iron Saria: Fe 550D Ductility & Deep Rib Bond for India',
    image: '/images/updated/iron-saria-close.jpeg',
  },
  {
    id: 'art-2',
    category: 'CEMENT & CONCRETE',
    readTime: '6 MIN READ',
    title: 'Understanding Cement Varieties: Ultratech Premium, JSW & ACC F2R Superfast',
    image: '/images/updated/cement-ultratech-premium.jpeg',
  },
  {
    id: 'art-3',
    category: 'SAND & AGGREGATES',
    readTime: '4 MIN READ',
    title: 'Selecting Casting Sand vs Silver Plastering Sand & 5/8" Angular Bajri',
    image: '/images/updated/bajri-stone-chips.jpeg',
  },
];

export default function JournalSection() {
  const { company, rawPhone } = useCompany();
  return (
    <section className={styles.section} id="journal">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <div className={styles.eyebrow}>
              <span className={styles.redDot} />
              <span className={styles.eyebrowText}>MATERIAL GUIDES & INSIGHTS</span>
            </div>
            <h2 className={styles.heading}>Technical guides for smarter building.</h2>
          </div>
          <div className={styles.rightAction}>
            <p className={styles.subtext}>
              A Brand by {company.parentCompany}. Practical specifications, testing standards,
              and material selections to help you optimize project cost and durability.
            </p>
            <a href={`tel:${rawPhone}`} className={styles.readJournalBtn} id="journal-read-btn">
              <span className={styles.btnDot} />
              <span>CONSULT OUR ENGINEERS: {rawPhone}</span>
            </a>
          </div>
        </div>

        {/* 3 Journal Cards Grid */}
        <div className={styles.articlesGrid}>
          {articles.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw"
                  className={styles.cardImg}
                />
              </div>
              <div className={styles.metaRow}>
                <span className={styles.category}>{item.category}</span>
                <span className={styles.metaDot}>•</span>
                <span className={styles.readTime}>{item.readTime}</span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <a href={`tel:${rawPhone}`} className={styles.readLink}>
                INQUIRE FOR YOUR PROJECT →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}