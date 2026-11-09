'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Properties.module.css';
import { useCompany } from '@/context/CompanyContext';

interface MaterialItem {
  id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  variety: string;
  badge: string;
  image: string;
  specs: string[];
}

export interface PricingBenchmarkItem {
  id: string;
  description: string;
  tag?: string;
  standardUnit: string;
  brandVariety: string;
  benchmarkRate: string;
  order?: number;
}

const DEFAULT_BENCHMARK_RATES: PricingBenchmarkItem[] = [
  { id: 'price_row_01', description: 'River / M-Sand', tag: '⭐ Quality', standardUnit: '4 M.Tonns', brandVariety: 'RCC Casting Quality Sand', benchmarkRate: '₹9,700/-' },
  { id: 'price_row_02', description: 'Silver Sand', tag: '', standardUnit: '100 Sq.Ft', brandVariety: 'Plastering & Fine Finish Sand', benchmarkRate: '₹2,900/-' },
  { id: 'price_row_03', description: '5/8" Stone Aggregate', tag: '', standardUnit: '4 M.Tonns', brandVariety: '16mm Angular Ballast', benchmarkRate: '₹7,600/-' },
  { id: 'price_row_04', description: 'Cement (PPC / PSC)', tag: '', standardUnit: '1 Bag (50kg)', brandVariety: 'Ultratech (₹330/- + GST) | JSW (₹320/-)', benchmarkRate: '₹320 – ₹330/-' },
  { id: 'price_row_05', description: 'Waterproofing Chemical (No Damping)', tag: '', standardUnit: '20 Litres', brandVariety: 'Red Grade (₹2,600/-) | Gold Grade (₹6,400/-)', benchmarkRate: '₹2,600 – ₹6,400/-' },
  { id: 'price_row_06', description: 'Bricks', tag: '', standardUnit: '1000 Pieces', brandVariety: '1 No. (₹14,000/-) | Solling (₹16,000/-)', benchmarkRate: '₹14,000 – ₹16,000/-' },
  { id: 'price_row_07', description: 'TMT Steel Bar', tag: '', standardUnit: 'M.Tonns', brandVariety: 'Tata Tiscon / Shyam Steel / Skysail (Fe 550D)', benchmarkRate: 'As Per Listing' },
  { id: 'price_row_08', description: 'Paints & Emulsions', tag: '', standardUnit: 'Per Litre / Bucket', brandVariety: 'By Choice: Dulux / Berger / Asian Paints', benchmarkRate: 'Catalog Choice' },
];

const DEFAULT_PRICING_FOOTER_NOTE =
  '⚠️ Rates are based on market value & wholesale volume. Payment milestones: 30% advance on confirmation, 40% during site progress, 30% on completion.';

const materialsData: MaterialItem[] = [
  {
    id: 'bricks',
    name: 'Red Clay Construction Bricks',
    category: 'Masonry',
    price: '₹14,000',
    unit: 'Per 1000 Pieces',
    variety: '1 No. (₹14,000) • Solling (₹16,000)',
    badge: '1 NO. & SOLLING',
    image: '/images/updated/bricks-red-clay.jpeg',
    specs: ['Uniform shape & sharp edges', 'High compressive strength', 'Ideal for walls & solling'],
  },
  {
    id: 'cement',
    name: 'Certified Cement (Ultratech & JSW)',
    category: 'Cement & Steel',
    price: '₹320 – ₹330',
    unit: 'Per 50kg Bag (+ GST)',
    variety: 'Ultratech: ₹330/- • JSW: ₹320/- • ACC F2R',
    badge: 'PPC / PSC GRADE',
    image: '/images/updated/cement-ultratech-stack.jpeg',
    specs: ['Fresh factory direct batches', 'Weather Pro & rapid hardening', 'Optimal concrete bonding'],
  },
  {
    id: 'tmt',
    name: 'TMT Steel Rebar (Fe 550D Saria)',
    category: 'Cement & Steel',
    price: 'As Per Listing',
    unit: 'Per M.Tonn / Market Rate',
    variety: 'Tata Tiscon • Shyam Steel • Skysail • Vishakha',
    badge: 'FE 550D IRON SARIA',
    image: '/images/updated/iron-saria-ribbed.jpeg',
    specs: ['8mm to 32mm diameters', 'Superior earthquake & fatigue resistance', 'Deep uniform ribs for concrete grip'],
  },
  {
    id: 'sand',
    name: 'Sand for Casting & Plastering',
    category: 'Sand & Aggregate',
    price: '₹9,700',
    unit: 'Per 4 M.Tonns (River / M-Sand)',
    variety: 'Silver Sand: ₹2,900 / 100 Sq.Ft',
    badge: '⭐ QUALITY M-SAND',
    image: '/images/updated/sand-river-pile.jpeg',
    specs: ['Zero silt River & M-Sand for casting', 'Washed fine Silver sand for plaster', 'Smooth wall finishing'],
  },
  {
    id: 'silver-sand',
    name: 'Silver Sand for Plastering',
    category: 'Sand & Aggregate',
    price: '₹2,900',
    unit: 'Per 100 Sq.Ft / Brass',
    variety: 'Washed Fine Plaster Grade',
    badge: 'FINE PLASTER SAND',
    image: '/images/updated/sand-silver-plaster.jpeg',
    specs: ['Screened for zero pebbles', 'Ultra smooth finish for interior & exterior', 'Low rebound loss'],
  },
  {
    id: 'stones',
    name: 'Crushed Stone Aggregate & Bajri (5/8" & 1/2")',
    category: 'Sand & Aggregate',
    price: '₹7,600',
    unit: 'Per 4 M.Tonns (5/8" Ballast)',
    variety: '5/8" (16mm): ₹7,600 • 1/2" (12.5mm): ₹7,200',
    badge: 'ANGULAR BAJRI / BALLAST',
    image: '/images/updated/bajri-stone-chips.jpeg',
    specs: ['Angular shape for high interlocking', 'Ideal for RCC slab casting', 'Road base & ballast drainage'],
  },
  {
    id: 'cement-jsw',
    name: 'JSW & ACC Superfast Cement',
    category: 'Cement & Steel',
    price: '₹320 – ₹325',
    unit: 'Per 50kg Bag (+ GST)',
    variety: 'JSW Concreel HD • ACC F2R Superfast',
    badge: 'HIGH STRENGTH CEMENT',
    image: '/images/updated/cement-jsw-stack.jpeg',
    specs: ['Adani ACC F2R rapid hardening', 'JSW slag cement for moisture resistance', 'Ideal for foundation & slabs'],
  },
  {
    id: 'paints',
    name: 'Waterproofing & Construction Chemicals',
    category: 'Finishes',
    price: 'Universal Rates',
    unit: 'Cans / Tubs (CemMix & Epoxy)',
    variety: 'Shyam Steel Sturdflex CemMix • UltraTech Weather Pro WP+200',
    badge: 'WATERPROOFING SOLUTIONS',
    image: '/images/updated/chemicals-sturdflex-cemmix.jpeg',
    specs: ['Integral waterproofing admixture', 'Bond Epoxy high-strength adhesive', 'Weather Pro moisture shielding'],
  },
  {
    id: 'tiles',
    name: 'Vitrified & Designer Wall & Floor Tiles',
    category: 'Finishes',
    price: 'From ₹38',
    unit: 'Per Sq.Ft (Universal Range)',
    variety: 'Designer Wall • Calacatta Marble • 3D Geometric • Wood Terrazzo',
    badge: 'RECTIFIED TILES',
    image: '/images/updated/tiles-vitrified-display.jpeg',
    specs: ['Laser-rectified clean edges', 'Anti-skid bathroom & floor options', 'Scratch & stain resistant'],
  },
  {
    id: 'plumbing',
    name: 'UPVC & CPVC Plumbing Pipes',
    category: 'Plumbing & Chemical',
    price: 'Universal Rates',
    unit: 'Per Piece / Standard Length',
    variety: 'ISI Certified UPVC/CPVC Pipes • Heavy Fittings',
    badge: 'LEAK-PROOF PIPES',
    image: '/images/updated/plumbing-pipes-upvc.jpeg',
    specs: ['High-pressure water distribution', 'Anti-scaling smooth bore', 'Certified plumbing joints'],
  },
  {
    id: 'sanitaryware',
    name: 'Sanitaryware & Ceramic Bathroom Suites',
    category: 'Plumbing & Chemical',
    price: 'Wholesale Rates',
    unit: 'Per Set / Single Piece',
    variety: 'Cera Tree One-Piece Closets • Indian Pans • Designer Washbasins',
    badge: 'PREMIUM SANITARYWARE',
    image: '/images/updated/sanitaryware-cera-closet.jpeg',
    specs: ['Ultra glossy antibacterial glaze', 'Dual-flush water saving siphon', 'Soft-close virgin PP covers'],
  },
];

const categories = ['All', 'Cement & Steel', 'Masonry', 'Sand & Aggregate', 'Finishes', 'Plumbing & Chemical'];

export default function Properties() {
  const { company, rawPhone, formattedPhone, waLinkPhone } = useCompany();
  const [activeTab, setActiveTab] = useState('All');
  const [materials, setMaterials] = useState<MaterialItem[]>(materialsData);
  const [benchmarkRates, setBenchmarkRates] = useState<PricingBenchmarkItem[]>(DEFAULT_BENCHMARK_RATES);
  const [benchmarkFooterNote, setBenchmarkFooterNote] = useState<string>(DEFAULT_PRICING_FOOTER_NOTE);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiBase = isRemote ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
    const backendBase = isRemote ? '' : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');

    const fetchLiveProducts = async () => {
      try {
        const res = await fetch(`${apiBase}/products`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
          const liveItems: MaterialItem[] = data.products.map(
            (p: {
              id: string;
              name: string;
              category?: string;
              price: string;
              unit?: string;
              variety?: string;
              badge?: string;
              inStock?: boolean;
              images?: string[];
              image?: string;
              specs?: string[];
            }) => {
              let img = '/images/updated/bricks-red-clay.jpeg';
              if (Array.isArray(p.images) && p.images.length > 0) {
                const firstImg = p.images[0];
                img =
                  firstImg.startsWith('http') || firstImg.startsWith('/images')
                    ? firstImg
                    : `${backendBase}${firstImg}`;
              } else if (p.image) {
                img =
                  p.image.startsWith('http') || p.image.startsWith('/images')
                    ? p.image
                    : `${backendBase}${p.image}`;
              }

              // Sanitize legacy or broken image paths
              if (img.includes('sand-coarse-gravel')) {
                img = '/images/updated/sand-river-pile.jpeg';
              } else if (img.includes('interior-wall-paint')) {
                img = '/images/paints.jpg';
              }

              return {
                id: p.id,
                name: p.name,
                category: p.category || 'Masonry',
                price: p.price,
                unit: p.unit || 'Universal Market Rate',
                variety: p.variety || '',
                badge: p.badge || (p.inStock !== false ? 'IN STOCK' : 'PRE-BOOKING'),
                image: img,
                specs:
                  Array.isArray(p.specs) && p.specs.length > 0
                    ? p.specs
                    : ['Verified Grade', 'Factory Tested Batch', 'Direct Site Delivery'],
              };
            }
          );

          if (isMounted) {
            setMaterials(liveItems);
            setIsLiveConnected(true);
          }
        }
      } catch {
        // Backend offline or loading, keep default materials
      }
    };

    fetchLiveProducts();

    const fetchLivePricingTable = async () => {
      try {
        const res = await fetch(`${apiBase}/pricing-table`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success && Array.isArray(data.items) && data.items.length > 0) {
          if (isMounted) {
            setBenchmarkRates(data.items);
            if (data.footerNote) {
              setBenchmarkFooterNote(data.footerNote);
            }
          }
        }
      } catch {
        // Backend offline, keep default benchmark rates
      }
    };

    fetchLivePricingTable();
    const interval = setInterval(() => {
      fetchLiveProducts();
      fetchLivePricingTable();
    }, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredMaterials =
    activeTab === 'All'
      ? materials
      : materials.filter((item) => item.category === activeTab);

  return (
    <section className={styles.section} id="materials">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <div className={styles.eyebrow}>
              <span className={styles.redDot} />
              <span className={styles.eyebrowText}>A BRAND BY {company.parentCompany.toUpperCase()}</span>
            </div>
            <h2 className={styles.heading}>Building Materials & Universal Pricing</h2>
          </div>
          <div className={styles.headerRightCol}>
            <p className={styles.subtext}>
              Transparent market pricing based on official quotation benchmarks.
              Supplying verified materials for residential, apartment, and commercial sites.
            </p>
            <a href={`tel:${rawPhone}`} className={styles.callAdvisorPill}>
              <svg className={styles.pillPhone} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
              </svg>
              <span>Instant Call: {rawPhone}</span>
            </a>
          </div>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabsWrapper}>
          <div className={styles.tabsList}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.tabBtn} ${activeTab === cat ? styles.activeTabBtn : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLiveConnected && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                color: '#10b981',
                fontWeight: 700,
                letterSpacing: '0.04em',
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '4px 10px',
                borderRadius: '20px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
              title="Catalog is live synced with Admin Panel database"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              <span>LIVE ADMIN SYNCED</span>
            </div>
          )}
        </div>

        {/* Materials Grid */}
        <div className={styles.grid}>
          {filteredMaterials.map((item) => (
            <article key={item.id} className={styles.card} id={`material-${item.id}`}>
              {/* Image Container with Badge */}
              <div className={styles.imageWrap}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.cardImg}
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target && !target.src.includes('bricks-red-clay')) {
                      target.src = '/images/updated/bricks-red-clay.jpeg';
                    }
                  }}
                />
                <div className={styles.forSaleBadge}>
                  <span className={styles.badgeDot} />
                  <span>{item.badge}</span>
                </div>
              </div>

              {/* Card Meta & Details */}
              <div className={styles.cardContent}>
                <div className={styles.topMeta}>
                  <h3 className={styles.propName}>{item.name}</h3>
                  <div className={styles.priceBlock}>
                    <span className={styles.propPrice}>{item.price}</span>
                    <span className={styles.unitText}>{item.unit}</span>
                  </div>
                </div>

                <div className={styles.varietyBar}>
                  <span className={styles.varietyLabel}>Variety:</span>
                  <span className={styles.varietyVal}>{item.variety}</span>
                </div>

                <ul className={styles.specList}>
                  {item.specs.map((spec, i) => (
                    <li key={i} className={styles.specItem}>
                      <span className={styles.specCheck}>✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.cardActionRow}>
                  <a
                    href={`tel:${rawPhone}`}
                    className={styles.orderBtn}
                    aria-label={`Inquire about ${item.name}`}
                  >
                    <span>Order / Inquire</span>
                    <span className={styles.btnArrow}>→</span>
                  </a>
                  <a
                    href={`https://wa.me/${waLinkPhone}?text=Hello%20${encodeURIComponent(company.brandName)},%20I%20want%20to%20inquire%20about%20${encodeURIComponent(item.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappLogoBtn}
                    aria-label={`Inquire about ${item.name} on WhatsApp`}
                    title="Chat on WhatsApp"
                  >
                    <Image
                      src="/images/updated/whatsapp_logo.png"
                      alt="WhatsApp"
                      width={28}
                      height={28}
                      className={styles.whatsappLogoImg}
                      unoptimized
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Universal Quotation Benchmark Table */}
        <div className={styles.quotationTableCard}>
          <div className={styles.tableHeaderBlock}>
            <div className={styles.tableTitleGroup}>
              <span className={styles.tableBadge}>OFFICIAL BENCHMARK RATES</span>
              <h3 className={styles.tableTitle}>Universal Material Quotation Reference</h3>
              <p className={styles.tableSubtitle}>
                Standardized reference rates as per {company.brandName} Project Quotation ({company.coverageRegion})
              </p>
            </div>
            <div className={styles.quotationMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaKey}>Parent Brand:</span>
                <span className={styles.metaVal}>{company.parentCompany}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaKey}>Contact Helpline:</span>
                <span className={styles.metaVal}>{formattedPhone}</span>
              </div>
            </div>
          </div>

          <div className={styles.tableResponsive}>
            <table className={styles.priceTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Standard Unit</th>
                  <th>Brand / Variety & Info</th>
                  <th>Universal Benchmark Rate</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkRates.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.description}</strong>
                      {item.tag ? <span style={{ color: '#7A5F9A', fontWeight: 600 }}> ({item.tag})</span> : null}
                    </td>
                    <td>{item.standardUnit}</td>
                    <td>{item.brandVariety}</td>
                    <td className={styles.priceCell}>{item.benchmarkRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableFooterNote}>
            <p>{benchmarkFooterNote}</p>
            <a href={`tel:${rawPhone}`} className={styles.quoteCallBtn}>
              <span className={styles.btnDot} />
              <span>REQUEST CUSTOMIZED SITE QUOTATION: {rawPhone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}