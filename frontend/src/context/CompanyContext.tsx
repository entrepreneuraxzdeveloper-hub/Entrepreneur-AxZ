'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export interface CompanyDetails {
  facilityName: string;
  operatingSchedule: string;
  hotline: string;
  hotlineSubtitle: string;
  coverageRegion: string;
  materialsGuarantee: string;
  email: string;
  director: string;
  brandName: string;
  parentCompany: string;
  updatedAt?: string;
}

export const DEFAULT_COMPANY: CompanyDetails = {
  facilityName: 'Sankrailjala Materials Depot, Howrah, West Bengal',
  operatingSchedule: 'Mon – Sat: 8:00 AM – 7:00 PM (Sunday: On-site prior booking dispatch)',
  hotline: '+91 9073453034',
  hotlineSubtitle: 'Instant Quotes & Site Dispatch',
  coverageRegion: 'Howrah, Kolkata, Sarenga, Beltala & Greater Bengal Sites',
  materialsGuarantee: '100% Genuine Ultratech, Tata Tiscon, Red Clay Bricks & M-Sand',
  email: 'royenterprise.contact@gmail.com',
  director: 'Rahul Roy Chowdhury',
  brandName: 'Entrepreneur AxZ',
  parentCompany: 'Roychowdhury and Sons',
};

export function extractRawPhone(phoneStr: string): string {
  if (!phoneStr) return '9073453034';
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits || '9073453034';
}

interface CompanyContextType {
  company: CompanyDetails;
  rawPhone: string;
  formattedPhone: string;
  waLinkPhone: string;
  loading: boolean;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType>({
  company: DEFAULT_COMPANY,
  rawPhone: '9073453034',
  formattedPhone: '+91 9073453034',
  waLinkPhone: '919073453034',
  loading: false,
  refreshCompany: async () => {},
});

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<CompanyDetails>(DEFAULT_COMPANY);
  const [loading, setLoading] = useState(true);

  const fetchCompanyDetails = async () => {
    try {
      const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const targetUrl = isRemote ? '/api/company' : `${BACKEND_URL}/api/company`;
      const res = await fetch(targetUrl, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCompany({
            ...DEFAULT_COMPANY,
            ...json.data,
          });
        }
      }
    } catch {
      // Backend not running or offline: keep defaults seamlessly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    // Poll every 15s so any admin edits are reflected live without page reload
    const timer = setInterval(fetchCompanyDetails, 15000);
    return () => clearInterval(timer);
  }, []);

  const rawPhone = useMemo(() => extractRawPhone(company.hotline), [company.hotline]);
  const formattedPhone = useMemo(() => {
    if (company.hotline.startsWith('+')) return company.hotline;
    return `+91 ${rawPhone}`;
  }, [company.hotline, rawPhone]);
  const waLinkPhone = useMemo(() => `91${rawPhone}`, [rawPhone]);

  return (
    <CompanyContext.Provider
      value={{
        company,
        rawPhone,
        formattedPhone,
        waLinkPhone,
        loading,
        refreshCompany: fetchCompanyDetails,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}

