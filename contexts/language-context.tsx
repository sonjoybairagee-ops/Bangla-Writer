'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.contentPlanner': 'Content Planner',
    'nav.aiWriter': 'AI Writer',
    'nav.hookGenerator': 'Hook Generator',
    'nav.contentWriter': 'Content Writer',
    'nav.storyDirector': 'Story Director',
    'nav.creativeStudio': 'Creative Studio',
    'nav.scriptsLibrary': 'Scripts Library',
    'nav.brandBrain': 'Brand Brain',
    'nav.analytics': 'Analytics',
    'nav.billing': 'Usage & Billing',
    'nav.adminPanel': 'Admin Panel',
    
    // Dashboard
    'dashboard.welcome': 'Good Morning',
    'dashboard.subtitle': 'Ready to create amazing content?',
    'dashboard.newScript': 'New Script',
    'dashboard.newCampaign': 'New Campaign',
    'dashboard.generateHook': 'Generate Hook',
    'dashboard.usage': "Today's Usage",
    'dashboard.creditsLeft': 'Credits Left',
    'dashboard.wordsGenerated': 'Words Generated',
    'dashboard.campaigns': 'Campaigns Running',
    'dashboard.upcomingPosts': 'Upcoming Posts',
    'dashboard.brandScore': 'Brand Score',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    
    // Billing
    'billing.title': 'Choose Your Perfect Plan',
    'billing.subtitle': 'Simple & Transparent Pricing',
    'billing.monthly': 'Monthly',
    'billing.yearly': 'Yearly',
    'billing.save20': 'Save 20%',
    'billing.currentPlan': 'Currently Active',
    'billing.subscribe': 'Subscribe',
    'billing.free': 'Free',
    'billing.starter': 'Starter',
    'billing.pro': 'Pro',
    'billing.agency': 'Agency',
    'billing.perMonth': '/month',
    'billing.billedYearly': 'Billed yearly',
    
    // Admin
    'admin.users': 'Users',
    'admin.payments': 'Payments',
    'admin.analytics': 'Analytics',
    'admin.settings': 'Settings',
    'admin.assignPlan': 'Assign Plan',
  },
  bn: {
    // Navigation
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.contentPlanner': 'কন্টেন্ট প্ল্যানার',
    'nav.aiWriter': 'এআই রাইটার',
    'nav.hookGenerator': 'হুক জেনারেটর',
    'nav.contentWriter': 'কন্টেন্ট রাইটার',
    'nav.storyDirector': 'স্টোরি ডিরেক্টর',
    'nav.creativeStudio': 'ক্রিয়েটিভ স্টুডিও',
    'nav.scriptsLibrary': 'স্ক্রিপ্ট লাইব্রেরি',
    'nav.brandBrain': 'ব্র্যান্ড ব্রেইন',
    'nav.analytics': 'এনালিটিক্স',
    'nav.billing': 'ব্যবহার ও বিলিং',
    'nav.adminPanel': 'অ্যাডমিন প্যানেল',
    
    // Dashboard
    'dashboard.welcome': 'সুপ্রভাত',
    'dashboard.subtitle': 'দুর্দান্ত কন্টেন্ট তৈরি করতে প্রস্তুত?',
    'dashboard.newScript': 'নতুন স্ক্রিপ্ট',
    'dashboard.newCampaign': 'নতুন ক্যাম্পেইন',
    'dashboard.generateHook': 'হুক জেনারেট করুন',
    'dashboard.usage': 'আজকের ব্যবহার',
    'dashboard.creditsLeft': 'ক্রেডিট বাকি',
    'dashboard.wordsGenerated': 'শব্দ তৈরি হয়েছে',
    'dashboard.campaigns': 'চলমান ক্যাম্পেইন',
    'dashboard.upcomingPosts': 'আসন্ন পোস্ট',
    'dashboard.brandScore': 'ব্র্যান্ড স্কোর',
    
    // Common
    'common.search': 'খুঁজুন',
    'common.filter': 'ফিল্টার',
    'common.export': 'এক্সপোর্ট',
    'common.save': 'সংরক্ষণ করুন',
    'common.cancel': 'বাতিল করুন',
    'common.delete': 'মুছে ফেলুন',
    'common.edit': 'সম্পাদনা',
    'common.view': 'দেখুন',
    'common.loading': 'লোড হচ্ছে...',
    'common.success': 'সফল',
    'common.error': 'ত্রুটি',
    
    // Billing
    'billing.title': 'আপনার পারফেক্ট প্ল্যান বেছে নিন',
    'billing.subtitle': 'সহজ ও স্বচ্ছ মূল্য',
    'billing.monthly': 'মাসিক',
    'billing.yearly': 'বার্ষিক',
    'billing.save20': '২০% সাশ্রয়',
    'billing.currentPlan': 'বর্তমান সক্রিয়',
    'billing.subscribe': 'সাবস্ক্রাইব করুন',
    'billing.free': 'ফ্রি',
    'billing.starter': 'স্টার্টার',
    'billing.pro': 'প্রো',
    'billing.agency': 'এজেন্সি',
    'billing.perMonth': '/মাস',
    'billing.billedYearly': 'বার্ষিক বিল',
    
    // Admin
    'admin.users': 'ইউজারস',
    'admin.payments': 'পেমেন্টস',
    'admin.analytics': 'এনালিটিক্স',
    'admin.settings': 'সেটিংস',
    'admin.assignPlan': 'প্ল্যান দিন',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
