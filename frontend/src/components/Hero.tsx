'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { useCompany } from '@/context/CompanyContext';

export default function Hero() {
  const { company, rawPhone } = useCompany();
  const [materialCategory, setMaterialCategory] = useState('All');
  const [projectScale, setProjectScale] = useState('All');
  const [preferredBrand, setPreferredBrand] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const target = document.querySelector('#materials');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.heroSection} id="hero">
      <div className={styles.container}>
        {/* Top Header Metadata Bar */}
        <div className={styles.subHeaderBar}>
          <span className={styles.subBarLeft}>
            COMMERCIAL & RESIDENTIAL BUILDING MATERIALS
          </span>
          <div className={styles.subBarRightWrap}>
            <span className={styles.subBarDash} />
            <span className={styles.subBarRight}>
              {company.coverageRegion.toUpperCase()} • DIRECT SUPPLY
            </span>
          </div>
        </div>

        {/* Edge-to-Edge Brand Typography Banner */}
        <div className={styles.giantWordmarkWrap} aria-label="ENTREPRENEUR AxZ">
          <div className={styles.giantWordmark}>
            <span className={styles.giantWordPrimary}>ENTREPRENEUR</span>
            <span className={styles.giantWordSecondary}>AxZ</span>
          </div>
        </div>

        {/* 3-Column Hero Grid */}
        <div className={styles.heroGrid}>
          {/* Column 1: Headline & Copy with Right Corner Badge */}
          <div className={styles.textCol}>
            <div className={styles.headlineWrapper}>
              <div className={styles.headlineTopRow}>
                <span className={styles.eyebrowTag}>DIRECT MATERIAL SUPPLY</span>
                {/* Heading ke right side ke Kone mein: A Brand by Roychowdhury and Sons */}
                <div className={styles.rightCornerBrand}>
                  <span className={styles.cornerDot} />
                  <span>A Brand by {company.parentCompany}</span>
                </div>
              </div>

              <h1 className={styles.mainHeadline}>
                Reliable Materials.
                <br />
                Built on Trust.
              </h1>
            </div>

            <p className={styles.heroDescription}>
              Commercial & residential building materials covering site preparation,
              partitions, flooring, painting, and final closure. Premium Bricks, Cement,
              TMT Bars, Sand, Stone Aggregates, Paints, Tiles, and Plumbing.
            </p>

            <div className={styles.heroActionRow}>
              <a href={`tel:${rawPhone}`} className={styles.heroCallBtn}>
                <svg
                  className={styles.callIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
                <span>CALL {rawPhone}</span>
              </a>
              <a href="#materials" className={styles.heroExploreBtn}>
                <span>VIEW PRICING LIST</span>
              </a>
            </div>

            {/* Contractor & Client Portal Auth Strip in Hero */}
            <div className={styles.heroAuthContainer}>
              <div className={styles.authInfo}>
                <span className={styles.authBadgePill}>
                  <span className={styles.authBadgeDot} />
                  <span>CONTRACTOR & CLIENT PORTAL</span>
                </span>
                <span className={styles.authSubtitle}>Wholesale price slabs, GST invoices & dispatch tracking</span>
              </div>
              <div className={styles.heroAuthButtons}>
                <Link href="/login" className={styles.heroLoginBtn} id="hero-login-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  <span>LOG IN</span>
                </Link>
                <Link href="/register" className={styles.heroSignUpBtn} id="hero-signup-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  <span>SIGN UP</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Architectural Infrastructure & Project Solene */}
          <div className={styles.imageColMiddle}>
            <div className={styles.imageCard}>
              <Image
                src="/images/updated/prop_solene.jpg"
                alt="Entrepreneur AxZ Architectural Infrastructure & Materials Supply"
                fill
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 35vw"
                className={styles.cardImage}
              />
              <div className={styles.cardFloatingTag}>
                <span className={styles.tagDot} />
                <span>ARCHITECTURAL SUPPLY • SOLENE</span>
              </div>
            </div>
          </div>

          {/* Column 3: Premium Designer & Vitrified Tiles */}
          <div className={styles.imageColRight}>
            <div className={styles.imageCard}>
              <Image
                src="/images/updated/tiles.jpg"
                alt="Vitrified & Ceramic Architectural Tiles Collection"
                fill
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 38vw"
                className={styles.cardImage}
              />
              <div className={styles.cardFloatingTag}>
                <span className={styles.tagDot} />
                <span>PREMIUM TILES & SURFACES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Filter / Material Quick Estimator Bar */}
        <div className={styles.filterBarWrapper}>
          <form className={styles.filterBar} onSubmit={handleSearch}>
            {/* Filter 1: Material Category */}
            <div className={styles.filterItem}>
              <label htmlFor="filter-material" className={styles.filterLabel}>
                MATERIAL CATEGORY
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="filter-material"
                  value={materialCategory}
                  onChange={(e) => setMaterialCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="All">All Construction Materials</option>
                  <option value="Bricks">Bricks (1 No. & Solling)</option>
                  <option value="Cement">Cements (Ultratech, JSW, ACC)</option>
                  <option value="TMT">TMT Bars (Fe 550D)</option>
                  <option value="Sand">Sand (River, M-Sand, Silver)</option>
                  <option value="Stones">Stone Aggregates (5/8&quot; &amp; 1/2&quot;)</option>
                  <option value="Paints">Paints (Dulux, Berger)</option>
                  <option value="Tiles">Tiles (Vitrified & Ceramic)</option>
                  <option value="Plumbing">Plumbing (Tanks & Pipes)</option>
                </select>
                <svg
                  className={styles.selectArrow}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className={styles.filterDivider} />

            {/* Filter 2: Project Scale */}
            <div className={styles.filterItem}>
              <label htmlFor="filter-scale" className={styles.filterLabel}>
                PROJECT SCALE
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="filter-scale"
                  value={projectScale}
                  onChange={(e) => setProjectScale(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="All">All Scale Projects</option>
                  <option value="Apartment">Apartment & Multi-Storey</option>
                  <option value="Residential">Residential Construction</option>
                  <option value="Commercial">Commercial & Industrial</option>
                  <option value="SitePrep">Site Preparation & Flooring</option>
                </select>
                <svg
                  className={styles.selectArrow}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className={styles.filterDivider} />

            {/* Filter 3: Preferred Brand */}
            <div className={styles.filterItem}>
              <label htmlFor="filter-brand" className={styles.filterLabel}>
                QUALITY & BRAND
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="filter-brand"
                  value={preferredBrand}
                  onChange={(e) => setPreferredBrand(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="All">Universal / Verified Grade</option>
                  <option value="Ultratech">Ultratech / JSW Cement</option>
                  <option value="Tata">Tata TMT / Shyam Steel</option>
                  <option value="Paints">Dulux / Berger Paints</option>
                  <option value="Premium">Premium Tested Quality</option>
                </select>
                <svg
                  className={styles.selectArrow}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Filter Action Button */}
            <button type="submit" className={styles.filterBtn} id="filter-submit-btn">
              <span className={styles.btnDot} />
              <span>EXPLORE UNIVERSAL PRICING</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
