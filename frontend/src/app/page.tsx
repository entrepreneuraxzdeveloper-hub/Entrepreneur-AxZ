'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MarqueeStrip from '@/components/MarqueeStrip';
import WelcomeSection from '@/components/WelcomeSection';
import Properties from '@/components/Properties';
import DeliveryPartners from '@/components/DeliveryPartners';
import Listings from '@/components/Listings';
import StatsSection from '@/components/StatsSection';
import ProcessSection from '@/components/ProcessSection';
import Reviews from '@/components/Reviews';
import JournalSection from '@/components/JournalSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function Home() {
  useScrollReveal();

  return (
    <main>
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <WelcomeSection />
      <Properties />
      <DeliveryPartners />
      <Listings />
      <StatsSection />
      <ProcessSection />
      <Reviews />
      <JournalSection />
      <FAQSection />
      <CTASection />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
