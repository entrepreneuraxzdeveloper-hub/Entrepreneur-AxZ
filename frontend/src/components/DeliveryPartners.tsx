'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './DeliveryPartners.module.css';
import { useCompany } from '@/context/CompanyContext';

interface ServicePillar {
  id?: string;
  num?: string;
  title: string;
  desc: string;
  shortDesc?: string;
}

const defaultPillars: ServicePillar[] = [
  {
    num: '01',
    title: 'Fleet Ready for All Site Scales',
    desc: 'Heavy-ton dumpers, covered flatbeds, and mini-trucks engineered to access wide commercial avenues and narrow residential construction alleys alike.',
  },
  {
    num: '02',
    title: 'Zero-Breakage Site Unloading',
    desc: 'Trained crew providing careful offloading: uniform stacking of red bricks, rib-safe TMT rebar placement, and dry-pallet cement positioning.',
  },
  {
    num: '03',
    title: 'Direct Driver Phone Coordination',
    desc: 'Real-time phone and WhatsApp updates with your assigned driver so site engineers and contractors know the exact GPS dispatch status.',
  },
  {
    num: '04',
    title: 'Howrah, Kolkata & Hooghly Coverage',
    desc: 'Rapid material delivery hubs covering Sankrail, Beltala, Andul, Kona Expressway, South/Central Kolkata, and industrial corridors.',
  },
];

export default function DeliveryPartners() {
  const { company, rawPhone, waLinkPhone } = useCompany();
  const [services, setServices] = useState<ServicePillar[]>(defaultPillars);

  useEffect(() => {
    let isMounted = true;
    const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiBase = isRemote ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    const fetchServices = async () => {
      try {
        const res = await fetch(`${apiBase}/services`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success && Array.isArray(data.services) && data.services.length > 0) {
          const mapped: ServicePillar[] = data.services.map((s: { id?: string; title: string; shortDesc?: string; description?: string }, i: number) => ({
            id: s.id,
            num: `0${i + 1}`,
            title: s.title,
            desc: s.shortDesc || s.description || '',
          }));

          if (isMounted) {
            setServices(mapped);
          }
        }
      } catch {
        // Keep default pillars
      }
    };

    fetchServices();
    const interval = setInterval(fetchServices, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  return (
    <section className={styles.section} id="delivery-partners">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <div className={styles.eyebrow}>
              <span className={styles.redDot} />
              <span className={styles.eyebrowText}>DEDICATED FLEET & ON-GROUND CREW</span>
            </div>
            <h2 className={styles.heading}>Our Delivery Partners & Drivers</h2>
          </div>
          <div className={styles.headerRightCol}>
            <p className={styles.subtext}>
              A Brand by {company.parentCompany}. Behind every multi-ton shipment of steel,
              sand, cement, and bricks stands our dedicated logistics team ensuring reliable,
              on-time delivery to your construction site.
            </p>
            <a href={`tel:${rawPhone}`} className={styles.callDispatchPill}>
              <svg
                className={styles.pillPhone}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
              </svg>
              <span>Dispatch Line: {rawPhone}</span>
            </a>
          </div>
        </div>

        {/* Showcase Grid: Team Photo + Performance Stats & Fleet Overview */}
        <div className={styles.showcaseGrid}>
          {/* Left: Driver Team Photo */}
          <div className={styles.imageCard}>
            <Image
              src="/images/updated/delivery-partners-team.jpeg"
              alt="Roychowdhury and Sons & Entrepreneur AxZ Dedicated Delivery Drivers and Site Logistics Team"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className={styles.teamImg}
              priority
            />
            <div className={styles.imageOverlay} />

            <div className={styles.floatingPillTop}>
              <span className={styles.pulsingDot} />
              <span>ACTIVE DISPATCH CREW • SANKRAIL DEPOT</span>
            </div>

            <div className={styles.teamCaptionBox}>
              <div className={styles.teamCaptionTag}>ON-GROUND RELIABILITY</div>
              <h3 className={styles.teamCaptionTitle}>
                The Hands That Build Our Trust Across Bengal
              </h3>
              <p className={styles.teamCaptionDesc}>
                Our experienced drivers and unloading crew operate direct from our {company.facilityName.split(',')[0]}
                warehouse, maintaining punctuality and verified piece-counts at every drop.
              </p>
            </div>
          </div>

          {/* Right: Operational Metrics & Quick Dispatch Card */}
          <div className={styles.detailsCol}>
            {/* Dark Performance Banner */}
            <div className={styles.statBanner}>
              <div className={styles.statBannerTitle}>DISPATCH BENCHMARKS</div>
              <div className={styles.statsRow}>
                <div>
                  <div className={styles.statNum}>100+</div>
                  <div className={styles.statLabel}>Tonnes Delivered Daily</div>
                </div>
                <div>
                  <div className={styles.statNum}>99.4%</div>
                  <div className={styles.statLabel}>On-Time Site Arrivals</div>
                </div>
                <div>
                  <div className={styles.statNum}>100%</div>
                  <div className={styles.statLabel}>Verified Dispatch Counts</div>
                </div>
              </div>
            </div>

            {/* Fleet & Coordinator Card */}
            <div className={styles.fleetCard}>
              <h3 className={styles.fleetTitle}>
                <svg
                  className={styles.fleetIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Direct Site Dispatch & Coordination</span>
              </h3>
              <p className={styles.fleetDesc}>
                Need bulk delivery of TMT rebar, sand (River / M-Sand / Silver), crushed bajri,
                cement bags, or red bricks? Contact our dispatch coordinator directly for same-day
                or scheduled site unloading.
              </p>
              <div className={styles.fleetActionButtons}>
                <a href={`tel:${rawPhone}`} className={styles.callBtnSmall}>
                  <span>CALL DRIVER DESK</span>
                </a>
                <a
                  href={`https://wa.me/${waLinkPhone}?text=Hello%20${encodeURIComponent(company.brandName)},%20I%20would%20like%20to%20schedule%20a%20site%20delivery%20for%20building%20materials.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waBtnSmall}
                >
                  <Image
                    src="/images/updated/whatsapp_logo.png"
                    alt="WhatsApp"
                    width={18}
                    height={18}
                    className={styles.waIconSmall}
                    unoptimized
                  />
                  <span>WHATSAPP DISPATCH</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Delivery Pillars Grid */}
        <div className={styles.pillarsGrid}>
          {services.map((item, idx) => (
            <div key={item.id || item.num || idx} className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <span className={styles.pillarNum}>({item.num || `0${idx + 1}`})</span>
                <span className={styles.pillarDot} />
              </div>
              <h4 className={styles.pillarTitle}>{item.title}</h4>
              <p className={styles.pillarDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

