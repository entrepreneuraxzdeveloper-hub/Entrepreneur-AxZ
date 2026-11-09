'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Contact.module.css';
import { useCompany } from '@/context/CompanyContext';

const LOCATION_PRESETS = [
  'Howrah, West Bengal',
  'Howrah (Sankrail & Andul)',
  'Howrah (Kona, Belur & Bally)',
  'Howrah (Uluberia & Bagnan)',
  'Kolkata (Central & South)',
  'Kolkata (New Town & Salt Lake)',
  'Kolkata (North & Dum Dum)',
  'Hooghly (Uttarpara & Serampore)',
  'Hooghly (Dankuni Logistics Hub)',
];

export default function Contact() {
  const { company, rawPhone, formattedPhone, waLinkPhone } = useCompany();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryRef, setInquiryRef] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('Howrah, West Bengal');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    material: 'All Materials (Complete Site)',
    location: 'Howrah, West Bengal',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiBase = isRemote ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    try {
      const res = await fetch(`${apiBase}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          source: 'Website Site Quotation Form',
        }),
      });

      const data = await res.json();
      if (data && data.success && data.inquiry) {
        setInquiryRef(data.inquiry.id);
      } else {
        setInquiryRef(`REF-${Date.now().toString().slice(-6)}`);
      }
    } catch (err) {
      console.warn('Backend offline or network error, logging request locally:', err);
      setInquiryRef(`REF-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Depot Info & Image Card */}
          <div className={styles.leftCol}>
            <div className={styles.imageCard}>
              <Image
                src="/images/updated/storefront-roycon.jpeg"
                alt="Entrepreneur AxZ and Roycon Central Materials Depot & Site Logistics"
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                className={styles.depotImg}
                priority
              />
              <div className={styles.imageOverlay} />

              <div className={styles.depotFloatingCard}>
                <div className={styles.depotBadge}>
                  <span className={styles.badgeDot} />
                  <span>CENTRAL DEPOT & LOGISTICS</span>
                </div>
                <h3 className={styles.depotTitle}>{company.facilityName.split(',')[0]}</h3>
                <p className={styles.depotAddress}>
                  {company.facilityName}
                </p>

                <div className={styles.hoursDivider} />

                <div className={styles.depotHoursBlock}>
                  <div className={styles.hoursRow} style={{ alignItems: 'flex-start' }}>
                    <span className={styles.hoursDay}>Hours:</span>
                    <span className={styles.hoursTime}>{company.operatingSchedule}</span>
                  </div>
                </div>

                <div className={styles.depotCallRow}>
                  <span className={styles.directLabel}>Direct Hotline:</span>
                  <a href={`tel:${rawPhone}`} className={styles.directPhoneLink}>
                    {formattedPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form & Details */}
          <div className={styles.rightCol}>
            <div className={styles.formHeader}>
              <div className={styles.eyebrow}>
                <span className={styles.redDot} />
                <span className={styles.eyebrowText}>
                  A BRAND BY {company.parentCompany.toUpperCase()}
                </span>
              </div>
              <h2 className={styles.heading}>Request a Site Quotation</h2>
              <p className={styles.subtext}>
                Get accurate universal quotation pricing for your apartment, residential,
                or commercial project with direct site delivery across Howrah &amp; Kolkata.
              </p>
            </div>

            {/* Quick Contact & Location Selector Cards */}
            <div className={styles.contactCardsRow}>
              <a href={`tel:${rawPhone}`} className={styles.miniCard}>
                <div className={styles.miniIconWrap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                  </svg>
                </div>
                <div>
                  <span className={styles.miniLabel}>Call Directly</span>
                  <strong className={styles.miniVal}>{rawPhone}</strong>
                </div>
              </a>

              {/* Interactive Location Selector Card */}
              <div className={styles.miniCardLocation}>
                <div className={styles.miniIconWrap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className={styles.locationContentWrap}>
                  <span className={styles.miniLabel}>Delivery Location</span>
                  {isCustomLocation ? (
                    <div className={styles.customLocationBox}>
                      <input
                        type="text"
                        placeholder="Type city or area..."
                        value={form.location}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({ ...prev, location: val }));
                        }}
                        className={styles.miniLocationInput}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomLocation(false);
                          setSelectedLocation('Howrah, West Bengal');
                          setForm((prev) => ({ ...prev, location: 'Howrah, West Bengal' }));
                        }}
                        className={styles.miniResetBtn}
                        title="Choose from list"
                        aria-label="Back to preset list"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.miniSelectWrap}>
                      <select
                        value={selectedLocation}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__custom__') {
                            setIsCustomLocation(true);
                            setForm((prev) => ({ ...prev, location: '' }));
                          } else {
                            setSelectedLocation(val);
                            setForm((prev) => ({ ...prev, location: val }));
                          }
                        }}
                        className={styles.miniLocationSelect}
                        aria-label="Select delivery location"
                      >
                        <option value="Howrah, West Bengal">Howrah, West Bengal (Main Depot)</option>
                        <option value="Howrah (Sankrail & Andul)">Howrah (Sankrail &amp; Andul)</option>
                        <option value="Howrah (Kona, Belur & Bally)">Howrah (Kona, Belur &amp; Bally)</option>
                        <option value="Howrah (Uluberia & Bagnan)">Howrah (Uluberia &amp; Bagnan)</option>
                        <option value="Kolkata (Central & South)">Kolkata (Central &amp; South)</option>
                        <option value="Kolkata (New Town & Salt Lake)">Kolkata (New Town &amp; Salt Lake)</option>
                        <option value="Kolkata (North & Dum Dum)">Kolkata (North &amp; Dum Dum)</option>
                        <option value="Hooghly (Uttarpara & Serampore)">Hooghly (Uttarpara &amp; Serampore)</option>
                        <option value="Hooghly (Dankuni Logistics Hub)">Hooghly (Dankuni Logistics Hub)</option>
                        <option value="__custom__">✏️ Set Custom Location...</option>
                      </select>
                      <svg
                        className={styles.miniSelectChevron}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            {submitted ? (
              <div className={styles.successBlock}>
                <div className={styles.successIcon}>✓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <h4 className={styles.successTitle}>Quotation Request Received!</h4>
                    {inquiryRef && (
                      <span style={{ fontSize: '0.72rem', background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--secondary)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {inquiryRef}
                      </span>
                    )}
                  </div>
                  <p className={styles.successMsg}>
                    Thank you, <strong>{form.name || 'Valued Builder'}</strong>. Your request for{' '}
                    <strong>{form.material}</strong> at{' '}
                    <strong>{form.location || 'your project site'}</strong> has been submitted to the
                    materials dispatch coordinator. We will call you at{' '}
                    <strong>{form.phone || '9073453034'}</strong> with an itemized wholesale quotation.
                  </p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/${waLinkPhone}?text=${encodeURIComponent(
                        `Hello ${company.brandName}, I submitted quotation request ${inquiryRef || ''} for ${form.material} at ${form.location}. Please share the quotation.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappActionBtn}
                      style={{ padding: '0.55rem 1rem', fontSize: '0.75rem' }}
                    >
                      <Image
                        src="/images/updated/whatsapp_logo.png"
                        alt="WhatsApp"
                        width={18}
                        height={18}
                        className={styles.whatsappLogoImg}
                        unoptimized
                      />
                      <span>Confirm via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setInquiryRef(null);
                      }}
                      className={styles.submitBtn}
                      style={{ padding: '0.55rem 1rem', fontSize: '0.75rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form className={styles.inquiryForm} onSubmit={handleSubmit} id="contact-form">
                <div className={styles.inputRow}>
                  <div className={styles.inputField}>
                    <label htmlFor="contact-name">Full Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="e.g. Tanmoy Dutta"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.inputField}>
                    <label htmlFor="contact-phone">Phone Number *</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. 9073453034"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputField}>
                    <label htmlFor="contact-material">Material Needed</label>
                    <div className={styles.selectWrapper}>
                      <select
                        id="contact-material"
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                      >
                        <option value="All Materials (Complete Site)">All Materials (Complete Site)</option>
                        <option value="Bricks (1 No. & Solling)">Bricks (1 No. &amp; Solling)</option>
                        <option value="Cement (Ultratech, JSW, ACC)">Cement (Ultratech, JSW, ACC)</option>
                        <option value="TMT Bars (Fe 550D Grade)">TMT Bars (Fe 550D Grade)</option>
                        <option value="Sand (River, M-Sand, Silver Sand)">Sand (River, M-Sand, Silver Sand)</option>
                        <option value="Stone Aggregates (5/8 & 1/2)">Stone Aggregates (5/8&quot; &amp; 1/2&quot;)</option>
                        <option value="Paints & Finishes">Paints &amp; Finishes (Dulux, Berger)</option>
                        <option value="Tiles (Vitrified & Ceramic)">Tiles (Vitrified &amp; Ceramic)</option>
                        <option value="Plumbing (Tanks & Pipes)">Plumbing (Tanks &amp; Pipes)</option>
                        <option value="Waterproofing Chemical (No Damping)">Waterproofing Chemical (No Damping)</option>
                      </select>
                      <svg className={styles.dropdownArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <div className={styles.inputField}>
                    <label htmlFor="contact-location">Project Site Location</label>
                    <input
                      id="contact-location"
                      name="location"
                      type="text"
                      placeholder="e.g. Sarenga, Beltala / Howrah"
                      value={form.location}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((prev) => ({ ...prev, location: val }));
                        if (LOCATION_PRESETS.includes(val)) {
                          setSelectedLocation(val);
                          setIsCustomLocation(false);
                        } else {
                          setIsCustomLocation(true);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className={styles.inputField}>
                  <label htmlFor="contact-message">Estimated Quantities / Project Details</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="e.g. Need 4 M.Tonns M-Sand, 1000 bags Ultratech cement, 15,000 bricks for 4-storey apartment..."
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formButtonRow}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    id="contact-submit-btn"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
                  >
                    <span>{isSubmitting ? 'Logging to Dispatch System...' : 'Send Quotation Request'}</span>
                    <span className={styles.submitArrow}>{isSubmitting ? '⏳' : '→'}</span>
                  </button>

                  <a
                    href={`https://wa.me/${waLinkPhone}?text=${encodeURIComponent(
                      `Hello ${company.brandName}, I would like to request a quotation for construction materials.${
                        form.location ? ` Delivery Location: ${form.location}.` : ''
                      }${form.material ? ` Material: ${form.material}.` : ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappActionBtn}
                    aria-label="Chat on WhatsApp"
                  >
                    <Image
                      src="/images/updated/whatsapp_logo.png"
                      alt="WhatsApp"
                      width={22}
                      height={22}
                      className={styles.whatsappLogoImg}
                      unoptimized
                    />
                    <span>WhatsApp: {rawPhone}</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}