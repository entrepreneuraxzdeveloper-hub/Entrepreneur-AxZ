'use client';

import Image from 'next/image';
import styles from './Listings.module.css';

export default function Listings() {
  return (
    <section className={styles.section} id="approach">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <div className={styles.eyebrow}>
              <span className={styles.redDot} />
              <span className={styles.eyebrowText}>WHY ENTREPRENEUR AxZ</span>
            </div>
            <h2 className={styles.heading}>Reliable supply for every stage of build.</h2>
          </div>
          <p className={styles.subtext}>
            A Brand by Roychowdhury and Sons. We combine direct manufacturer networks,
            strict batch testing, and prompt on-site dispatch so your construction never pauses.
          </p>
        </div>

        {/* Small Section Label */}
        <div className={styles.labelRow}>
          <span className={styles.sectionTag}>OUR SUPPLY COMMITMENT</span>
        </div>

        {/* 3-Column Bento Grid */}
        <div className={styles.bentoGrid}>
          {/* Column 1: Tall Architecture & Site Card with Text Overlay */}
          <div className={styles.tallCardCol}>
            <div className={styles.tallCard}>
              <Image
                src="/images/updated/storefront-entrance.jpeg"
                alt="Entrepreneur AxZ and Roychowdhury & Sons depot entrance"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw"
                className={styles.cardImg}
              />
              <div className={styles.tallCardOverlay}>
                <h3 className={styles.tallCardHeading}>
                  Direct Manufacturer Sourcing.
                  <br />
                  Universal Transparent Rates.
                  <br />
                  Prompt Site Unloading.
                </h3>
              </div>
            </div>
          </div>

          {/* Column 2: (01) White Card + (02) Brand Red/Accent Card */}
          <div className={styles.stackedCol}>
            {/* Tile 01: Direct Sourcing */}
            <div className={styles.whiteCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNumRed}>(01)</span>
                <span className={styles.cardDotRed} />
              </div>
              <h3 className={styles.cardTitleDark}>Direct Manufacturer Supply</h3>
              <p className={styles.cardDescDark}>
                Direct sourcing from Ultratech, JSW, Tata, Shyam Steel, and licensed brick kilns
                to assure authentic grades and prevent distributor markups.
              </p>
            </div>

            {/* Tile 02: Universal Pricing */}
            <div className={styles.redCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNumWhite}>(02)</span>
                <span className={styles.cardDotWhite} />
              </div>
              <h3 className={styles.cardTitleWhite}>Universal Transparent Rates</h3>
              <p className={styles.cardDescWhite}>
                Itemized project quotations based on genuine market rates with full GST
                billing and clear milestone terms (30% / 40% / 30%).
              </p>
            </div>
          </div>

          {/* Column 3: Material Image + (03) Charcoal Card */}
          <div className={styles.stackedCol}>
            {/* Tile: Bajri & Construction Aggregate Yard Image */}
            <div className={styles.imageCardTile}>
              <Image
                src="/images/updated/bajri-aggregate-yard.jpeg"
                alt="Tested construction crushed stone aggregate & bajri"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw"
                className={styles.cardImg}
              />
            </div>

            {/* Tile 03: Site Logistics */}
            <div className={styles.darkCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNumRed}>(03)</span>
                <span className={styles.cardDotRed} />
              </div>
              <h3 className={styles.cardTitleWhite}>Fast Fleet Dispatch</h3>
              <p className={styles.cardDescMuted}>
                Dedicated logistics handling multi-ton sand, stone aggregates, and rebar
                straight to your site in Howrah, Beltala, and Kolkata.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}