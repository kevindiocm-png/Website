export type ProductCategory = 'baterai' | 'charger' | 'keyboard' | 'lcd' | 'ram' | 'ssd' | 'fan' | string;
export type ProductBrand = 'Asus' | 'Lenovo' | 'Acer' | 'HP' | 'Dell' | 'Apple' | 'Axioo' | 'MSI' | 'Toshiba' | 'Universal' | string;

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
  laptopModel?: string;
  source?: 'shopee' | 'tokopedia' | 'toko' | 'website';
  invoiceNumber?: string; // Linked order invoice number (e.g. INV-20261007-8801)
  productId?: string;
  productName?: string;
  city?: string;
  tags?: string[];
  recommend?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: ProductBrand;
  compatibleModels: string[];
  partNumber: string;
  price: number;
  originalPrice?: number;
  stock: number;
  warrantyMonths: number;
  specs: {
    label: string;
    value: string;
  }[];
  image: string;
  isPopular?: boolean;
  description: string;
  condition: string; // 'Baru (Original)' | 'Baru (OEM Grade A+)' | string
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  laptopNote?: string;
}

export type PaymentMethodType = 'qris' | 'bca' | 'mandiri' | 'bri' | 'bni' | 'cod';
export type ShippingMethodType = 'regular' | 'express' | 'instant' | 'pickup';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  laptopModel: string;
  pickupBranchId?: string;
  notes?: string;
}

export type OrderTrackingStatus =
  | 'pending'
  | 'confirmed'
  | 'qc_testing'
  | 'packed'
  | 'shipping'
  | 'ready_pickup'
  | 'delivered'
  | 'completed';

export interface TrackingLogItem {
  id: string;
  status: OrderTrackingStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export type QrisVerificationStatus = 'pending_review' | 'verified_paid' | 'rejected';

export interface QrisValidationRecord {
  uploadedAt: string;
  fileName?: string;
  proofPreviewUrl?: string; // image preview url or dataUrl
  decodedPayload?: string; // QRIS decoded text from jsqr scanner
  matchScore?: number; // e.g. 100 for exact match, 85 for QR payload match
  detectedType?: 'qris_payload' | 'receipt_screenshot' | 'manual_slip';
  verificationStatus: QrisVerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string; // 'Owner (Manual)', 'Auto-Scanner QC', etc.
  rejectionReason?: string;
  manualNotes?: string;
}

export interface OrderInvoice {
  id?: string;
  invoiceNumber: string;
  userId?: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  shippingMethod: ShippingMethodType;
  discount: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'unpaid' | 'paid' | 'processing';

  // Real-time tracking and repair status
  trackingStatus?: OrderTrackingStatus;
  trackingNumber?: string; // e.g. JNE-882910398
  courierName?: string; // e.g. JNE, J&T, SiCepat, GoSend, Ambil Toko
  technicianName?: string; // e.g. Teknisi Kevin 88 Hardware Lab
  estimatedDelivery?: string; // e.g. 1-2 Hari Kerja
  trackingHistory?: TrackingLogItem[];
  repairOrNotes?: string;

  // QRIS Payment Validation Tracking
  qrisValidation?: QrisValidationRecord;

  // Review Status
  isReviewed?: boolean;
  reviewedProductIds?: string[];
}

export interface WarrantyRecord {
  id: string;
  serialNumber: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  productName: string;
  partNumber: string;
  brand: string;
  category?: string;
  purchaseDate: string; // ISO date string (YYYY-MM-DD)
  warrantyMonths: number;
  branchName: string;
  status?: 'active' | 'expiring_soon' | 'expired';
  notes?: string;
}

export interface Branch {
  id: string;
  city: string;
  mallName: string;
  address: string;
  phone: string;
  whatsapp: string;
  operationalHours: string;
  mapsUrl: string;
  hasTechnicianOnSite: boolean;
}

export interface PresetModel {
  brand: string;
  series: string;
  models: string[];
  recommendedParts: {
    battery: string;
    charger: string;
    keyboard: string;
    lcd: string;
    ramType: string;
    ssdType: string;
    fan: string;
  };
}

export type ThemeColorPreset =
  | 'amber'
  | 'blue'
  | 'cyan'
  | 'emerald'
  | 'red'
  | 'purple'
  | 'orange'
  | 'lime'
  | 'custom';

export type BackgroundMode =
  | 'dark'
  | 'black'
  | 'midnight'
  | 'navy'
  | 'charcoal'
  | 'emerald'
  | 'espresso'
  | 'purple'
  | 'light'
  | 'cream'
  | 'custom';
export type CornerRadius = 'sharp' | 'medium' | 'soft' | 'pill';
export type FontFamilyOption = 'sans' | 'mono' | 'geometric' | 'serif';
export type HighlightStyleOption = 'gradient' | 'solid' | 'glow' | 'marker' | 'underline';

export interface ThemeSettings {
  colorPreset: ThemeColorPreset;
  primaryColor: string;
  primaryHoverColor: string;
  primaryTextColor: string;
  highlightColor?: string;
  highlightSecondaryColor?: string;
  highlightStyle?: HighlightStyleOption;
  brandNameColor?: string;
  navbarBgColor?: string;
  customBgColor?: string;
  customCardColor?: string;
  customTextColor?: string;
  highContrastMode?: boolean;
  backgroundMode: BackgroundMode;
  fontFamily: FontFamilyOption;
  borderRadius: CornerRadius;
}

export interface SocialLinks {
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  tokopedia?: string;
  shopee?: string;
  bukalapak?: string;
  facebook?: string;
  youtube?: string;
  googleMaps?: string;
}

export interface SectionHeaders {
  catalogBadge?: string;
  catalogTitle?: string;
  catalogDesc?: string;
  checkerBadge?: string;
  checkerTitle?: string;
  checkerDesc?: string;
  branchesBadge?: string;
  branchesTitle?: string;
  branchesDesc?: string;
  faqBadge?: string;
  faqTitle?: string;
  faqDesc?: string;
}

export interface BrandingSettings {
  logoMode: 'image' | 'badge' | 'both';
  logoImageUrl: string;
  badgeText: string;
  brandName: string;
  brandHighlight: string;
  brandNameColor?: string;
  brandHighlightColor?: string;
  navbarBgColor?: string;
  tagline: string;
}

export interface AboutSettings {
  badge: string;
  title: string;
  storyParagraphs: string[];
  stats: {
    label: string;
    value: string;
    desc: string;
  }[];
  reasons: {
    number: string;
    title: string;
    desc: string;
  }[];
}

export interface TechnicianSettings {
  badge: string;
  title: string;
  description: string;
  badgeCardTitle: string;
  badgeCardDesc: string;
  imageUrl: string;
  benefits: {
    title: string;
    desc: string;
  }[];
  whatsappCtaText: string;
}

export type ReviewSource = 'google_maps' | 'shopee' | 'tokopedia' | 'store_visit' | 'whatsapp' | 'website';

export interface TestimonialItem {
  id: string;
  customerName: string;
  city?: string;
  rating: number; // 1 to 5
  source: ReviewSource;
  productPurchased?: string;
  dateText?: string;
  quote: string;
  isVerified?: boolean;
}

export interface TestimonialsSettings {
  badge?: string;
  title?: string;
  description?: string;
  overallRating?: number;
  totalReviewsCount?: number;
  reviews: TestimonialItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FooterServiceItem {
  label: string;
  actionId?: string; // e.g. 'tentang-kami' | 'katalog' | 'cabang' | 'faq' | 'testimoni' | 'warranty'
}

export interface FooterSettings {
  description: string;
  copyright: string;
  address?: string;
  socialLinks?: SocialLinks;

  // Kolom 2: Kategori Sparepart
  categoriesTitle?: string;
  categoriesList?: string[];

  // Kolom 3: Layanan Pelanggan
  servicesTitle?: string;
  servicesList?: FooterServiceItem[];

  // Kolom 4: Garansi & Pengiriman
  warrantyTitle?: string;
  warrantyDescription?: string;
  warrantyButtonText?: string;
  courierList?: string[];
  bankList?: string[];

  // Baris Bawah
  tagline?: string;
}

export interface SiteSettings {
  theme?: ThemeSettings;
  branding: BrandingSettings;
  announcement: {
    enabled: boolean;
    text: string;
    badgeText?: string;
    bgColor?: string;
    textColor?: string;
  };
  hero: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    highlightColor?: string;
    highlightSecondaryColor?: string;
    highlightStyle?: HighlightStyleOption;
    description: string;
    quickPicks: string[];
    imageUrl?: string;
    badgeCardTitle?: string;
    badgeCardDesc?: string;
    badgeCardPill?: string;
    ctaButton1Text?: string;
    ctaButton2Text?: string;
    guarantees?: string[];
  };
  sectionHeaders?: SectionHeaders;
  about: AboutSettings;
  technician: TechnicianSettings;
  faqs: FaqItem[];
  testimonials?: TestimonialsSettings;
  analytics?: AnalyticsSettings;
  contacts: {
    whatsappNumber: string;
    email: string;
    phone: string;
    operationalHours: string;
  };
  footer: FooterSettings;
  paymentSettings?: PaymentSettings;
  warrantySettings?: WarrantySettings;
}

export interface WarrantyPillarItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  icon?: string;
}

export interface WarrantyQuickChipItem {
  id: string;
  label: string;
  code: string;
}

export interface WarrantySettings {
  title: string;
  subtitle?: string;
  helpPhone?: string;
  helpWhatsApp?: string;
  pillars: WarrantyPillarItem[];
  quickChips: WarrantyQuickChipItem[];
}

export interface PaymentMethodConfig {
  id: string; // 'qris' | 'bca' | 'mandiri' | 'bri' | 'bni' | 'cod' | custom string
  name: string; // e.g. 'Transfer Bank BCA'
  badge: string; // e.g. 'VERIFIKASI CEPAT', 'INSTANT & OTOMATIS', 'RESMI TOKO'
  desc: string; // e.g. 'No. Rekening 0123-456-789 a/n Kevin 88 Computer'
  accountNumber?: string; // e.g. '0123 456 789'
  accountHolder?: string; // e.g. 'KEVIN 88 COMPUTER'
  bankName?: string; // e.g. 'BCA (Bank Central Asia)'
  branchName?: string; // e.g. 'KCU Semarang Simpang Lima'
  logoColor?: string; // e.g. 'bg-blue-600'
  cardTheme?: 'blue' | 'amber' | 'emerald' | 'cyan' | 'purple' | 'slate';
  qrisImageUrl?: string; // URL or base64 for QRIS barcode image
  bankQrImageUrl?: string; // Optional QR code image for bank transfer
  qrisNmid?: string; // e.g. 'ID1020038814-KV88'
  qrisMerchantName?: string; // e.g. 'KEVIN 88 COMPUTER'
  instructions?: string; // custom instructions
  enabled: boolean; // toggle active / inactive
  category: 'qris' | 'bank' | 'cod' | 'ewallet' | 'other';
}

export interface PaymentSettings {
  title?: string; // e.g. '3. METODE PEMBAYARAN'
  subtitle?: string; // e.g. 'Resmi & Aman'
  qrisNmid?: string;
  qrisImageUrl?: string;
  methods: PaymentMethodConfig[];
}

export interface AnalyticsSettings {
  enabled: boolean;
  measurementId: string; // e.g. "G-XXXXXXXXXX"
  trackPageViews: boolean;
  trackProductClicks: boolean;
  trackCartEvents: boolean;
  trackWhatsAppClicks: boolean;
}

export interface PageViewMetric {
  pagePath: string;
  pageTitle: string;
  views: number;
  uniqueVisitors: number;
  lastViewedAt: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  totalVisitors: number;
  totalProductViews: number;
  totalCartAdds: number;
  totalWhatsAppClicks: number;
  pageMetrics: Record<string, PageViewMetric>;
  recentEvents: {
    id: string;
    eventName: string;
    label: string;
    timestamp: string;
  }[];
}

export type ConsultationStatus = 'pending' | 'in_progress' | 'responded' | 'resolved';

export interface ConsultationRequest {
  id: string;
  name: string;
  phone?: string;
  brand: string;
  laptopModel: string;
  sparepartType: string;
  issueDetails: string;
  status: ConsultationStatus;
  createdAt: string;
  respondedAt?: string;
  notes?: string;
}

export interface OwnerNotification {
  id: string;
  type: 'order' | 'consultation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  referenceId: string;
  amount?: number;
  customerName?: string;
}


