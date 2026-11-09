'use client';

import styles from './Reviews.module.css';

const testimonials = [
  {
    id: 't1',
    author: 'Tanmay Dutta',
    role: 'Verified Customer & Apartment Developer',
    quote:
      'Entrepreneur AxZ provided all the cement, TMT steel, and casting sand for our apartment project in Sarenga, Beltala. Delivered on time and at genuine universal quotation rates.',
  },
  {
    id: 't2',
    author: 'Rahul Roy Chowdhury',
    role: 'Founder & Managing Director, Roychowdhury and Sons',
    quote:
      'Our commitment at Entrepreneur AxZ is absolute transparency. Every batch of Fe 550D rebar, Ultratech/JSW cement, and brick undergoes rigorous quality checks before reaching your site.',
  },
  {
    id: 't3',
    author: 'Subhamoy Banerjee',
    role: 'Commercial Contractor, Howrah',
    quote:
      'Transparent milestone terms (30/40/30) and flawless logistics. Their plumbing tanks, tiles, and paints made our finishing phase seamless and on budget.',
  },
];

export default function Reviews() {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerBlock}>
          <div className={styles.eyebrow}>
            <span className={styles.redDot} />
            <span className={styles.eyebrowText}>BUILDER & CONTRACTOR TRUST</span>
          </div>
          <h2 className={styles.heading}>Built on trust. Proven on site.</h2>
        </div>

        {/* 3 Testimonial Cards */}
        <div className={styles.cardsGrid}>
          {testimonials.map((item) => (
            <div key={item.id} className={styles.quoteCard}>
              <span className={styles.quoteMark}>“</span>
              <p className={styles.quoteText}>{item.quote}</p>
              <div className={styles.authorBlock}>
                <span className={styles.authorName}>{item.author}</span>
                <span className={styles.authorRole}>{item.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}