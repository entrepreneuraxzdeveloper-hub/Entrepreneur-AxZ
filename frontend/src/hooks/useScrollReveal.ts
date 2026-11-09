'use client';

import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    // Select all text elements across the page (outside the hero, which uses instant CSS keyframes)
    const textSelectors = [
      'main section:not(#hero) h1',
      'main section:not(#hero) h2',
      'main section:not(#hero) h3',
      'main section:not(#hero) h4',
      'main section:not(#hero) p',
      'main section:not(#hero) blockquote',
      'main section:not(#hero) [class*="eyebrow"]',
      'main section:not(#hero) [class*="label"]',
      'main section:not(#hero) [class*="subtext"]',
      'main section:not(#hero) [class*="description"]',
      'main section:not(#hero) [class*="subtitle"]',
      'main section:not(#hero) [class*="statNumber"]',
      'main section:not(#hero) [class*="statLabel"]',
      'main section:not(#hero) [class*="cardTitle"]',
      'main section:not(#hero) [class*="faqQuestion"]',
      'main section:not(#hero) [class*="stepTitle"]',
      'footer h2',
      'footer h3',
      'footer p',
      'footer [class*="wordmark"]',
      '.reveal',
      '.reveal-left',
      '.reveal-right',
      '.reveal-scale'
    ].join(', ');

    const targets = Array.from(document.querySelectorAll<HTMLElement>(textSelectors));

    // Group elements by parent section or container to provide natural staggered entrance
    const parentGroups = new Map<HTMLElement, HTMLElement[]>();

    targets.forEach((el) => {
      // Don't override if already has a specific directional reveal class
      if (
        !el.classList.contains('reveal') &&
        !el.classList.contains('reveal-left') &&
        !el.classList.contains('reveal-right') &&
        !el.classList.contains('reveal-scale')
      ) {
        el.classList.add('text-reveal');
      }

      const parent = (el.closest('section, footer, [class*="card"], [class*="item"]') as HTMLElement) || el.parentElement;
      if (parent) {
        if (!parentGroups.has(parent)) {
          parentGroups.set(parent, []);
        }
        parentGroups.get(parent)!.push(el);
      }
    });

    // Stagger siblings in the same block for a polished editorial feel
    parentGroups.forEach((group) => {
      group.forEach((el, index) => {
        if (!el.style.transitionDelay && index > 0) {
          const delay = Math.min(index * 0.08, 0.4);
          el.style.transitionDelay = `${delay}s`;
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
