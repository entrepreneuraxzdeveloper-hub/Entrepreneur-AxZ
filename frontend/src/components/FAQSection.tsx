'use client';

import { useState } from 'react';
import styles from './FAQSection.module.css';
import { useCompany } from '@/context/CompanyContext';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I request an official quotation from Entrepreneur AxZ?',
    answer:
      'Call our direct helpline at +91 9073453034 or connect with us on WhatsApp. Share your estimated material list or structural schedule, and our team will prepare a transparent, itemized quotation benchmarked against official wholesale market rates.',
  },
  {
    question: 'What are your payment terms and milestones?',
    answer:
      'As outlined in our official quotations, our standard payment terms are: 30% advance upon confirmation, 40% during work progress and material dispatch, and 30% upon final delivery and project completion.',
  },
  {
    question: 'Are your cement and TMT steel batches verified and certified?',
    answer:
      'Yes. All cement bags (Ultratech, JSW, ACC) are factory-fresh and moisture-sealed. Our TMT steel rebar rods are certified Fe 550D high ductility grade from renowned brands such as Tata Tiscon, Shyam Steel, and Skysail, adhering to strict IS standards.',
  },
  {
    question: 'What sand and stone aggregate varieties do you supply?',
    answer:
      'We supply high-density River Sand and Manufactured Sand (M-Sand) for RCC casting (₹9,700 / 4 M.Tonns), washed Silver Sand for interior and exterior plastering (₹2,900 / 100 Sq.Ft), 5/8" angular ballast crushed stone (₹7,600 / 4 M.Tonns), and 1/2" blue stone gravel.',
  },
  {
    question: 'Which delivery locations and site scales do you support?',
    answer:
      'Based in Sankrailjala, Howrah, we provide reliable fleet dispatch across Howrah, Sarenga, Beltala, Kolkata, and adjacent residential and industrial development belts for apartment complexes, commercial sites, and private homes.',
  },
];

export default function FAQSection() {
  const { company, rawPhone } = useCompany();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left Column: Heading, Copy, Button */}
          <div className={styles.leftCol}>
            <div className={styles.eyebrow}>
              <span className={styles.redDot} />
              <span className={styles.eyebrowText}>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className={styles.heading}>Building questions, answered.</h2>
            <p className={styles.subtext}>
              A Brand by {company.parentCompany}. Have specific project requirements or custom batch inquiries?
              Speak with our material specialists directly.
            </p>
            <a href={`tel:${rawPhone}`} className={styles.advisorBtn} id="faq-advisor-btn">
              <span className={styles.btnDot} />
              <span>CALL SPECIALIST: {rawPhone}</span>
            </a>
          </div>

          {/* Right Column: Accordion */}
          <div className={styles.rightCol}>
            <div className={styles.accordionList}>
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className={styles.accordionItem}>
                    <button
                      type="button"
                      className={styles.questionBtn}
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.questionText}>{faq.question}</span>
                      <span className={`${styles.iconWrap} ${isOpen ? styles.iconOpen : ''}`}>
                        <svg
                          className={styles.plusIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className={styles.answerWrap}>
                        <p className={styles.answerText}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}