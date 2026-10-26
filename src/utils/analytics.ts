import { AnalyticsSettings, AnalyticsSummary, PageViewMetric } from '../types';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const STORAGE_KEYS = {
  METRICS: 'kevin88_analytics_metrics_v1',
  VISITOR_ID: 'kevin88_visitor_anon_id',
  VISITED_PAGES_TODAY: 'kevin88_visited_pages_today',
};

// Anonymous visitor ID helper
export function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
    if (!vid) {
      vid = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
    }
    return vid;
  } catch {
    return 'anon_guest';
  }
}

// 1. Google Analytics 4 Script Tag Injector & Initializer
let gaInitialized = false;
let currentLoadedId = '';

export function initGoogleAnalytics(settings?: AnalyticsSettings) {
  if (typeof window === 'undefined') return;

  const measurementId = settings?.measurementId?.trim();
  const isEnabled = settings?.enabled ?? true;

  if (!isEnabled || !measurementId) {
    return;
  }

  if (gaInitialized && currentLoadedId === measurementId) {
    return;
  }

  try {
    // 1. Setup dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false, // We manually send page_view on section/route change
    });

    // 2. Inject Google Tag Manager script
    const scriptId = 'google-analytics-gtag';
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    gaInitialized = true;
    currentLoadedId = measurementId;
    console.log(`[Google Analytics] Initialized successfully with ID: ${measurementId}`);
  } catch (err) {
    console.warn('[Google Analytics] Failed to initialize gtag script:', err);
  }
}

// 2. Track Page View
export function trackPageView(pageTitle: string, pagePath: string, measurementId?: string) {
  if (typeof window === 'undefined') return;

  // Track in Google Analytics (GA4)
  if (window.gtag && measurementId) {
    try {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath,
        send_to: measurementId,
      });
    } catch (e) {
      console.warn('[GA4] trackPageView error:', e);
    }
  }

  // Update In-App Analytics Dashboard metrics
  recordInAppPageView(pageTitle, pagePath);
}

// 3. Track Custom Event
export function trackEvent(
  eventName: string,
  params: Record<string, any> = {},
  measurementId?: string
) {
  if (typeof window === 'undefined') return;

  // Track in Google Analytics (GA4)
  if (window.gtag) {
    try {
      if (measurementId) {
        window.gtag('event', eventName, { ...params, send_to: measurementId });
      } else {
        window.gtag('event', eventName, params);
      }
    } catch (e) {
      console.warn('[GA4] trackEvent error:', e);
    }
  }

  // Record in In-App summary
  recordInAppEvent(eventName, params);
}

// In-App Realtime Tracking Implementation
const DEFAULT_METRICS: AnalyticsSummary = {
  totalPageViews: 1420,
  totalVisitors: 840,
  totalProductViews: 920,
  totalCartAdds: 185,
  totalWhatsAppClicks: 142,
  pageMetrics: {
    '/': {
      pagePath: '/',
      pageTitle: 'Beranda & Hero',
      views: 1420,
      uniqueVisitors: 840,
      lastViewedAt: new Date().toISOString(),
    },
    '/#katalog': {
      pagePath: '/#katalog',
      pageTitle: 'Katalog Produk Sparepart',
      views: 1250,
      uniqueVisitors: 780,
      lastViewedAt: new Date().toISOString(),
    },
    '/#tentang-kami': {
      pagePath: '/#tentang-kami',
      pageTitle: 'Tentang Kevin 88',
      views: 640,
      uniqueVisitors: 410,
      lastViewedAt: new Date().toISOString(),
    },
    '/#cabang': {
      pagePath: '/#cabang',
      pageTitle: 'Cabang & Google Maps',
      views: 890,
      uniqueVisitors: 560,
      lastViewedAt: new Date().toISOString(),
    },
    '/#faq': {
      pagePath: '/#faq',
      pageTitle: 'FAQ & Garansi',
      views: 430,
      uniqueVisitors: 310,
      lastViewedAt: new Date().toISOString(),
    },
    '/#testimoni': {
      pagePath: '/#testimoni',
      pageTitle: 'Testimoni Pelanggan',
      views: 520,
      uniqueVisitors: 380,
      lastViewedAt: new Date().toISOString(),
    },
  },
  recentEvents: [
    {
      id: 'evt-1',
      eventName: 'page_view',
      label: 'Katalog Produk Sparepart',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: 'evt-2',
      eventName: 'view_item',
      label: 'Baterai Asus ROG Strix G512',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'evt-3',
      eventName: 'add_to_cart',
      label: 'Layar LCD 14.0 FHD Slim IPS',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 'evt-4',
      eventName: 'contact_whatsapp',
      label: 'Konsultasi Cabang Semarang',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
  ],
};

export function getStoredAnalytics(): AnalyticsSummary {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.METRICS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_METRICS,
          ...parsed,
          pageMetrics: {
            ...DEFAULT_METRICS.pageMetrics,
            ...(parsed.pageMetrics || {}),
          },
        };
      }
    }
  } catch (e) {
    console.error('Failed to load analytics metrics', e);
  }
  return DEFAULT_METRICS;
}

function saveStoredAnalytics(data: AnalyticsSummary) {
  try {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save analytics metrics', e);
  }
}

function recordInAppPageView(pageTitle: string, pagePath: string) {
  const current = getStoredAnalytics();
  const now = new Date().toISOString();
  const visitorId = getOrCreateVisitorId();

  // Check unique today
  const dayKey = `${new Date().toDateString()}_${pagePath}`;
  const visitedBefore = sessionStorage.getItem(dayKey);

  const existingPage = current.pageMetrics[pagePath] || {
    pagePath,
    pageTitle,
    views: 0,
    uniqueVisitors: 0,
    lastViewedAt: now,
  };

  const updatedPage: PageViewMetric = {
    ...existingPage,
    pageTitle,
    views: existingPage.views + 1,
    uniqueVisitors: visitedBefore ? existingPage.uniqueVisitors : existingPage.uniqueVisitors + 1,
    lastViewedAt: now,
  };

  sessionStorage.setItem(dayKey, 'true');

  const updatedSummary: AnalyticsSummary = {
    ...current,
    totalPageViews: current.totalPageViews + 1,
    totalVisitors: visitedBefore ? current.totalVisitors : current.totalVisitors + 1,
    pageMetrics: {
      ...current.pageMetrics,
      [pagePath]: updatedPage,
    },
    recentEvents: [
      {
        id: `evt-${Date.now()}`,
        eventName: 'page_view',
        label: pageTitle,
        timestamp: now,
      },
      ...current.recentEvents.slice(0, 19),
    ],
  };

  saveStoredAnalytics(updatedSummary);
}

function recordInAppEvent(eventName: string, params: Record<string, any>) {
  const current = getStoredAnalytics();
  const now = new Date().toISOString();
  let label = params.name || params.label || params.item_name || eventName;

  let totalProductViews = current.totalProductViews;
  let totalCartAdds = current.totalCartAdds;
  let totalWhatsAppClicks = current.totalWhatsAppClicks;

  if (eventName === 'view_item') {
    totalProductViews += 1;
    label = `Produk: ${params.productName || params.name || 'Sparepart'}`;
  } else if (eventName === 'add_to_cart') {
    totalCartAdds += 1;
    label = `Masuk Keranjang: ${params.productName || params.name || 'Sparepart'}`;
  } else if (eventName === 'contact_whatsapp') {
    totalWhatsAppClicks += 1;
    label = `WhatsApp CS: ${params.source || 'Tombol WA'}`;
  }

  const updatedSummary: AnalyticsSummary = {
    ...current,
    totalProductViews,
    totalCartAdds,
    totalWhatsAppClicks,
    recentEvents: [
      {
        id: `evt-${Date.now()}`,
        eventName,
        label,
        timestamp: now,
      },
      ...current.recentEvents.slice(0, 19),
    ],
  };

  saveStoredAnalytics(updatedSummary);
}

// Sync to Firestore for persistency across devices
export async function syncAnalyticsToFirestore(summary: AnalyticsSummary): Promise<void> {
  try {
    const docRef = doc(db, 'analytics', 'traffic_summary');
    await setDoc(docRef, {
      ...summary,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync analytics to Firestore (using local storage):', err);
  }
}

export async function fetchAnalyticsFromFirestore(): Promise<AnalyticsSummary | null> {
  try {
    const docRef = doc(db, 'analytics', 'traffic_summary');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AnalyticsSummary;
    }
  } catch (err) {
    console.warn('Could not fetch analytics from Firestore:', err);
  }
  return null;
}
