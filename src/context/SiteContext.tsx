import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  Product,
  ProductReview,
  Branch,
  SiteSettings,
  BrandingSettings,
  ThemeSettings,
  SectionHeaders,
  SocialLinks,
  AboutSettings,
  TechnicianSettings,
  FaqItem,
  TestimonialItem,
  TestimonialsSettings,
  AnalyticsSettings,
  AnalyticsSummary,
  FooterSettings,
  OrderInvoice,
  WarrantyRecord,
  PaymentSettings,
  PaymentMethodConfig,
  OrderTrackingStatus,
  TrackingLogItem,
  WarrantySettings,
  WarrantyPillarItem,
  WarrantyQuickChipItem,
  ConsultationRequest,
  ConsultationStatus,
  OwnerNotification,
  QrisValidationRecord,
} from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { BRANCHES as DEFAULT_BRANCHES } from '../data/branches';
import { DEFAULT_SETTINGS } from '../data/defaultSettings';
import { DEFAULT_WARRANTY_RECORDS } from '../data/warrantyData';
import { SAMPLE_ORDERS } from '../data/sampleOrders';
import { applyThemeToDom } from '../utils/theme';
import { testFirestoreConnection } from '../firebase/config';
import {
  initGoogleAnalytics,
  trackPageView,
  trackEvent,
  getStoredAnalytics,
  syncAnalyticsToFirestore,
} from '../utils/analytics';
import {
  AppUserProfile,
  loginWithGoogle as firebaseLoginWithGoogle,
  logoutUser as firebaseLogoutUser,
  onAuthChange,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  saveSettingsToFirestore,
  loadSettingsFromFirestore,
  saveProductsToFirestore,
  loadProductsFromFirestore,
  saveBranchesToFirestore,
  loadBranchesFromFirestore,
  subscribeToSettings,
  subscribeToProducts,
  subscribeToBranches,
  subscribeToConsultations,
  subscribeToOrders,
  saveConsultationToFirestore,
  updateConsultationStatusInFirestore,
  DEFAULT_CONSULTATIONS,
} from '../firebase/dbService';

const STORAGE_KEYS = {
  PRODUCTS: 'kevin88_products_live_v2',
  BRANCHES: 'kevin88_branches_live_v2',
  SETTINGS: 'kevin88_settings_live_v3',
  ADMIN_MODE: 'kevin88_admin_mode_enabled',
  WARRANTY: 'kevin88_warranty_records_v1',
};

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

export type CMSTabType =
  | 'theme'
  | 'branding'
  | 'products'
  | 'banner'
  | 'branches'
  | 'sections'
  | 'about'
  | 'technician'
  | 'faqs'
  | 'footer'
  | 'backup';

interface SiteContextType {
  products: Product[];
  branches: Branch[];
  settings: SiteSettings;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (val: boolean) => void;

  // Owner Authentication & Authorization
  isOwner: boolean;
  isOwnerAuthModalOpen: boolean;
  openOwnerAuthModal: () => void;
  closeOwnerAuthModal: () => void;
  verifyOwnerPin: (pin: string) => boolean;
  requestAdminMode: () => void;
  publishWebsite: () => Promise<void>;

  // Cloud Synchronization Status
  isCloudConnected: boolean;
  lastCloudSyncAt: string | null;

  // Firebase User & Auth
  currentUser: AppUserProfile | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // Product Operations
  addProduct: (product: Omit<Product, 'id'>) => Product;
  batchImportProducts: (incomingProducts: Omit<Product, 'id'>[], mode?: 'append' | 'replace') => number;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  quickUpdateStock: (id: string, deltaOrSet: number | 'set', value?: number) => void;
  quickToggleStock: (id: string) => void;
  quickUpdatePrice: (id: string, newPrice: number) => void;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Branch Operations
  addBranch: (branch: Omit<Branch, 'id'>) => Branch;
  updateBranch: (id: string, updates: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  // Settings Operations
  updateTheme: (themeData: Partial<ThemeSettings>) => void;
  updateBranding: (brandingData: Partial<BrandingSettings>) => void;
  updateAnnouncement: (text: string, enabled?: boolean, bgColor?: string, textColor?: string) => void;
  updateHero: (heroData: Partial<SiteSettings['hero']>) => void;
  updateSectionHeaders: (headersData: Partial<SectionHeaders>) => void;
  updateAbout: (aboutData: Partial<AboutSettings>) => void;
  updateTechnician: (technicianData: Partial<TechnicianSettings>) => void;
  addFaq: (faq: Omit<FaqItem, 'id'>) => void;
  updateFaq: (id: string, updates: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  updateTestimonials: (testiData: Partial<TestimonialsSettings>) => void;
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, updates: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;
  updateContacts: (contactsData: Partial<SiteSettings['contacts']>) => void;
  updateAnalytics: (analyticsData: Partial<AnalyticsSettings>) => void;
  analyticsSummary: AnalyticsSummary;
  refreshAnalytics: () => void;
  isAnalyticsModalOpen: boolean;
  openAnalyticsModal: () => void;
  closeAnalyticsModal: () => void;
  trackUserEvent: (eventName: string, params?: Record<string, any>) => void;
  trackUserPageView: (title: string, path: string) => void;
  updateFooter: (footerData: Partial<FooterSettings>) => void;
  updateSocialLinks: (socialData: Partial<SocialLinks>) => void;
  updateFullSettings: (newSettings: SiteSettings) => void;

  // Backup & Reset
  resetToDefault: () => void;
  exportBackup: () => void;
  importBackup: (jsonString: string) => { success: boolean; message: string };

  // Modals for Direct Editing
  editingProduct: Product | null;
  isProductModalOpen: boolean;
  openProductModal: (product?: Product | null) => void;
  closeProductModal: () => void;

  editingBranch: Branch | null;
  isBranchModalOpen: boolean;
  openBranchModal: (branch?: Branch | null) => void;
  closeBranchModal: () => void;

  isThemeModalOpen: boolean;
  openThemeModal: () => void;
  closeThemeModal: () => void;

  isBackgroundModalOpen: boolean;
  openBackgroundModal: () => void;
  closeBackgroundModal: () => void;

  isBrandingModalOpen: boolean;
  openBrandingModal: () => void;
  closeBrandingModal: () => void;

  isBannerModalOpen: boolean;
  openBannerModal: () => void;
  closeBannerModal: () => void;

  isHeroModalOpen: boolean;
  openHeroModal: () => void;
  closeHeroModal: () => void;

  isAboutModalOpen: boolean;
  openAboutModal: () => void;
  closeAboutModal: () => void;

  isTechnicianModalOpen: boolean;
  openTechnicianModal: () => void;
  closeTechnicianModal: () => void;

  editingFaq: FaqItem | null;
  isFaqModalOpen: boolean;
  openFaqModal: (faq?: FaqItem | null) => void;
  closeFaqModal: () => void;

  editingTestimonial: TestimonialItem | null;
  isTestimonialsModalOpen: boolean;
  openTestimonialsModal: (testi?: TestimonialItem | null) => void;
  closeTestimonialsModal: () => void;

  isFooterModalOpen: boolean;
  footerModalTab: 'profile' | 'socials' | 'categories' | 'services' | 'warranty';
  setFooterModalTab: (tab: 'profile' | 'socials' | 'categories' | 'services' | 'warranty') => void;
  openFooterModal: (tab?: 'profile' | 'socials' | 'categories' | 'services' | 'warranty') => void;
  closeFooterModal: () => void;

  isSectionHeadersModalOpen: boolean;
  openSectionHeadersModal: () => void;
  closeSectionHeadersModal: () => void;

  isCMSModalOpen: boolean;
  cmsActiveTab: CMSTabType;
  setCMSActiveTab: (tab: CMSTabType) => void;
  openCMSModal: (tab?: CMSTabType) => void;
  closeCMSModal: () => void;

  isShopeeModalOpen: boolean;
  openShopeeModal: () => void;
  closeShopeeModal: () => void;

  isPublishModalOpen: boolean;
  openPublishModal: () => void;
  closePublishModal: () => void;

  isCheckoutModalOpen: boolean;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;

  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  updatePaymentSettings: (data: Partial<PaymentSettings>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethodConfig>) => void;
  addPaymentMethod: (method: PaymentMethodConfig) => void;
  deletePaymentMethod: (id: string) => void;

  currentInvoice: OrderInvoice | null;
  isInvoiceModalOpen: boolean;
  openInvoiceModal: (invoice: OrderInvoice) => void;
  closeInvoiceModal: () => void;

  // Dedicated QRIS Dynamic Payment Modal
  isQrisPaymentModalOpen: boolean;
  qrisPaymentInvoice: OrderInvoice | null;
  openQrisPaymentModal: (invoice?: OrderInvoice | null) => void;
  closeQrisPaymentModal: () => void;

  orders: OrderInvoice[];
  addOrder: (invoice: OrderInvoice) => void;
  updateInvoicePaymentStatus: (invoiceNumber: string, status: OrderInvoice['paymentStatus']) => void;
  updateOrderTracking: (
    invoiceNumber: string,
    updates: Partial<OrderInvoice> & { newLog?: Omit<TrackingLogItem, 'id'> }
  ) => void;
  isOrdersModalOpen: boolean;
  openOrdersModal: () => void;
  closeOrdersModal: () => void;

  // Compare Products
  comparedProducts: Product[];
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  toggleCompareProduct: (product: Product) => void;
  removeCompareProduct: (productId: string) => void;
  clearCompareProducts: () => void;

  // Warranty Check & Management
  warrantyRecords: WarrantyRecord[];
  addWarrantyRecord: (record: WarrantyRecord) => void;
  lookupWarranty: (query: string) => WarrantyRecord[];
  isWarrantyModalOpen: boolean;
  warrantySearchQuery: string;
  openWarrantyModal: (initialQuery?: string) => void;
  closeWarrantyModal: () => void;
  updateWarrantySettings: (newSettings: Partial<WarrantySettings>) => void;
  isWarrantyEditModalOpen: boolean;
  openWarrantyEditModal: () => void;
  closeWarrantyEditModal: () => void;

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Store Overview Dashboard (Recharts)
  isStoreOverviewOpen: boolean;
  storeOverviewTab: 'overview' | 'qris_tracker' | 'consultations' | 'top_products' | 'notifications';
  openStoreOverviewOpen: (tab?: 'overview' | 'qris_tracker' | 'consultations' | 'top_products' | 'notifications') => void;
  closeStoreOverviewOpen: () => void;

  // Consultations from Firestore
  consultations: ConsultationRequest[];
  addConsultation: (consultation: ConsultationRequest) => Promise<void>;
  updateConsultationStatus: (id: string, status: ConsultationStatus, notes?: string) => Promise<void>;

  // Real-time Notification System for Owner
  ownerNotifications: OwnerNotification[];
  activeOwnerAlert: OwnerNotification | null;
  dismissOwnerAlert: () => void;
  triggerSimulationNotification: () => void;

  // QRIS Payment Validation Tracking
  updateQrisValidation: (
    invoiceNumber: string,
    validationUpdates: Partial<QrisValidationRecord>,
    markAsPaid?: boolean
  ) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Products state with localStorage sync
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Product) => {
            const def = DEFAULT_PRODUCTS.find((d) => d.id === p.id);
            return {
              ...p,
              rating: p.rating ?? def?.rating ?? 4.9,
              reviewCount: p.reviewCount ?? def?.reviewCount ?? (def?.reviews?.length || 32),
              soldCount: p.soldCount ?? def?.soldCount ?? 120,
              reviews: p.reviews && p.reviews.length > 0 ? p.reviews : (def?.reviews || []),
            };
          });
        }
      }
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return DEFAULT_PRODUCTS;
  });

  // 2. Branches state with localStorage sync
  const [branches, setBranches] = useState<Branch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANCHES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load branches from storage', e);
    }
    return DEFAULT_BRANCHES;
  });

  // 3. Settings state with localStorage sync
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            theme: { ...DEFAULT_SETTINGS.theme, ...(parsed.theme || {}) },
            branding: {
              ...DEFAULT_SETTINGS.branding,
              ...(parsed.branding || {}),
              brandName: (parsed.branding?.brandName || DEFAULT_SETTINGS.branding.brandName).replace(/[\r\n]+/g, ' ').trim(),
              brandHighlight: (parsed.branding?.brandHighlight || DEFAULT_SETTINGS.branding.brandHighlight).replace(/[\r\n]+/g, ' ').trim(),
            },
            announcement: { ...DEFAULT_SETTINGS.announcement, ...(parsed.announcement || {}) },
            hero: { ...DEFAULT_SETTINGS.hero, ...(parsed.hero || {}) },
            sectionHeaders: { ...DEFAULT_SETTINGS.sectionHeaders, ...(parsed.sectionHeaders || {}) },
            about: { ...DEFAULT_SETTINGS.about, ...(parsed.about || {}) },
            technician: { ...DEFAULT_SETTINGS.technician, ...(parsed.technician || {}) },
            faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : DEFAULT_SETTINGS.faqs,
            testimonials: {
              ...DEFAULT_SETTINGS.testimonials,
              ...(parsed.testimonials || {}),
              reviews:
                Array.isArray(parsed.testimonials?.reviews) && parsed.testimonials.reviews.length > 0
                  ? parsed.testimonials.reviews
                  : (DEFAULT_SETTINGS.testimonials?.reviews || []),
            },
            contacts: { ...DEFAULT_SETTINGS.contacts, ...(parsed.contacts || {}) },
            analytics: {
              ...DEFAULT_SETTINGS.analytics,
              ...(parsed.analytics || {}),
            },
            footer: {
              ...DEFAULT_SETTINGS.footer,
              ...(parsed.footer || {}),
              socialLinks: {
                ...(DEFAULT_SETTINGS.footer.socialLinks || {}),
                ...(parsed.footer?.socialLinks || {}),
              },
            },
            paymentSettings: {
              ...DEFAULT_SETTINGS.paymentSettings,
              ...(parsed.paymentSettings || {}),
              methods:
                Array.isArray(parsed.paymentSettings?.methods) && parsed.paymentSettings.methods.length > 0
                  ? parsed.paymentSettings.methods
                  : (DEFAULT_SETTINGS.paymentSettings?.methods || []),
            },
          };
        }
      }
    } catch (e) {
      console.error('Failed to load settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply theme dynamically to documentElement whenever settings.theme changes
  useEffect(() => {
    if (settings.theme) {
      applyThemeToDom(settings.theme);
    } else if (DEFAULT_SETTINGS.theme) {
      applyThemeToDom(DEFAULT_SETTINGS.theme);
    }
  }, [settings.theme]);

  // 4. Admin Mode state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('role') === 'customer' || params.get('mode') === 'customer') {
          return false;
        }
        if (
          params.get('admin') === 'true' ||
          params.get('owner') === 'true' ||
          params.get('mode') === 'admin' ||
          params.get('role') === 'owner'
        ) {
          return true;
        }
      }
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE);
      return saved !== null ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  // Owner Verification State
  const [isOwnerVerified, setIsOwnerVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kevin88_owner_verified') === 'true';
    } catch {
      return false;
    }
  });
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<AppUserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Evaluated: Is the current visitor the legitimate owner?
  const isOwner = Boolean(
    currentUser?.role === 'admin' ||
    currentUser?.email === 'kevindiocm@gmail.com' ||
    isOwnerVerified
  );

  // Cloud Synchronization Status (Firestore Live Sync)
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [lastCloudSyncAt, setLastCloudSyncAt] = useState<string | null>(null);

  const verifyOwnerPin = (pin: string): boolean => {
    const cleanPin = pin.trim().toLowerCase();
    // Valid master owner PINs
    if (cleanPin === '8888' || cleanPin === '88computer' || cleanPin === 'kevin88' || cleanPin === 'kevindiocm') {
      setIsOwnerVerified(true);
      try {
        localStorage.setItem('kevin88_owner_verified', 'true');
      } catch {}

      const ownerProfile: AppUserProfile = {
        uid: 'owner-kevin-88',
        email: 'kevindiocm@gmail.com',
        displayName: 'Kevin Diocm (Owner)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'admin',
      };
      setCurrentUser(ownerProfile);
      try {
        localStorage.setItem('kevin88_local_auth', JSON.stringify(ownerProfile));
      } catch {}

      setIsAdminMode(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'true');
      } catch {}
      setIsOwnerAuthModalOpen(false);
      showToast('Autentikasi Pemilik Berhasil! Mode Edit Toko diaktifkan.', 'success');
      return true;
    }
    return false;
  };

  const openOwnerAuthModal = () => setIsOwnerAuthModalOpen(true);
  const closeOwnerAuthModal = () => setIsOwnerAuthModalOpen(false);

  const requestAdminMode = () => {
    if (isOwner) {
      setIsAdminMode(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'true');
      } catch {}
      showToast('Mode Edit Toko Aktif (Owner)', 'info');
    } else {
      setIsOwnerAuthModalOpen(true);
    }
  };

  const handleSetAdminMode = (val: boolean) => {
    if (!val) {
      setIsAdminMode(false);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'false');
      } catch {}
    } else {
      if (isOwner) {
        setIsAdminMode(true);
        try {
          localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'true');
        } catch {}
      } else {
        setIsOwnerAuthModalOpen(true);
      }
    }
  };

  const handleToggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'false');
      } catch {}
      showToast('Beralih ke Tampilan Customer', 'info');
    } else {
      requestAdminMode();
    }
  };

  // Global Keyboard Shortcut: Ctrl+Shift+O or Cmd+Shift+O for Owner Mode Toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        if (isAdminMode) {
          setIsAdminMode(false);
          try {
            localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'false');
          } catch {}
          showToast('Beralih ke Tampilan Customer', 'info');
        } else {
          requestAdminMode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode, isOwner]);

  // Test Firestore Connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user?.role === 'admin' || user?.email === 'kevindiocm@gmail.com') {
        setIsOwnerVerified(true);
        try {
          localStorage.setItem('kevin88_owner_verified', 'true');
        } catch {}
      }
    });
    return () => unsubscribe();
  }, []);

  // ==========================================
  // Store Overview Dashboard & Consultations State
  // ==========================================
  const [isStoreOverviewOpen, setIsStoreOverviewOpen] = useState(false);
  const [storeOverviewTab, setStoreOverviewTab] = useState<'overview' | 'qris_tracker' | 'consultations' | 'top_products' | 'notifications'>('overview');
  const openStoreOverviewOpen = (tab: 'overview' | 'qris_tracker' | 'consultations' | 'top_products' | 'notifications' = 'overview') => {
    setStoreOverviewTab(tab);
    setIsStoreOverviewOpen(true);
  };
  const closeStoreOverviewOpen = () => setIsStoreOverviewOpen(false);

  // Consultations state (persisted in localStorage + real-time Firestore)
  const [consultations, setConsultations] = useState<ConsultationRequest[]>(() => {
    try {
      const saved = localStorage.getItem('kevin88_consultations_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_CONSULTATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kevin88_consultations_v1', JSON.stringify(consultations));
    } catch {}
  }, [consultations]);

  const addConsultation = async (c: ConsultationRequest) => {
    setConsultations((prev) => [c, ...prev.filter((item) => item.id !== c.id)]);
    await saveConsultationToFirestore(c);
  };

  const updateConsultationStatus = async (
    id: string,
    status: ConsultationStatus,
    notes?: string
  ) => {
    setConsultations((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          status,
          notes: notes !== undefined ? notes : c.notes,
          respondedAt:
            status === 'responded' || status === 'resolved'
              ? new Date().toISOString()
              : c.respondedAt,
        };
      })
    );
    await updateConsultationStatusInFirestore(id, status, notes);
  };

  // Orders State (persisted & synced with Firestore)
  const [orders, setOrders] = useState<OrderInvoice[]>(() => {
    try {
      const saved = localStorage.getItem('kevin88_orders_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const openOrdersModal = () => setIsOrdersModalOpen(true);
  const closeOrdersModal = () => setIsOrdersModalOpen(false);

  useEffect(() => {
    try {
      localStorage.setItem('kevin88_orders_v1', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Real-time Notification System for Owner
  const [ownerNotifications, setOwnerNotifications] = useState<OwnerNotification[]>(() => {
    try {
      const saved = localStorage.getItem('kevin88_owner_notifications_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      {
        id: 'init-notif-1',
        type: 'order',
        title: 'Pesanan Masuk #INV/KV88/20261021/4921',
        message: 'Budi Santoso memesan Baterai ThinkPad T480s (Rp 780.000)',
        amount: 780000,
        referenceId: 'INV/KV88/20261021/4921',
        customerName: 'Budi Santoso',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: 'init-notif-2',
        type: 'consultation',
        title: 'Permintaan Konsultasi Baru',
        message: 'Rian Hidayat menanyakan LCD Screen 144Hz untuk Asus ROG Zephyrus G14',
        referenceId: 'c-002',
        customerName: 'Rian Hidayat',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        read: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('kevin88_owner_notifications_v1', JSON.stringify(ownerNotifications));
    } catch {}
  }, [ownerNotifications]);

  const [activeOwnerAlert, setActiveOwnerAlert] = useState<OwnerNotification | null>(null);
  const dismissOwnerAlert = () => setActiveOwnerAlert(null);

  // Auto-dismiss active alert after 8 seconds
  useEffect(() => {
    if (activeOwnerAlert) {
      const timer = setTimeout(() => {
        setActiveOwnerAlert(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activeOwnerAlert]);

  // Audio Chime Synthesizer via Web Audio API (Zero external assets needed)
  const playNotificationChime = (type: 'order' | 'consultation' = 'order') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'order') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880.0, now + 0.1);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const triggerSimulationNotification = () => {
    const isSimOrder = Math.random() > 0.5;
    if (isSimOrder) {
      const randInv = `INV/KV88/${Date.now().toString().slice(-6)}`;
      const randNames = ['Ahmad Syarif', 'Denny Kusuma', 'Lestari Putri', 'Fajar Ramadhan'];
      const chosenName = randNames[Math.floor(Math.random() * randNames.length)];
      const simAlert: OwnerNotification = {
        id: `sim-${Date.now()}`,
        type: 'order',
        title: '🛒 Pesanan Baru Masuk!',
        message: `${chosenName} baru saja memesan sparepart (Nota #${randInv}).`,
        amount: 850000 + Math.floor(Math.random() * 8) * 150000,
        referenceId: randInv,
        customerName: chosenName,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setActiveOwnerAlert(simAlert);
      setOwnerNotifications((prev) => [simAlert, ...prev]);
      playNotificationChime('order');
      showToast('🔔 Notifikasi Pesanan Baru berhasil disimulasikan!', 'info');
    } else {
      const simAlert: OwnerNotification = {
        id: `sim-${Date.now()}`,
        type: 'consultation',
        title: '💬 Permintaan Konsultasi Baru!',
        message: 'Wahyu Pratama menanyakan kecocokan Baterai Lenovo Yoga Slim 7 Carbon.',
        referenceId: `c-${Date.now()}`,
        customerName: 'Wahyu Pratama',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setActiveOwnerAlert(simAlert);
      setOwnerNotifications((prev) => [simAlert, ...prev]);
      playNotificationChime('consultation');
      showToast('🔔 Notifikasi Konsultasi Baru berhasil disimulasikan!', 'info');
    }
  };

  // Tracking refs to distinguish initial historical load from live new additions
  const initialOrdersLoaded = useRef(false);
  const initialConsultationsLoaded = useRef(false);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const knownConsultationIds = useRef<Set<string>>(new Set());

  // 1. Initial Load & Real-Time Cloud Listeners (Keeps Owner and Customer views 100% in sync)
  useEffect(() => {
    let isMounted = true;

    // A. Real-time Settings Listener
    const unsubSettings = subscribeToSettings((cloudSettings) => {
      if (!isMounted || !cloudSettings) return;
      setIsCloudConnected(true);
      setLastCloudSyncAt(new Date().toLocaleTimeString('id-ID'));
      setSettings((prev) => {
        return {
          ...prev,
          ...cloudSettings,
          theme: {
            ...prev.theme,
            ...(cloudSettings.theme || {}),
            colorPreset: cloudSettings.theme?.colorPreset || prev.theme?.colorPreset || 'amber',
            primaryColor: cloudSettings.theme?.primaryColor || prev.theme?.primaryColor || '#f59e0b',
            primaryHoverColor: cloudSettings.theme?.primaryHoverColor || prev.theme?.primaryHoverColor || '#fbbf24',
            primaryTextColor: cloudSettings.theme?.primaryTextColor || prev.theme?.primaryTextColor || '#020617',
            backgroundMode: cloudSettings.theme?.backgroundMode || prev.theme?.backgroundMode || 'dark',
            fontFamily: cloudSettings.theme?.fontFamily || prev.theme?.fontFamily || 'sans',
            borderRadius: cloudSettings.theme?.borderRadius || prev.theme?.borderRadius || 'medium',
          },
          branding: { ...prev.branding, ...(cloudSettings.branding || {}) },
          announcement: { ...prev.announcement, ...(cloudSettings.announcement || {}) },
          hero: { ...prev.hero, ...(cloudSettings.hero || {}) },
          about: { ...prev.about, ...(cloudSettings.about || {}) },
          contacts: { ...prev.contacts, ...(cloudSettings.contacts || {}) },
          footer: { ...prev.footer, ...(cloudSettings.footer || {}) },
        } as SiteSettings;
      });
    });

    // B. Real-time Products Catalog Listener
    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (!isMounted || !cloudProducts || !Array.isArray(cloudProducts) || cloudProducts.length === 0) return;
      setIsCloudConnected(true);
      setLastCloudSyncAt(new Date().toLocaleTimeString('id-ID'));
      setProducts(cloudProducts);
    });

    // C. Real-time Branches Listener
    const unsubBranches = subscribeToBranches((cloudBranches) => {
      if (!isMounted || !cloudBranches || !Array.isArray(cloudBranches) || cloudBranches.length === 0) return;
      setIsCloudConnected(true);
      setLastCloudSyncAt(new Date().toLocaleTimeString('id-ID'));
      setBranches(cloudBranches);
    });

    // D. Real-time Orders Listener (with live alert triggering)
    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (!isMounted || !cloudOrders) return;
      setIsCloudConnected(true);
      setLastCloudSyncAt(new Date().toLocaleTimeString('id-ID'));

      if (!initialOrdersLoaded.current) {
        cloudOrders.forEach((o) => knownOrderIds.current.add(o.invoiceNumber || o.id || ''));
        initialOrdersLoaded.current = true;
        setOrders(cloudOrders);
        return;
      }

      // Check for incoming new orders
      const newOrders = cloudOrders.filter(
        (o) => !knownOrderIds.current.has(o.invoiceNumber || o.id || '')
      );
      if (newOrders.length > 0) {
        newOrders.forEach((o) => {
          knownOrderIds.current.add(o.invoiceNumber || o.id || '');
          const alert: OwnerNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'order',
            title: '🛒 Pesanan Baru Masuk!',
            message: `${o.customer?.name || 'Pelanggan'} memesan ${o.items?.length || 1} item sparepart.`,
            amount: o.total,
            referenceId: o.invoiceNumber,
            customerName: o.customer?.name,
            timestamp: new Date().toISOString(),
            read: false,
          };
          setActiveOwnerAlert(alert);
          setOwnerNotifications((prev) => [alert, ...prev]);
          playNotificationChime('order');
        });
      }
      setOrders(cloudOrders);
    });

    // E. Real-time Consultations Listener (with live alert triggering)
    const unsubConsultations = subscribeToConsultations((cloudConsultations) => {
      if (!isMounted || !cloudConsultations) return;
      setIsCloudConnected(true);
      setLastCloudSyncAt(new Date().toLocaleTimeString('id-ID'));

      if (!initialConsultationsLoaded.current) {
        cloudConsultations.forEach((c) => knownConsultationIds.current.add(c.id));
        initialConsultationsLoaded.current = true;
        setConsultations(cloudConsultations);
        return;
      }

      // Check for incoming new consultations
      const newConsultations = cloudConsultations.filter(
        (c) => !knownConsultationIds.current.has(c.id)
      );
      if (newConsultations.length > 0) {
        newConsultations.forEach((c) => {
          knownConsultationIds.current.add(c.id);
          const alert: OwnerNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'consultation',
            title: '💬 Permintaan Konsultasi Baru!',
            message: `${c.name || 'Pelanggan'} menanyakan ${c.sparepartType} untuk ${c.brand} ${c.laptopModel}.`,
            referenceId: c.id,
            customerName: c.name,
            timestamp: new Date().toISOString(),
            read: false,
          };
          setActiveOwnerAlert(alert);
          setOwnerNotifications((prev) => [alert, ...prev]);
          playNotificationChime('consultation');
        });
      }
      setConsultations(cloudConsultations);
    });

    // Initial fetch fallback for instant boot
    loadSettingsFromFirestore().then((cloudSettings) => {
      if (cloudSettings && isMounted) {
        setIsCloudConnected(true);
        setSettings((prev) => ({
          ...prev,
          ...cloudSettings,
          theme: {
            ...prev.theme,
            ...(cloudSettings.theme || {}),
            colorPreset: cloudSettings.theme?.colorPreset || prev.theme?.colorPreset || 'amber',
          },
          branding: { ...prev.branding, ...(cloudSettings.branding || {}) },
        } as SiteSettings));
      }
    });

    loadProductsFromFirestore().then((cloudProducts) => {
      if (cloudProducts && Array.isArray(cloudProducts) && cloudProducts.length > 0 && isMounted) {
        setProducts(cloudProducts);
      }
    });

    loadBranchesFromFirestore().then((cloudBranches) => {
      if (cloudBranches && Array.isArray(cloudBranches) && cloudBranches.length > 0 && isMounted) {
        setBranches(cloudBranches);
      }
    });

    return () => {
      isMounted = false;
      unsubSettings();
      unsubProducts();
      unsubBranches();
      unsubOrders();
      unsubConsultations();
    };
  }, []);

  // Initialize Google Analytics (GA4) dynamically whenever measurementId changes
  useEffect(() => {
    if (settings.analytics?.enabled && settings.analytics?.measurementId) {
      initGoogleAnalytics(settings.analytics);
    }
  }, [settings.analytics]);

  // Track initial page view & observe sections for automatic analytics logging
  useEffect(() => {
    trackPageView('Beranda & Hero', '/', settings.analytics?.measurementId);

    const sectionMap = [
      { id: 'tentang-kami', title: 'Tentang Kami', path: '/#tentang-kami' },
      { id: 'katalog', title: 'Katalog Produk Sparepart', path: '/#katalog' },
      { id: 'cabang', title: 'Cabang Toko & Google Maps', path: '/#cabang' },
      { id: 'faq', title: 'FAQ & Garansi', path: '/#faq' },
      { id: 'testimoni', title: 'Testimoni Pelanggan', path: '/#testimoni' },
    ];

    const observed = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const match = sectionMap.find((s) => s.id === entry.target.id);
            if (match && !observed.has(match.id)) {
              observed.add(match.id);
              trackPageView(match.title, match.path, settings.analytics?.measurementId);
              setAnalyticsSummary(getStoredAnalytics());
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionMap.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [settings.analytics?.measurementId]);

  const loginWithGoogle = async () => {
    try {
      const profile = await firebaseLoginWithGoogle();
      setCurrentUser(profile);
      showToast(`Selamat datang, ${profile.displayName || profile.email}!`, 'success');
      if (profile.role === 'admin') {
        setIsAdminMode(true);
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      showToast(err?.message || 'Gagal login dengan Google', 'error');
    }
  };

  const logout = async () => {
    try {
      await firebaseLogoutUser();
      setCurrentUser(null);
      setIsOwnerVerified(false);
      setIsAdminMode(false);
      try {
        localStorage.removeItem('kevin88_owner_verified');
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'false');
      } catch {}
      showToast('Berhasil keluar dari akun.', 'info');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const openBackgroundModal = () => setIsBackgroundModalOpen(true);
  const closeBackgroundModal = () => setIsBackgroundModalOpen(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [footerModalTab, setFooterModalTab] = useState<'profile' | 'socials' | 'categories' | 'services' | 'warranty'>('profile');
  const [isSectionHeadersModalOpen, setIsSectionHeadersModalOpen] = useState(false);

  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isTestimonialsModalOpen, setIsTestimonialsModalOpen] = useState(false);
  const openTestimonialsModal = (testi: TestimonialItem | null = null) => {
    setEditingTestimonial(testi || null);
    setIsTestimonialsModalOpen(true);
  };
  const closeTestimonialsModal = () => {
    setIsTestimonialsModalOpen(false);
    setEditingTestimonial(null);
  };

  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const openAnalyticsModal = () => setIsAnalyticsModalOpen(true);
  const closeAnalyticsModal = () => setIsAnalyticsModalOpen(false);

  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>(() => getStoredAnalytics());

  const refreshAnalytics = () => {
    setAnalyticsSummary(getStoredAnalytics());
  };

  const [isCMSModalOpen, setIsCMSModalOpen] = useState(false);
  const [cmsActiveTab, setCMSActiveTab] = useState<CMSTabType>('theme');

  const [isShopeeModalOpen, setIsShopeeModalOpen] = useState(false);
  const openShopeeModal = () => setIsShopeeModalOpen(true);
  const closeShopeeModal = () => setIsShopeeModalOpen(false);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const openPublishModal = () => setIsPublishModalOpen(true);
  const closePublishModal = () => setIsPublishModalOpen(false);

  const publishWebsite = async (): Promise<void> => {
    try {
      showToast('Menyimpan seluruh perubahan dan mempublikasikan website...', 'info');

      // 1. Sync settings, products & branches to Cloud Firestore
      await Promise.allSettled([
        saveSettingsToFirestore(settings),
        saveProductsToFirestore(products),
        saveBranchesToFirestore(branches),
      ]);

      // 2. Persist latest edited state to LocalStorage
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'false');
        localStorage.setItem('kevin88_published_at', new Date().toISOString());
      } catch (storageErr) {
        console.warn('LocalStorage save error:', storageErr);
      }

      // 3. Immediately switch to Customer Mode with the newly edited view
      setIsAdminMode(false);
      setIsPublishModalOpen(false);

      showToast(
        '🎉 Website Berhasil Dipublikasikan! Toko Anda kini tampil dalam Mode Customer dengan seluruh hasil editan terbaru Anda.',
        'success'
      );
    } catch (err) {
      console.error('Error publishing website to cloud:', err);
      // Fallback local publish
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, 'false');
        localStorage.setItem('kevin88_published_at', new Date().toISOString());
      } catch {}
      setIsAdminMode(false);
      setIsPublishModalOpen(false);
      showToast(
        'Website berhasil dipublikasikan dan beralih ke Mode Customer!',
        'success'
      );
    }
  };

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const openCheckoutModal = () => setIsCheckoutModalOpen(true);
  const closeCheckoutModal = () => setIsCheckoutModalOpen(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const [currentInvoice, setCurrentInvoice] = useState<OrderInvoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Dedicated QRIS Dynamic Payment Modal state
  const [qrisPaymentInvoice, setQrisPaymentInvoice] = useState<OrderInvoice | null>(null);
  const [isQrisPaymentModalOpen, setIsQrisPaymentModalOpen] = useState(false);

  const openQrisPaymentModal = (invoice?: OrderInvoice | null) => {
    if (invoice) {
      setQrisPaymentInvoice(invoice);
    } else if (currentInvoice) {
      setQrisPaymentInvoice(currentInvoice);
    }
    setIsQrisPaymentModalOpen(true);
  };

  const closeQrisPaymentModal = () => {
    setIsQrisPaymentModalOpen(false);
  };

  // Compare Products state
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const openCompareModal = () => {
    if (comparedProducts.length === 0) {
      showToast('Pilih minimal 1 produk di katalog untuk dibandingkan.', 'info');
      return;
    }
    setIsCompareModalOpen(true);
    trackUserEvent('compare_products', {
      count: comparedProducts.length,
      productNames: comparedProducts.map((p) => p.name).join(', '),
    });
  };

  const closeCompareModal = () => setIsCompareModalOpen(false);

  const toggleCompareProduct = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Produk "${product.name}" dihapus dari daftar perbandingan.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast('Maksimal 3 produk untuk dibandingkan sekaligus. Hapus salah satu produk terlebih dahulu.', 'error');
        return prev;
      }
      showToast(`Produk "${product.name}" ditambahkan ke perbandingan (${prev.length + 1}/3).`, 'success');
      return [...prev, product];
    });
  };

  const removeCompareProduct = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompareProducts = () => {
    setComparedProducts([]);
    showToast('Daftar perbandingan produk telah dibersihkan.', 'info');
  };

  // 10. Warranty Records & Lookup
  const [warrantyRecords, setWarrantyRecords] = useState<WarrantyRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WARRANTY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load warranty records', e);
    }
    return DEFAULT_WARRANTY_RECORDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WARRANTY, JSON.stringify(warrantyRecords));
    } catch (e) {
      console.error('Failed to save warranty records', e);
    }
  }, [warrantyRecords]);

  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
  const [warrantySearchQuery, setWarrantySearchQuery] = useState('');

  const openWarrantyModal = (initialQuery?: string) => {
    if (initialQuery !== undefined) {
      setWarrantySearchQuery(initialQuery);
    }
    setIsWarrantyModalOpen(true);
    trackUserEvent('open_warranty_check', { query: initialQuery || '' });
  };

  const closeWarrantyModal = () => setIsWarrantyModalOpen(false);

  const [isWarrantyEditModalOpen, setIsWarrantyEditModalOpen] = useState(false);
  const openWarrantyEditModal = () => setIsWarrantyEditModalOpen(true);
  const closeWarrantyEditModal = () => setIsWarrantyEditModalOpen(false);

  const updateWarrantySettings = (newSettings: Partial<WarrantySettings>) => {
    setSettings((prev) => {
      const current = prev.warrantySettings || DEFAULT_SETTINGS.warrantySettings;
      const updatedWarranty: WarrantySettings = {
        title: newSettings.title ?? current?.title ?? 'KETENTUAN GARANSI KEVIN 88 COMPUTER',
        subtitle: newSettings.subtitle ?? current?.subtitle,
        helpPhone: newSettings.helpPhone ?? current?.helpPhone ?? '0895-3920-19488',
        helpWhatsApp: newSettings.helpWhatsApp ?? current?.helpWhatsApp ?? '62895392019488',
        pillars: newSettings.pillars ?? current?.pillars ?? [],
        quickChips: newSettings.quickChips ?? current?.quickChips ?? [],
      };
      const updated = {
        ...prev,
        warrantySettings: updatedWarranty,
      };
      saveSettingsToFirestore(updated);
      return updated;
    });
    showToast('Ketentuan garansi & contoh cek cepat berhasil diperbarui!', 'success');
  };

  const addWarrantyRecord = (record: WarrantyRecord) => {
    setWarrantyRecords((prev) => [record, ...prev]);
    showToast('Data garansi baru berhasil didaftarkan!', 'success');
  };

  const lookupWarranty = (rawQuery: string): WarrantyRecord[] => {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return [];

    // 1. Direct match in warrantyRecords (by Serial Number or Invoice Number or phone or part)
    const directMatches = warrantyRecords.filter((rec) => {
      const matchSN = rec.serialNumber?.toLowerCase().includes(query);
      const matchInv = rec.invoiceNumber?.toLowerCase().includes(query);
      const matchPhone = rec.customerPhone ? rec.customerPhone.includes(query) : false;
      const matchPart = rec.partNumber ? rec.partNumber.toLowerCase().includes(query) : false;
      return matchSN || matchInv || matchPhone || matchPart;
    });

    if (directMatches.length > 0) {
      return directMatches;
    }

    // 2. Synthesize from orders placed in system (if user searches for their invoice number)
    const matchingOrders = orders.filter((o) => {
      return (
        o.invoiceNumber.toLowerCase().includes(query) ||
        (o.customer?.phone && o.customer.phone.includes(query))
      );
    });

    if (matchingOrders.length > 0) {
      const synthesized: WarrantyRecord[] = [];
      matchingOrders.forEach((ord) => {
        (ord.items || []).forEach((item, idx) => {
          synthesized.push({
            id: `war-ord-${ord.invoiceNumber}-${idx}`,
            serialNumber: `KV88-${item.product.partNumber || 'PART'}-${ord.invoiceNumber.slice(-4)}`,
            invoiceNumber: ord.invoiceNumber,
            customerName: ord.customer?.name || 'Pelanggan',
            customerPhone: ord.customer?.phone || '',
            productName: item.product.name,
            partNumber: item.product.partNumber || '-',
            brand: item.product.brand || 'Universal',
            category: item.product.category,
            purchaseDate: ord.createdAt ? ord.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
            warrantyMonths: item.product.warrantyMonths || 3,
            branchName: ord.customer?.pickupBranchId ? 'Cabang Toko Kevin 88' : 'Pusat Kevin 88 (Pengiriman Online)',
            notes: `Otomatis terdaftar dari Nota #${ord.invoiceNumber}. Status pembayaran: ${ord.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}`,
          });
        });
      });
      return synthesized;
    }

    return [];
  };

  const addOrder = (invoice: OrderInvoice) => {
    const isPickup = invoice.shippingMethod === 'pickup';
    const enrichedInvoice: OrderInvoice = {
      ...invoice,
      userId: currentUser ? currentUser.uid : invoice.userId,
      trackingStatus: invoice.trackingStatus || 'pending',
      courierName:
        invoice.courierName ||
        (isPickup
          ? 'Ambil Langsung di Toko Cabang'
          : invoice.shippingMethod === 'express'
          ? 'JNE YES (Yakin Esok Sampai) Berasuransi'
          : 'JNE / J&T Reguler Terlindungi Asuransi'),
      trackingNumber:
        invoice.trackingNumber ||
        (isPickup
          ? `PICKUP-${invoice.invoiceNumber.slice(-4)}`
          : `JNE-${Date.now().toString().slice(-8)}`),
      technicianName:
        invoice.technicianName || 'Tim QC Hardware & Teknisi Lab Kevin 88',
      estimatedDelivery:
        invoice.estimatedDelivery ||
        (isPickup ? 'Siap diambil saat jam operasional toko' : '1-2 Hari Kerja'),
      trackingHistory:
        invoice.trackingHistory && invoice.trackingHistory.length > 0
          ? invoice.trackingHistory
          : [
              {
                id: `track-${Date.now()}-1`,
                status: 'pending',
                title: 'Pesanan Diterima & Tercatat di Sistem',
                description: 'Invoice pesanan suku cadang berhasil dibuat melalui website resmi Kevin 88.',
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                location: 'Sistem Toko Pusat',
                completed: true,
              },
            ],
    };

    setOrders((prev) => {
      const filtered = prev.filter((o) => o.invoiceNumber !== enrichedInvoice.invoiceNumber);
      return [enrichedInvoice, ...filtered];
    });
    saveOrderToFirestore(enrichedInvoice);
  };

  const updateInvoicePaymentStatus = (invoiceNumber: string, status: OrderInvoice['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.invoiceNumber !== invoiceNumber) return ord;
        const updated = { ...ord, paymentStatus: status };
        if (status === 'paid' && ord.trackingStatus === 'pending') {
          updated.trackingStatus = 'confirmed';
          const newStep: TrackingLogItem = {
            id: `track-${Date.now()}`,
            status: 'confirmed',
            title: 'Pembayaran Dikonfirmasi & Lunas',
            description: `Pembayaran ${ord.paymentMethod.toUpperCase()} sebesar Rp ${ord.total.toLocaleString(
              'id-ID'
            )} telah diverifikasi. Order diteruskan ke teknisi QC.`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            location: 'Finance & Kasir Kevin 88',
            completed: true,
          };
          updated.trackingHistory = [...(updated.trackingHistory || []), newStep];
        }
        return updated;
      })
    );
    if (currentInvoice && currentInvoice.invoiceNumber === invoiceNumber) {
      setCurrentInvoice((prev) => (prev ? { ...prev, paymentStatus: status } : null));
    }
  };

  const updateQrisValidation = (
    invoiceNumber: string,
    validationUpdates: Partial<QrisValidationRecord>,
    markAsPaid?: boolean
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.invoiceNumber !== invoiceNumber) return ord;
        const currentVal = ord.qrisValidation || {
          uploadedAt: new Date().toISOString(),
          verificationStatus: 'pending_review' as const,
        };
        const updatedVal: QrisValidationRecord = {
          ...currentVal,
          ...validationUpdates,
        };

        const updatedOrder: OrderInvoice = {
          ...ord,
          qrisValidation: updatedVal,
        };

        if (markAsPaid) {
          updatedOrder.paymentStatus = 'paid';
          if (ord.trackingStatus === 'pending') {
            updatedOrder.trackingStatus = 'confirmed';
            const logItem: TrackingLogItem = {
              id: `track-${Date.now()}`,
              status: 'confirmed',
              title: 'Pembayaran QRIS Diverifikasi Lunas oleh Owner',
              description: `Bukti transfer QRIS sebesar Rp ${ord.total.toLocaleString(
                'id-ID'
              )} telah diverifikasi dan divalidasi oleh Owner Toko.`,
              timestamp: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              location: 'Finance & Kasir Kevin 88',
              completed: true,
            };
            updatedOrder.trackingHistory = [...(ord.trackingHistory || []), logItem];
          }
        } else if (validationUpdates.verificationStatus === 'rejected') {
          updatedOrder.paymentStatus = 'unpaid';
        }

        // Real-time Firestore sync
        saveOrderToFirestore(updatedOrder);

        return updatedOrder;
      })
    );

    if (currentInvoice && currentInvoice.invoiceNumber === invoiceNumber) {
      setCurrentInvoice((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          paymentStatus: markAsPaid ? 'paid' : prev.paymentStatus,
          qrisValidation: {
            ...(prev.qrisValidation || {
              uploadedAt: new Date().toISOString(),
              verificationStatus: 'pending_review',
            }),
            ...validationUpdates,
          },
        };
      });
    }

    if (markAsPaid) {
      showToast(`Pembayaran #${invoiceNumber} berhasil diverifikasi LUNAS!`, 'success');
    } else if (validationUpdates.verificationStatus === 'rejected') {
      showToast(`Bukti pembayaran #${invoiceNumber} ditandai tidak sesuai.`, 'info');
    } else {
      showToast(`Validasi pembayaran #${invoiceNumber} diperbarui.`, 'success');
    }
  };

  const updateOrderTracking = (
    invoiceNumber: string,
    updates: Partial<OrderInvoice> & { newLog?: Omit<TrackingLogItem, 'id'> }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.invoiceNumber !== invoiceNumber) return ord;
        const { newLog, ...directUpdates } = updates;
        const updated: OrderInvoice = {
          ...ord,
          ...directUpdates,
        };

        if (newLog) {
          const logItem: TrackingLogItem = {
            ...newLog,
            id: `track-${Date.now()}`,
          };
          updated.trackingHistory = [...(updated.trackingHistory || []), logItem];
        }

        return updated;
      })
    );

    if (currentInvoice && currentInvoice.invoiceNumber === invoiceNumber) {
      setCurrentInvoice((prev) => {
        if (!prev) return null;
        const { newLog, ...directUpdates } = updates;
        const updated = { ...prev, ...directUpdates };
        if (newLog) {
          updated.trackingHistory = [
            ...(updated.trackingHistory || []),
            { ...newLog, id: `track-${Date.now()}` },
          ];
        }
        return updated;
      });
    }

    showToast('Status pelacakan pesanan berhasil diperbarui!', 'success');
  };

  const openInvoiceModal = (invoice: OrderInvoice) => {
    setCurrentInvoice(invoice);
    setIsInvoiceModalOpen(true);
    addOrder(invoice);
  };
  const closeInvoiceModal = () => setIsInvoiceModalOpen(false);

  // Sync products to localStorage & Cloud Firestore (connects owner changes directly to customers)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
    if (isAdminMode || isOwner) {
      saveProductsToFirestore(products);
    }
  }, [products, isAdminMode, isOwner]);

  // Sync branches to localStorage & Cloud Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
    } catch (e) {
      console.error('Failed to save branches to localStorage', e);
    }
    if (isAdminMode || isOwner) {
      saveBranchesToFirestore(branches);
    }
  }, [branches, isAdminMode, isOwner]);

  // Sync settings to localStorage & Cloud Firestore with light debounce
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
    if (isAdminMode || isOwner) {
      const timer = setTimeout(() => {
        saveSettingsToFirestore(settings);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [settings, isAdminMode, isOwner]);

  // Sync admin mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, String(isAdminMode));
    } catch (e) {
      console.error('Failed to save admin mode to localStorage', e);
    }
  }, [isAdminMode]);

  // Product Methods
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newProduct: Product = { ...productData, id };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produk "${newProduct.name}" berhasil ditambahkan!`);
    return newProduct;
  };

  const batchImportProducts = (
    incomingProducts: Omit<Product, 'id'>[],
    mode: 'append' | 'replace' = 'append'
  ): number => {
    const timestamp = Date.now();
    const formatted: Product[] = incomingProducts.map((p, index) => ({
      ...p,
      id: `prod_shopee_${timestamp}_${index + 1}`,
    }));

    if (mode === 'replace') {
      setProducts(formatted);
      showToast(
        `Katalog toko berhasil diganti dengan ${formatted.length} produk dari Shopee!`,
        'success'
      );
      return formatted.length;
    } else {
      let added = 0;
      let updated = 0;
      setProducts((prev) => {
        const combined = [...prev];
        for (const item of formatted) {
          const itemSku = item.partNumber?.toLowerCase().trim();
          const existingIdx = itemSku
            ? combined.findIndex((cp) => cp.partNumber?.toLowerCase().trim() === itemSku)
            : -1;
          if (existingIdx >= 0) {
            combined[existingIdx] = {
              ...combined[existingIdx],
              ...item,
              id: combined[existingIdx].id,
            };
            updated++;
          } else {
            combined.unshift(item);
            added++;
          }
        }
        return combined;
      });
      showToast(
        `Sukses import Shopee: ${incomingProducts.length} produk diproses (${added} produk baru, ${updated} produk terupdate)!`,
        'success'
      );
      return incomingProducts.length;
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast(`Perubahan produk berhasil disimpan!`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast(`Produk "${target?.name || id}" berhasil dihapus.`, 'info');
  };

  const quickUpdateStock = (id: string, deltaOrSet: number | 'set', value?: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let newStock = item.stock;
        if (deltaOrSet === 'set' && typeof value === 'number') {
          newStock = Math.max(0, value);
        } else if (typeof deltaOrSet === 'number') {
          newStock = Math.max(0, item.stock + deltaOrSet);
        }
        return { ...item, stock: newStock };
      })
    );
    showToast(`Stok produk berhasil diperbarui!`);
  };

  const quickToggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, stock: item.stock > 0 ? 0 : 15 };
      })
    );
    showToast(`Status ketersediaan stok produk diperbarui!`);
  };

  const quickUpdatePrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
    showToast(`Harga produk berhasil diperbarui!`);
  };

  const addProductReview = (
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date'>
  ) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const newReview: ProductReview = {
          ...reviewData,
          id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };
        const currentReviews = item.reviews || [];
        const updatedReviews = [newReview, ...currentReviews];
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));

        return {
          ...item,
          reviews: updatedReviews,
          rating: avgRating,
          reviewCount: updatedReviews.length,
        };
      })
    );
    showToast('Ulasan dan rating bintang berhasil dikirim! Terima kasih atas ulasan Anda.', 'success');
  };

  // Branch Methods
  const addBranch = (branchData: Omit<Branch, 'id'>): Branch => {
    const id = `branch-${Date.now()}`;
    const newBranch: Branch = { ...branchData, id };
    setBranches((prev) => [...prev, newBranch]);
    showToast(`Cabang "${newBranch.city}" berhasil ditambahkan!`);
    return newBranch;
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast(`Data cabang berhasil diperbarui!`);
  };

  const deleteBranch = (id: string) => {
    const target = branches.find((b) => b.id === id);
    setBranches((prev) => prev.filter((item) => item.id !== id));
    showToast(`Cabang "${target?.city || id}" telah dihapus.`, 'info');
  };

  // Settings Methods
  const updateTheme = (themeData: Partial<ThemeSettings>) => {
    setSettings((prev) => {
      const currentTheme = prev.theme || DEFAULT_SETTINGS.theme!;
      const newTheme = {
        ...currentTheme,
        ...themeData,
      };

      const updatedHero = { ...prev.hero };
      const updatedBranding = { ...prev.branding };
      const updatedAnnouncement = { ...prev.announcement };

      if (themeData.highlightColor) {
        updatedHero.highlightColor = themeData.highlightColor;
        updatedBranding.brandHighlightColor = themeData.highlightColor;
      }
      if (themeData.highlightSecondaryColor) {
        updatedHero.highlightSecondaryColor = themeData.highlightSecondaryColor;
      }
      if (themeData.highlightStyle) {
        updatedHero.highlightStyle = themeData.highlightStyle;
      }
      if (themeData.primaryColor) {
        updatedAnnouncement.bgColor = themeData.primaryColor;
      }
      if (themeData.primaryTextColor) {
        updatedAnnouncement.textColor = themeData.primaryTextColor;
      }
      if (themeData.brandNameColor) {
        updatedBranding.brandNameColor = themeData.brandNameColor;
      }
      if (themeData.navbarBgColor) {
        updatedBranding.navbarBgColor = themeData.navbarBgColor;
      }

      return {
        ...prev,
        theme: newTheme,
        hero: updatedHero,
        branding: updatedBranding,
        announcement: updatedAnnouncement,
      };
    });
    showToast('Tema & Palet Warna website berhasil diperbarui!');
  };

  const updateBranding = (brandingData: Partial<BrandingSettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev.branding,
        ...brandingData,
      };
      if (updated.brandName) {
        updated.brandName = updated.brandName.replace(/[\r\n]+/g, ' ').trim();
      }
      if (updated.brandHighlight) {
        updated.brandHighlight = updated.brandHighlight.replace(/[\r\n]+/g, ' ').trim();
      }
      return {
        ...prev,
        branding: updated,
      };
    });
    showToast('Logo & Branding website berhasil diperbarui!');
  };

  const updateAnnouncement = (text: string, enabled?: boolean, bgColor?: string, textColor?: string) => {
    setSettings((prev) => ({
      ...prev,
      announcement: {
        ...prev.announcement,
        text,
        enabled: enabled !== undefined ? enabled : prev.announcement.enabled,
        bgColor: bgColor || prev.announcement.bgColor,
        textColor: textColor || prev.announcement.textColor,
      },
    }));
    showToast('Teks pengumuman banner berhasil disimpan!');
  };

  const updateHero = (heroData: Partial<SiteSettings['hero']>) => {
    setSettings((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        ...heroData,
      },
    }));
    showToast('Teks banner utama (hero) berhasil diperbarui!');
  };

  const updateSectionHeaders = (headersData: Partial<SectionHeaders>) => {
    setSettings((prev) => ({
      ...prev,
      sectionHeaders: {
        ...(prev.sectionHeaders || DEFAULT_SETTINGS.sectionHeaders!),
        ...headersData,
      },
    }));
    showToast('Judul seksi website berhasil diperbarui!');
  };

  const updateAbout = (aboutData: Partial<AboutSettings>) => {
    setSettings((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...aboutData,
      },
    }));
    showToast('Informasi Tentang Kami berhasil diperbarui!');
  };

  const updateTechnician = (technicianData: Partial<TechnicianSettings>) => {
    setSettings((prev) => ({
      ...prev,
      technician: {
        ...prev.technician,
        ...technicianData,
      },
    }));
    showToast('Program Mitra Teknisi berhasil diperbarui!');
  };

  const addFaq = (faqData: Omit<FaqItem, 'id'>) => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      ...faqData,
    };
    setSettings((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }));
    showToast('Pertanyaan FAQ baru berhasil ditambahkan!');
  };

  const updateFaq = (id: string, updates: Partial<FaqItem>) => {
    setSettings((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
    showToast('Pertanyaan FAQ berhasil diubah!');
  };

  const deleteFaq = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
    showToast('Pertanyaan FAQ berhasil dihapus.', 'info');
  };

  const updateTestimonials = (testiData: Partial<TestimonialsSettings>) => {
    setSettings((prev) => ({
      ...prev,
      testimonials: {
        ...(prev.testimonials || DEFAULT_SETTINGS.testimonials!),
        ...testiData,
      },
    }));
    showToast('Pengaturan Testimoni Pelanggan berhasil disimpan!');
  };

  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    const newItem: TestimonialItem = {
      id: `testi-${Date.now()}`,
      ...item,
    };
    setSettings((prev) => {
      const current = prev.testimonials || DEFAULT_SETTINGS.testimonials!;
      return {
        ...prev,
        testimonials: {
          ...current,
          reviews: [newItem, ...current.reviews],
        },
      };
    });
    showToast('Ulasan pelanggan baru berhasil ditambahkan!');
  };

  const updateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    setSettings((prev) => {
      const current = prev.testimonials || DEFAULT_SETTINGS.testimonials!;
      return {
        ...prev,
        testimonials: {
          ...current,
          reviews: current.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        },
      };
    });
    showToast('Ulasan pelanggan berhasil diupdate!');
  };

  const deleteTestimonial = (id: string) => {
    setSettings((prev) => {
      const current = prev.testimonials || DEFAULT_SETTINGS.testimonials!;
      return {
        ...prev,
        testimonials: {
          ...current,
          reviews: current.reviews.filter((r) => r.id !== id),
        },
      };
    });
    showToast('Ulasan pelanggan berhasil dihapus.', 'info');
  };

  const updateContacts = (contactsData: Partial<SiteSettings['contacts']>) => {
    setSettings((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        ...contactsData,
      },
    }));
    showToast('Kontak toko berhasil diperbarui!');
  };

  const updateAnalytics = (analyticsData: Partial<AnalyticsSettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        analytics: {
          ...(prev.analytics || DEFAULT_SETTINGS.analytics!),
          ...analyticsData,
        },
      };
      saveSettingsToFirestore(updated);
      return updated;
    });
    showToast('Pengaturan Google Analytics & Pelacakan berhasil disimpan!');
  };

  const trackUserEvent = (eventName: string, params: Record<string, any> = {}) => {
    trackEvent(eventName, params, settings.analytics?.measurementId);
    refreshAnalytics();
  };

  const trackUserPageView = (title: string, path: string) => {
    trackPageView(title, path, settings.analytics?.measurementId);
    refreshAnalytics();
  };

  const updateFooter = (footerData: Partial<FooterSettings>) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        ...footerData,
      },
    }));
    showToast('Teks Footer berhasil diperbarui!');
  };

  const updateSocialLinks = (socialData: Partial<SocialLinks>) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: {
          ...(prev.footer.socialLinks || DEFAULT_SETTINGS.footer.socialLinks || {}),
          ...socialData,
        },
      },
    }));
    showToast('Link media sosial toko berhasil disimpan!');
  };

  const updatePaymentSettings = (data: Partial<PaymentSettings>) => {
    setSettings((prev) => ({
      ...prev,
      paymentSettings: {
        ...(prev.paymentSettings || DEFAULT_SETTINGS.paymentSettings!),
        ...data,
      },
    }));
    showToast('Pengaturan metode pembayaran berhasil disimpan!', 'success');
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethodConfig>) => {
    setSettings((prev) => {
      const current = prev.paymentSettings || DEFAULT_SETTINGS.paymentSettings!;
      const updatedMethods = current.methods.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      );
      return {
        ...prev,
        paymentSettings: {
          ...current,
          methods: updatedMethods,
        },
      };
    });
    showToast('Metode pembayaran berhasil diperbarui!', 'success');
  };

  const addPaymentMethod = (method: PaymentMethodConfig) => {
    setSettings((prev) => {
      const current = prev.paymentSettings || DEFAULT_SETTINGS.paymentSettings!;
      return {
        ...prev,
        paymentSettings: {
          ...current,
          methods: [...current.methods, method],
        },
      };
    });
    showToast('Metode pembayaran baru berhasil ditambahkan!', 'success');
  };

  const deletePaymentMethod = (id: string) => {
    setSettings((prev) => {
      const current = prev.paymentSettings || DEFAULT_SETTINGS.paymentSettings!;
      return {
        ...prev,
        paymentSettings: {
          ...current,
          methods: current.methods.filter((m) => m.id !== id),
        },
      };
    });
    showToast('Metode pembayaran berhasil dihapus!', 'info');
  };

  const updateFullSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    showToast('Pengaturan website berhasil disimpan!');
  };

  // Reset to default
  const resetToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    setBranches(DEFAULT_BRANCHES);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.BRANCHES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    showToast('Website telah dikembalikan ke setelan awal default!', 'info');
  };

  // Export full backup JSON
  const exportBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      branding: settings.branding,
      products,
      branches,
      settings,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `kevin88-backup-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('File backup database JSON berhasil diunduh!');
  };

  // Import backup JSON
  const importBackup = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.products)) {
        setProducts(data.products);
      }
      if (Array.isArray(data.branches)) {
        setBranches(data.branches);
      }
      if (data.settings && typeof data.settings === 'object') {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
          branding: { ...DEFAULT_SETTINGS.branding, ...(data.settings.branding || data.branding || {}) },
          about: { ...DEFAULT_SETTINGS.about, ...(data.settings.about || {}) },
          technician: { ...DEFAULT_SETTINGS.technician, ...(data.settings.technician || {}) },
          faqs: Array.isArray(data.settings.faqs) ? data.settings.faqs : DEFAULT_SETTINGS.faqs,
        });
      }
      showToast('Data website berhasil dipulihkan dari file backup!');
      return { success: true, message: 'Berhasil memulihkan data.' };
    } catch (e: any) {
      showToast('Format file JSON tidak valid.', 'error');
      return { success: false, message: e?.message || 'Format tidak valid' };
    }
  };

  return (
    <SiteContext.Provider
      value={{
        products,
        branches,
        settings,
        isAdminMode,
        toggleAdminMode: handleToggleAdminMode,
        setAdminMode: handleSetAdminMode,

        // Owner Authentication & Authorization
        isOwner,
        isOwnerAuthModalOpen,
        openOwnerAuthModal,
        closeOwnerAuthModal,
        verifyOwnerPin,
        requestAdminMode,
        publishWebsite,
        isCloudConnected,
        lastCloudSyncAt,

        // Firebase Auth & Profile
        currentUser,
        isAuthLoading,
        loginWithGoogle,
        logout,

        addProduct,
        batchImportProducts,
        updateProduct,
        deleteProduct,
        quickUpdateStock,
        quickToggleStock,
        quickUpdatePrice,
        addProductReview,

        addBranch,
        updateBranch,
        deleteBranch,

        updateTheme,
        updateBranding,
        updateAnnouncement,
        updateHero,
        updateSectionHeaders,
        updateAbout,
        updateTechnician,
        addFaq,
        updateFaq,
        deleteFaq,

        updateTestimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        updateContacts,
        updateFooter,
        updateSocialLinks,
        updateFullSettings,

        resetToDefault,
        exportBackup,
        importBackup,

        editingProduct,
        isProductModalOpen,
        openProductModal: (p = null) => {
          setEditingProduct(p || null);
          setIsProductModalOpen(true);
        },
        closeProductModal: () => {
          setEditingProduct(null);
          setIsProductModalOpen(false);
        },

        editingBranch,
        isBranchModalOpen,
        openBranchModal: (b = null) => {
          setEditingBranch(b || null);
          setIsBranchModalOpen(true);
        },
        closeBranchModal: () => {
          setEditingBranch(null);
          setIsBranchModalOpen(false);
        },

        isThemeModalOpen,
        openThemeModal: () => setIsThemeModalOpen(true),
        closeThemeModal: () => setIsThemeModalOpen(false),

        isBackgroundModalOpen,
        openBackgroundModal,
        closeBackgroundModal,

        isBrandingModalOpen,
        openBrandingModal: () => setIsBrandingModalOpen(true),
        closeBrandingModal: () => setIsBrandingModalOpen(false),

        isBannerModalOpen,
        openBannerModal: () => setIsBannerModalOpen(true),
        closeBannerModal: () => setIsBannerModalOpen(false),

        isHeroModalOpen,
        openHeroModal: () => setIsHeroModalOpen(true),
        closeHeroModal: () => setIsHeroModalOpen(false),

        isAboutModalOpen,
        openAboutModal: () => setIsAboutModalOpen(true),
        closeAboutModal: () => setIsAboutModalOpen(false),

        isTechnicianModalOpen,
        openTechnicianModal: () => setIsTechnicianModalOpen(true),
        closeTechnicianModal: () => setIsTechnicianModalOpen(false),

        editingFaq,
        isFaqModalOpen,
        openFaqModal: (faq = null) => {
          setEditingFaq(faq || null);
          setIsFaqModalOpen(true);
        },
        closeFaqModal: () => {
          setEditingFaq(null);
          setIsFaqModalOpen(false);
        },

        editingTestimonial,
        isTestimonialsModalOpen,
        openTestimonialsModal: (testi = null) => {
          setEditingTestimonial(testi || null);
          setIsTestimonialsModalOpen(true);
        },
        closeTestimonialsModal: () => {
          setEditingTestimonial(null);
          setIsTestimonialsModalOpen(false);
        },

        // Analytics
        updateAnalytics,
        analyticsSummary,
        refreshAnalytics,
        isAnalyticsModalOpen,
        openAnalyticsModal,
        closeAnalyticsModal,
        trackUserEvent,
        trackUserPageView,

        isFooterModalOpen,
        footerModalTab,
        setFooterModalTab,
        openFooterModal: (tab = 'profile') => {
          setFooterModalTab(tab);
          setIsFooterModalOpen(true);
        },
        closeFooterModal: () => setIsFooterModalOpen(false),

        isSectionHeadersModalOpen,
        openSectionHeadersModal: () => setIsSectionHeadersModalOpen(true),
        closeSectionHeadersModal: () => setIsSectionHeadersModalOpen(false),

        isCMSModalOpen,
        cmsActiveTab,
        setCMSActiveTab,
        openCMSModal: (tab = 'branding') => {
          setCMSActiveTab(tab);
          setIsCMSModalOpen(true);
        },
        closeCMSModal: () => setIsCMSModalOpen(false),

        isShopeeModalOpen,
        openShopeeModal: () => setIsShopeeModalOpen(true),
        closeShopeeModal: () => setIsShopeeModalOpen(false),

        isPublishModalOpen,
        openPublishModal: () => setIsPublishModalOpen(true),
        closePublishModal: () => setIsPublishModalOpen(false),

        isCheckoutModalOpen,
        openCheckoutModal: () => setIsCheckoutModalOpen(true),
        closeCheckoutModal: () => setIsCheckoutModalOpen(false),

        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        updatePaymentSettings,
        updatePaymentMethod,
        addPaymentMethod,
        deletePaymentMethod,

        currentInvoice,
        isInvoiceModalOpen,
        openInvoiceModal,
        closeInvoiceModal,

        // QRIS Dynamic Payment Modal
        isQrisPaymentModalOpen,
        qrisPaymentInvoice,
        openQrisPaymentModal,
        closeQrisPaymentModal,

        orders,
        addOrder,
        updateInvoicePaymentStatus,
        updateOrderTracking,
        isOrdersModalOpen,
        openOrdersModal,
        closeOrdersModal,

        // Compare Products
        comparedProducts,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
        toggleCompareProduct,
        removeCompareProduct,
        clearCompareProducts,

        // Warranty Check & Management
        warrantyRecords,
        addWarrantyRecord,
        lookupWarranty,
        isWarrantyModalOpen,
        warrantySearchQuery,
        openWarrantyModal,
        closeWarrantyModal,
        updateWarrantySettings,
        isWarrantyEditModalOpen,
        openWarrantyEditModal,
        closeWarrantyEditModal,

        toast,
        showToast,

        // Store Overview Dashboard (Recharts)
        isStoreOverviewOpen,
        storeOverviewTab,
        openStoreOverviewOpen,
        closeStoreOverviewOpen,

        // Consultations from Firestore
        consultations,
        addConsultation,
        updateConsultationStatus,

        // Real-time Notification System for Owner
        ownerNotifications,
        activeOwnerAlert,
        dismissOwnerAlert,
        triggerSimulationNotification,

        // QRIS Payment Validation Tracking
        updateQrisValidation,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
};
