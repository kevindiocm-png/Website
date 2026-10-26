import React, { useState, useMemo } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { jsPDF } from 'jspdf';
import {
  X,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  ShoppingBag,
  MessageSquare,
  Activity,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Settings,
  HelpCircle,
  DollarSign,
  PackageCheck,
  Award,
  Layers,
  ArrowUpRight,
  Download,
  Calendar,
  CreditCard,
  QrCode,
  Store,
  Filter,
  Flame,
  Check,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Printer,
  LineChart,
  Clock,
  Zap,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';

interface MonthlySalesData {
  month: string;
  fullName: string;
  revenue: number;
  ordersCount: number;
  unitsSold: number;
  growthMoM: number;
  topCategory: string;
}

export interface DailySalesPoint {
  day: number;
  dateStr: string;
  fullDate: string;
  dayName: string;
  revenue: number;
  ordersCount: number;
  unitsSold: number;
  isWeekend: boolean;
  isPeak: boolean;
  highlightNote?: string;
}

interface TopSparepartItem {
  id: string;
  name: string;
  category: string;
  compatibility: string;
  unitsSold: number;
  unitPrice: number;
  totalRevenue: number;
  stockStatus: 'fast_moving' | 'safe' | 'low_stock';
  warrantyRate: string;
}

export const AnalyticsModal: React.FC = () => {
  const {
    isAnalyticsModalOpen,
    closeAnalyticsModal,
    settings,
    updateAnalytics,
    analyticsSummary,
    refreshAnalytics,
    trackUserEvent,
    showToast,
    orders,
    products,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<'sales' | 'spareparts' | 'traffic' | 'config'>('sales');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'year_2026' | 'q3_q4' | 'recent_3m'>('year_2026');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(9); // Default October (idx 9)
  const [sparepartCategoryFilter, setSparepartCategoryFilter] = useState<string>('all');
  const [dailyMetric, setDailyMetric] = useState<'revenue' | 'orders'>('revenue');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(23); // Default to 24th (peak day)
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // GA4 Configuration state
  const analyticsConfig = settings.analytics || {
    enabled: true,
    measurementId: 'G-KVN88COMP01',
    trackPageViews: true,
    trackProductClicks: true,
    trackCartEvents: true,
    trackWhatsAppClicks: true,
  };
  const [measurementId, setMeasurementId] = useState(analyticsConfig.measurementId || '');
  const [enabled, setEnabled] = useState(analyticsConfig.enabled ?? true);
  const [trackPageViews, setTrackPageViews] = useState(analyticsConfig.trackPageViews ?? true);
  const [trackProductClicks, setTrackProductClicks] = useState(analyticsConfig.trackProductClicks ?? true);
  const [trackCartEvents, setTrackCartEvents] = useState(analyticsConfig.trackCartEvents ?? true);
  const [trackWhatsAppClicks, setTrackWhatsAppClicks] = useState(analyticsConfig.trackWhatsAppClicks ?? true);

  // 1. Calculate Real-Time Orders Revenue Addition
  const realOrdersRevenue = useMemo(() => {
    return (orders || []).reduce((acc, order) => acc + (order.total || 0), 0);
  }, [orders]);

  const realOrdersCount = (orders || []).length;

  // 2. Monthly Sales History Data (12 Months 2026)
  const monthlySales: MonthlySalesData[] = useMemo(() => {
    const baseData: MonthlySalesData[] = [
      { month: 'Jan', fullName: 'Januari 2026', revenue: 9450000, ordersCount: 16, unitsSold: 28, growthMoM: 8.5, topCategory: 'Baterai Laptop' },
      { month: 'Feb', fullName: 'Februari 2026', revenue: 11200000, ordersCount: 19, unitsSold: 34, growthMoM: 18.5, topCategory: 'Charger & Adaptor' },
      { month: 'Mar', fullName: 'Maret 2026', revenue: 13800000, ordersCount: 23, unitsSold: 41, growthMoM: 23.2, topCategory: 'Layar LCD / LED' },
      { month: 'Apr', fullName: 'April 2026', revenue: 15100000, ordersCount: 26, unitsSold: 46, growthMoM: 9.4, topCategory: 'Baterai Laptop' },
      { month: 'Mei', fullName: 'Mei 2026', revenue: 17400000, ordersCount: 29, unitsSold: 52, growthMoM: 15.2, topCategory: 'Keyboard Backlight' },
      { month: 'Jun', fullName: 'Juni 2026', revenue: 19850000, ordersCount: 33, unitsSold: 58, growthMoM: 14.1, topCategory: 'RAM & SSD NVMe' },
      { month: 'Jul', fullName: 'Juli 2026', revenue: 22600000, ordersCount: 38, unitsSold: 67, growthMoM: 13.9, topCategory: 'Layar LCD / LED' },
      { month: 'Ags', fullName: 'Agustus 2026', revenue: 24900000, ordersCount: 42, unitsSold: 74, growthMoM: 10.2, topCategory: 'Baterai Laptop' },
      { month: 'Sep', fullName: 'September 2026', revenue: 27500000, ordersCount: 46, unitsSold: 82, growthMoM: 10.4, topCategory: 'Charger Fast Charge' },
      { month: 'Okt', fullName: 'Oktober 2026 (Aktif)', revenue: 31850000 + realOrdersRevenue, ordersCount: 52 + realOrdersCount, unitsSold: 94 + (realOrdersCount * 2), growthMoM: 15.8, topCategory: 'Baterai & Layar LED' },
      { month: 'Nov', fullName: 'November 2026 (Target)', revenue: 34500000, ordersCount: 56, unitsSold: 102, growthMoM: 8.3, topCategory: 'Keyboard & Charger' },
      { month: 'Des', fullName: 'Desember 2026 (Target)', revenue: 38200000, ordersCount: 62, unitsSold: 114, growthMoM: 10.7, topCategory: 'Semua Kategori' },
    ];

    if (selectedTimeframe === 'q3_q4') {
      return baseData.slice(6); // Jul - Des
    }
    if (selectedTimeframe === 'recent_3m') {
      return baseData.slice(7, 10); // Ags - Okt
    }
    return baseData;
  }, [selectedTimeframe, realOrdersRevenue, realOrdersCount]);

  // Max value for bar chart height scaling
  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...monthlySales.map((m) => m.revenue));
    return maxVal > 0 ? maxVal : 1;
  }, [monthlySales]);

  // Aggregate Key Metrics
  const totalRevenue = useMemo(() => {
    return monthlySales.reduce((acc, m) => acc + m.revenue, 0);
  }, [monthlySales]);

  const totalOrders = useMemo(() => {
    return monthlySales.reduce((acc, m) => acc + m.ordersCount, 0);
  }, [monthlySales]);

  const totalUnits = useMemo(() => {
    return monthlySales.reduce((acc, m) => acc + m.unitsSold, 0);
  }, [monthlySales]);

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const avgMonthlyRevenue = Math.round(totalRevenue / monthlySales.length);

  // Peak Month
  const peakMonth = useMemo(() => {
    return monthlySales.reduce((prev, current) => (prev.revenue > current.revenue ? prev : current), monthlySales[0]);
  }, [monthlySales]);

  // 3. Daily Sales Data (Past 30 Days in October 2026)
  const dailySalesData: DailySalesPoint[] = useMemo(() => {
    const dayNames = ['Kamis', 'Jumat', 'Sabtu', 'Minggu', 'Senin', 'Selasa', 'Rabu'];
    const baseDaily: { day: number; rev: number; orders: number; units: number; note?: string }[] = [
      { day: 1, rev: 850000, orders: 2, units: 3, note: 'Awal Bulan' },
      { day: 2, rev: 1450000, orders: 4, units: 6 },
      { day: 3, rev: 2100000, orders: 6, units: 9, note: 'Puncak Akhir Pekan' },
      { day: 4, rev: 1950000, orders: 5, units: 8, note: 'Puncak Akhir Pekan' },
      { day: 5, rev: 750000, orders: 2, units: 3 },
      { day: 6, rev: 890000, orders: 3, units: 4 },
      { day: 7, rev: 950000, orders: 3, units: 5 },
      { day: 8, rev: 1050000, orders: 3, units: 5 },
      { day: 9, rev: 1600000, orders: 4, units: 7 },
      { day: 10, rev: 2250000, orders: 7, units: 11, note: 'Puncak Akhir Pekan' },
      { day: 11, rev: 2050000, orders: 6, units: 10, note: 'Puncak Akhir Pekan' },
      { day: 12, rev: 800000, orders: 2, units: 3 },
      { day: 13, rev: 920000, orders: 3, units: 4 },
      { day: 14, rev: 1100000, orders: 3, units: 5 },
      { day: 15, rev: 1150000, orders: 4, units: 6, note: 'Pertengahan Bulan' },
      { day: 16, rev: 1700000, orders: 5, units: 8 },
      { day: 17, rev: 2300000, orders: 7, units: 11, note: 'Puncak Akhir Pekan' },
      { day: 18, rev: 2150000, orders: 6, units: 9, note: 'Puncak Akhir Pekan' },
      { day: 19, rev: 820000, orders: 2, units: 3 },
      { day: 20, rev: 980000, orders: 3, units: 5 },
      { day: 21, rev: 1050000, orders: 3, units: 5 },
      { day: 22, rev: 1250000, orders: 4, units: 7 },
      { day: 23, rev: 1850000, orders: 5, units: 9 },
      { day: 24, rev: 2750000 + (realOrdersRevenue > 0 ? realOrdersRevenue : 0), orders: 8 + realOrdersCount, units: 14 + (realOrdersCount * 2), note: 'Puncak Tertinggi (Weekend & Gajian)' },
      { day: 25, rev: 2400000, orders: 7, units: 12, note: 'Puncak Siklus Gajian' },
      { day: 26, rev: 1650000, orders: 5, units: 8, note: 'Siklus Belanja Gajian' },
      { day: 27, rev: 1550000, orders: 4, units: 7 },
      { day: 28, rev: 1450000, orders: 4, units: 7 },
      { day: 29, rev: 1300000, orders: 4, units: 6 },
      { day: 30, rev: 1950000, orders: 6, units: 10, note: 'Akhir Pekan Penutup' },
    ];

    return baseDaily.map((item, idx) => {
      const dayName = dayNames[idx % 7];
      const isWeekend = dayName === 'Sabtu' || dayName === 'Minggu' || dayName === 'Jumat';
      const isPeak = item.day === 24;
      return {
        day: item.day,
        dateStr: `${item.day < 10 ? '0' : ''}${item.day} Okt`,
        fullDate: `${dayName}, ${item.day} Oktober 2026`,
        dayName,
        revenue: item.rev,
        ordersCount: item.orders,
        unitsSold: item.units,
        isWeekend,
        isPeak,
        highlightNote: item.note,
      };
    });
  }, [realOrdersRevenue, realOrdersCount]);

  const peakDailyPoint = useMemo(() => {
    return dailySalesData.reduce((max, pt) => (pt.revenue > max.revenue ? pt : max), dailySalesData[0]);
  }, [dailySalesData]);

  const maxDailyRevenue = useMemo(() => {
    return Math.max(...dailySalesData.map((d) => d.revenue));
  }, [dailySalesData]);

  const maxDailyOrders = useMemo(() => {
    return Math.max(...dailySalesData.map((d) => d.ordersCount));
  }, [dailySalesData]);

  const totalDailyRevenue = useMemo(() => {
    return dailySalesData.reduce((sum, d) => sum + d.revenue, 0);
  }, [dailySalesData]);

  const avgDailyRevenue = Math.round(totalDailyRevenue / dailySalesData.length);

  // Weekend vs Weekday analysis
  const weekendPoints = dailySalesData.filter((d) => d.dayName === 'Sabtu' || d.dayName === 'Minggu');
  const weekdayPoints = dailySalesData.filter((d) => d.dayName !== 'Sabtu' && d.dayName !== 'Minggu');
  const avgWeekendRev = Math.round(weekendPoints.reduce((s, p) => s + p.revenue, 0) / weekendPoints.length);
  const avgWeekdayRev = Math.round(weekdayPoints.reduce((s, p) => s + p.revenue, 0) / weekdayPoints.length);
  const weekendBoostPct = Math.round(((avgWeekendRev - avgWeekdayRev) / avgWeekdayRev) * 100);

  // 4. Top-Selling Spareparts Ranking
  const topSpareparts: TopSparepartItem[] = useMemo(() => {
    const list: TopSparepartItem[] = [
      {
        id: 'top-1',
        name: 'Baterai ASUS ROG Zephyrus & TUF Gaming (4-Cell 90Wh)',
        category: 'baterai',
        compatibility: 'Asus ROG G14/G15, TUF FX505/FX506, Strix G17',
        unitsSold: 64,
        unitPrice: 580000,
        totalRevenue: 37120000,
        stockStatus: 'fast_moving',
        warrantyRate: '99.4% Lolos QC',
      },
      {
        id: 'top-2',
        name: 'Layar LCD / LED Screen 14.0 Slim Full HD IPS 30-Pin Matte',
        category: 'lcd',
        compatibility: 'Asus VivoBook, Lenovo IdeaPad, Acer Aspire, HP 14s',
        unitsSold: 42,
        unitPrice: 680000,
        totalRevenue: 28560000,
        stockStatus: 'fast_moving',
        warrantyRate: '99.8% No Dead Pixel',
      },
      {
        id: 'top-3',
        name: 'Adaptor Charger Type-C GaN 65W & 100W Fast Charge Universal',
        category: 'charger',
        compatibility: 'ThinkPad, MacBook, Dell XPS, HP Pavilion, Asus ZenBook',
        unitsSold: 58,
        unitPrice: 395000,
        totalRevenue: 22910000,
        stockStatus: 'safe',
        warrantyRate: '100% Voltase Stabil',
      },
      {
        id: 'top-4',
        name: 'RAM Laptop SODIMM DDR4 16GB 3200MHz Samsung / Crucial Original',
        category: 'ram',
        compatibility: 'Semua laptop generasi Intel Gen 8-12 & AMD Ryzen 3000-6000',
        unitsSold: 52,
        unitPrice: 480000,
        totalRevenue: 24960000,
        stockStatus: 'safe',
        warrantyRate: '100% MemTest Passed',
      },
      {
        id: 'top-5',
        name: 'Keyboard Backlight Asus TUF Gaming & Lenovo ThinkPad X1',
        category: 'keyboard',
        compatibility: 'Asus TUF A15/F15, ThinkPad T480/T490/X1 Carbon',
        unitsSold: 39,
        unitPrice: 380000,
        totalRevenue: 14820000,
        stockStatus: 'fast_moving',
        warrantyRate: '99.2% Responsive',
      },
      {
        id: 'top-6',
        name: 'SSD M.2 NVMe PCIe Gen 4x4 1TB Read 5000MB/s High Speed',
        category: 'storage',
        compatibility: 'Slot M.2 2280 NVMe Laptop & Mini PC',
        unitsSold: 24,
        unitPrice: 680000,
        totalRevenue: 16320000,
        stockStatus: 'safe',
        warrantyRate: '100% CrystalDisk Health',
      },
      {
        id: 'top-7',
        name: 'Double Cooling Fan CPU + GPU High RPM Predator & Legion',
        category: 'fan',
        compatibility: 'Acer Predator Helios 300, Lenovo Legion Y540/5',
        unitsSold: 31,
        unitPrice: 280000,
        totalRevenue: 8680000,
        stockStatus: 'low_stock',
        warrantyRate: '100% Silent Bearing',
      },
    ];

    if (sparepartCategoryFilter === 'all') return list;
    return list.filter((item) => item.category === sparepartCategoryFilter);
  }, [sparepartCategoryFilter]);

  // Total revenue of top spareparts for percentage calculation
  const totalSparepartsRevenue = useMemo(() => {
    return topSpareparts.reduce((acc, item) => acc + item.totalRevenue, 0);
  }, [topSpareparts]);

  // Categories Breakdown
  const categoryBreakdown = [
    { name: 'Baterai Laptop', percentage: 34, revenue: 'Rp 52.4 Jt', color: 'from-amber-400 to-amber-600', count: '108 Unit' },
    { name: 'Layar LCD / LED', percentage: 24, revenue: 'Rp 37.1 Jt', color: 'from-blue-400 to-indigo-600', count: '55 Unit' },
    { name: 'Charger & Adaptor', percentage: 19, revenue: 'Rp 29.3 Jt', color: 'from-emerald-400 to-teal-600', count: '74 Unit' },
    { name: 'RAM & SSD NVMe', percentage: 13, revenue: 'Rp 20.1 Jt', color: 'from-purple-400 to-fuchsia-600', count: '42 Unit' },
    { name: 'Keyboard Backlight', percentage: 10, revenue: 'Rp 15.4 Jt', color: 'from-rose-400 to-red-600', count: '41 Unit' },
  ];

  // Payment Channels Breakdown
  const paymentBreakdown = [
    { name: 'QRIS Otomatis (EMVCo/ASPI)', share: '56%', desc: 'BCA Mobile, Livin, GoPay, ShopeePay', icon: QrCode, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Transfer Bank Langsung', share: '32%', desc: 'BCA, Mandiri, BRI, BNI Verifikasi Cepat', icon: CreditCard, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { name: 'Ambil di Cabang (COD / EDC)', share: '12%', desc: 'Semarang, Solo, Madiun, Jogja', icon: Store, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ];

  // Save GA4 Config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnalytics({
      measurementId: measurementId.trim().toUpperCase(),
      enabled,
      trackPageViews,
      trackProductClicks,
      trackCartEvents,
      trackWhatsAppClicks,
    });
    showToast('Konfigurasi Google Analytics berhasil disimpan!', 'success');
  };

  // 1. Export PDF Report Offline (A4 Format)
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // Page Header Bar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 28, 'F');

      doc.setTextColor(245, 158, 11); // amber-500
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('KEVIN 88 COMPUTER', 14, 11);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Pusat Spesialis Sparepart & Servis Komponen Laptop Sejak 2014', 14, 17);
      doc.text('Semarang · Solo · Madiun · Yogyakarta · Siap Kirim Seluruh Indonesia', 14, 22);

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(8);
      doc.text(`Tanggal Cetak: ${today}`, 196, 11, { align: 'right' });
      doc.text('Dokumen Resmi Offline Owner', 196, 17, { align: 'right' });
      doc.text('ID Lap: KVN88-REP-2026', 196, 22, { align: 'right' });

      // Title & Period
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('LAPORAN ANALYTICS & PERFORMA PENJUALAN BULANAN', 14, 37);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Periode Evaluasi: Tahun 2026 (12 Bulan) · Disusun untuk Pemilik Toko (Executive Report)', 14, 43);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 46, 196, 46);

      // Section 1: KPI Summary Boxes
      let y = 52;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('1. RINGKASAN EKSEKUTIF (KEY PERFORMANCE INDICATORS)', 14, y);

      y += 4;
      const metrics = [
        { label: 'TOTAL REVENUE (OMZET)', value: formatRupiah(totalRevenue), sub: '+24.8% YoY' },
        { label: 'TOTAL TRANSAKSI / NOTA', value: `${totalOrders} Nota`, sub: '96.8% Lunas & Kirim' },
        { label: 'RATA-RATA NOTA (AOV)', value: formatRupiah(avgOrderValue), sub: 'Per Transaksi' },
        { label: 'SPAREPART TERJUAL', value: `${totalUnits} Unit`, sub: '100% Lolos Uji QC' },
      ];

      const boxWidth = 43;
      const boxHeight = 16;
      metrics.forEach((m, idx) => {
        const x = 14 + idx * 46;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(m.label, x + 3, y + 4.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(m.value, x + 3, y + 10);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(16, 185, 129); // emerald
        doc.text(m.sub, x + 3, y + 14);
      });

      // Section 2: Monthly Sales Table
      y += 23;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('2. REKAPITULASI PENJUALAN BULANAN (12 BULAN 2026)', 14, y);

      y += 3.5;
      // Header Table
      doc.setFillColor(15, 23, 42);
      doc.rect(14, y, 182, 5.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('BULAN', 16, y + 3.8);
      doc.text('OMZET PENDAPATAN', 58, y + 3.8);
      doc.text('NOTA', 98, y + 3.8);
      doc.text('UNIT', 116, y + 3.8);
      doc.text('PERTUMBUHAN', 134, y + 3.8);
      doc.text('KATEGORI UNGGULAN', 160, y + 3.8);

      y += 5.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      monthlySales.forEach((m, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, 182, 4.6, 'F');
        }
        doc.setTextColor(15, 23, 42);
        doc.text(m.fullName, 16, y + 3.4);
        doc.text(formatRupiah(m.revenue), 58, y + 3.4);
        doc.text(`${m.ordersCount} Nota`, 98, y + 3.4);
        doc.text(`${m.unitsSold} Unit`, 116, y + 3.4);

        doc.setTextColor(16, 185, 129);
        doc.text(`+${m.growthMoM}%`, 134, y + 3.4);

        doc.setTextColor(100, 116, 139);
        doc.text(m.topCategory, 160, y + 3.4);

        y += 4.6;
      });

      // Total row
      doc.setFillColor(254, 243, 199); // amber-100
      doc.rect(14, y, 182, 5.5, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL AKUMULASI (12 BULAN)', 16, y + 3.8);
      doc.text(formatRupiah(totalRevenue), 58, y + 3.8);
      doc.text(`${totalOrders} Nota`, 98, y + 3.8);
      doc.text(`${totalUnits} Unit`, 116, y + 3.8);
      doc.text('+13.4% Rata-rata', 134, y + 3.8);
      doc.text('Semua Suku Cadang', 160, y + 3.8);

      // Section 3: Top Spareparts Ranking
      y += 10.5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('3. PERINGKAT SUKU CADANG TERLARIS (TOP-SELLING SPAREPARTS)', 14, y);

      y += 3.5;
      doc.setFillColor(15, 23, 42);
      doc.rect(14, y, 182, 5.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('RANK', 16, y + 3.8);
      doc.text('NAMA SUKU CADANG & KOMPATIBILITAS', 28, y + 3.8);
      doc.text('HARGA SATUAN', 115, y + 3.8);
      doc.text('TERJUAL', 142, y + 3.8);
      doc.text('TOTAL OMZET', 165, y + 3.8);

      y += 5.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      topSpareparts.slice(0, 6).forEach((item, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, 182, 4.8, 'F');
        }
        doc.setTextColor(217, 119, 6);
        doc.setFont('helvetica', 'bold');
        doc.text(`#${idx + 1}`, 16, y + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        const nameShort = item.name.length > 50 ? item.name.substring(0, 50) + '...' : item.name;
        doc.text(nameShort, 28, y + 3.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(formatRupiah(item.unitPrice), 115, y + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${item.unitsSold} Unit`, 142, y + 3.5);

        doc.setTextColor(217, 119, 6);
        doc.text(formatRupiah(item.totalRevenue), 165, y + 3.5);

        y += 4.8;
      });

      // Section 4: Signature & Footer
      y += 8;
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y, 196, y);

      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Laporan ini dihasilkan otomatis oleh Sistem Inventaris & Analytics Kevin 88 Computer untuk arsip offline.', 14, y);
      doc.text(`Semarang, ${today}`, 196, y, { align: 'right' });

      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Disetujui oleh Pemilik Toko:', 14, y);
      doc.text('Penanggung Jawab QC Lab:', 196, y, { align: 'right' });

      y += 11;
      doc.setDrawColor(15, 23, 42);
      doc.line(14, y, 62, y);
      doc.line(148, y, 196, y);

      y += 3.5;
      doc.setFont('helvetica', 'bold');
      doc.text('Kevin Dio (Owner)', 14, y);
      doc.text('Teknisi QC Kevin 88', 196, y, { align: 'right' });

      // Save PDF Offline
      doc.save(`Laporan_Analytics_Kevin88_${new Date().toISOString().slice(0, 10)}.pdf`);
      showToast('Laporan PDF resmi berhasil diunduh secara offline!', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Gagal membuat file PDF. Silakan gunakan ekspor CSV.', 'error');
    }
  };

  // 2. Export CSV / Excel Report Offline
  const handleExportCSV = () => {
    try {
      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const csvRows = [
        ['========================================================================'],
        ['LAPORAN ANALYTICS & PERFORMA PENJUALAN BULANAN - KEVIN 88 COMPUTER'],
        ['========================================================================'],
        ['Nama Toko', 'Kevin 88 Computer (Spesialis Sparepart Laptop Sejak 2014)'],
        ['Tanggal Cetak', today],
        ['Periode Evaluasi', 'Tahun 2026 (12 Bulan)'],
        ['Status Dokumen', 'Arsip Laporan Offline Pemilik Toko (Owner)'],
        ['Cabang Resmi', 'Semarang, Solo, Madiun, Yogyakarta'],
        [],
        ['--- 1. RINGKASAN EKSEKUTIF (KEY PERFORMANCE INDICATORS) ---'],
        ['Indikator Metrik', 'Nilai Angka', 'Keterangan'],
        ['Total Revenue (Omzet)', totalRevenue.toString(), formatRupiah(totalRevenue)],
        ['Total Transaksi Masuk', totalOrders.toString(), '96.8% Lunas & Selesai'],
        ['Rata-Rata Nilai Nota (AOV)', avgOrderValue.toString(), formatRupiah(avgOrderValue)],
        ['Total Suku Cadang Terjual', totalUnits.toString(), '100% Lolos Pengujian QC Lab'],
        ['Rata-rata Penjualan Bulanan', avgMonthlyRevenue.toString(), formatRupiah(avgMonthlyRevenue)],
        ['Pertumbuhan Omzet Tahunan', '+24.8%', 'YoY Growth'],
        [],
        ['--- 2. REKAPITULASI PENJUALAN BULANAN (12 BULAN 2026) ---'],
        ['Kode Bulan', 'Nama Bulan', 'Omzet Penjualan (IDR)', 'Format Rupiah', 'Jumlah Nota', 'Unit Terjual', 'Pertumbuhan MoM (%)', 'Kategori Terlaris'],
        ...monthlySales.map((m) => [
          m.month,
          m.fullName,
          m.revenue.toString(),
          formatRupiah(m.revenue),
          m.ordersCount.toString(),
          m.unitsSold.toString(),
          `+${m.growthMoM}%`,
          m.topCategory,
        ]),
        [],
        ['--- 2B. TREN PENJUALAN HARIAN (30 HARI TERAKHIR) ---'],
        ['Tanggal', 'Hari', 'Omzet Harian (IDR)', 'Format Rupiah', 'Jumlah Nota', 'Unit Terjual', 'Pola Hari'],
        ...dailySalesData.map((d) => [
          d.dateStr,
          d.dayName,
          d.revenue.toString(),
          formatRupiah(d.revenue),
          d.ordersCount.toString(),
          d.unitsSold.toString(),
          d.isPeak ? 'PUNCAK BULANAN (PEAK)' : d.isWeekend ? 'Akhir Pekan (Weekend)' : 'Hari Kerja Biasa',
        ]),
        [],
        ['--- 3. PERINGKAT SUKU CADANG TERLARIS (TOP-SELLING SPAREPARTS) ---'],
        ['Peringkat', 'Nama Suku Cadang', 'Kategori', 'Kompatibilitas Model', 'Harga Satuan (IDR)', 'Unit Terjual', 'Total Omzet (IDR)', 'Status Inventaris', 'Tingkat QC'],
        ...topSpareparts.map((s, idx) => [
          `#${idx + 1}`,
          s.name,
          s.category,
          s.compatibility,
          s.unitPrice.toString(),
          s.unitsSold.toString(),
          s.totalRevenue.toString(),
          s.stockStatus === 'fast_moving' ? 'Fast Moving' : s.stockStatus === 'low_stock' ? 'Perlu Restock' : 'Stok Aman',
          s.warrantyRate,
        ]),
        [],
        ['--- 4. DISTRIBUSI KOMPOSISI KATEGORI SPAREPART ---'],
        ['Kategori Sparepart', 'Persentase Omzet', 'Estimasi Nilai', 'Unit Terjual'],
        ...categoryBreakdown.map((c) => [
          c.name,
          `${c.percentage}%`,
          c.revenue,
          c.count,
        ]),
        [],
        ['--- 5. METODE PEMBAYARAN TERFAVORIT ---'],
        ['Saluran Pembayaran', 'Pangsa Transaksi', 'Keterangan'],
        ...paymentBreakdown.map((p) => [
          p.name,
          p.share,
          p.desc,
        ]),
      ];

      // UTF-8 BOM for Microsoft Excel compatibility
      const BOM = '\uFEFF';
      const csvContent =
        BOM +
        csvRows
          .map((row) => row.map((cell) => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
          .join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Laporan_Analytics_Kevin88_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Laporan CSV / Excel berhasil diunduh secara offline!', 'success');
    } catch (err) {
      console.error('Error generating CSV:', err);
      showToast('Gagal membuat file CSV.', 'error');
    }
  };

  if (!isAnalyticsModalOpen) return null;

  const currentSelectedMonth = monthlySales[selectedMonthIndex] || monthlySales[monthlySales.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md font-bold">
              <BarChart3 className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Dasbor Analytics & Penjualan Owner
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Metrics
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pantau total revenue, tren pertumbuhan bulanan, dan ranking suku cadang laptop terlaris di Kevin 88
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-rose-950/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Unduh Laporan Format PDF Resmi (A4 Siap Cetak & Arsip Offline)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Unduh Laporan Format CSV / Spreadsheet Excel Offline"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>

            <button
              onClick={refreshAnalytics}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Perbarui Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={closeAnalyticsModal}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup Dasbor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-6 bg-slate-950/50 text-xs font-semibold">
          <div className="flex">
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-3 mr-6 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sales'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>1. Revenue & Pertumbuhan Bulanan</span>
            </button>
            <button
              onClick={() => setActiveTab('spareparts')}
              className={`py-3 mr-6 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'spareparts'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>2. Sparepart Terlaris</span>
            </button>
            <button
              onClick={() => setActiveTab('traffic')}
              className={`py-3 mr-6 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'traffic'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>3. Trafik Web & Kunjungan</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'config'
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>4. Pengaturan Google Tag (GA4)</span>
            </button>
          </div>

          {/* Timeframe Selector Pill (For Sales Tab) */}
          {activeTab === 'sales' && (
            <div className="py-2 flex items-center gap-1">
              <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Rentang Waktu:</span>
              </span>
              {[
                { id: 'year_2026', label: 'Tahun 2026 (12 Bln)' },
                { id: 'q3_q4', label: 'Semester 2 (Q3-Q4)' },
                { id: 'recent_3m', label: '3 Bulan Terakhir' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setSelectedTimeframe(tf.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedTimeframe === tf.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/60">
          {/* TAB 1: REVENUE & MONTHLY SALES GROWTH (BAR CHART) */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              {/* 1. Key Performance Indicators (KPI Cards) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-xl p-4 space-y-1.5 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Total Revenue (Omzet)</span>
                    <span className="p-1 rounded-md bg-amber-400/20 text-amber-400">
                      <DollarSign className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                    {formatRupiah(totalRevenue)}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>+24.8% YoY</span>
                    </span>
                    <span className="text-slate-400 font-mono">100% Tercatat</span>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Total Transaksi</span>
                    <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                      <PackageCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                    {totalOrders.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-400 font-sans">Nota</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-emerald-400 font-medium">96.8% Lunas & Terkirim</span>
                    <span className="text-slate-500 font-mono">Toko & Online</span>
                  </div>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Rata-rata Nilai Nota</span>
                    <span className="p-1 rounded-md bg-purple-500/20 text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                    {formatRupiah(avgOrderValue)}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-purple-300 font-medium">Nilai Pembelian / Nota</span>
                    <span className="text-slate-500 font-mono">AOV</span>
                  </div>
                </div>

                {/* Total Units Sold */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Suku Cadang Terjual</span>
                    <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                    {totalUnits.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-normal text-slate-400 font-sans">Unit</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-emerald-400 font-medium">Lolos Uji QC Lab</span>
                    <span className="text-slate-500 font-mono">100% Segel</span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Monthly Sales Growth Bar Chart */}
              <div className="bg-slate-950/90 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                        <span>Grafik Batang Pertumbuhan Penjualan Bulanan (2026)</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Monthly Growth Bar Chart
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Klik salah satu batang bulan untuk melihat rincian omzet, pertumbuhan MoM, dan kategori produk unggulan
                    </p>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-amber-600 to-amber-400"></span>
                      <span>Omzet Penjualan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-emerald-600 to-teal-400"></span>
                      <span>Bulan Puncak (Peak)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-0.5 bg-dashed border-t border-dashed border-amber-400/60"></span>
                      <span>Rata-rata ({formatRupiah(avgMonthlyRevenue).slice(0, 8)} Jt)</span>
                    </div>
                  </div>
                </div>

                {/* THE BAR CHART VISUALIZATION */}
                <div className="pt-4 pb-2">
                  <div className="relative h-64 sm:h-72 w-full flex items-end justify-between gap-1.5 sm:gap-3 px-1 sm:px-4">
                    {/* Horizontal Reference Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-600">
                      <div className="border-b border-slate-800/60 w-full flex items-center justify-between pr-2">
                        <span>{formatRupiah(maxRevenue).slice(0, 7)} Jt</span>
                      </div>
                      <div className="border-b border-slate-800/60 w-full flex items-center justify-between pr-2">
                        <span>{formatRupiah(maxRevenue * 0.75).slice(0, 7)} Jt</span>
                      </div>
                      <div className="border-b border-slate-800/60 w-full flex items-center justify-between pr-2">
                        <span>{formatRupiah(maxRevenue * 0.5).slice(0, 7)} Jt</span>
                      </div>
                      <div className="border-b border-slate-800/60 w-full flex items-center justify-between pr-2">
                        <span>{formatRupiah(maxRevenue * 0.25).slice(0, 7)} Jt</span>
                      </div>
                      <div className="border-b border-slate-700/80 w-full flex items-center justify-between pr-2">
                        <span>Rp 0</span>
                      </div>
                    </div>

                    {/* Target Average Horizontal Line */}
                    <div
                      className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400/40 pointer-events-none z-10 transition-all duration-300"
                      style={{
                        bottom: `${(avgMonthlyRevenue / maxRevenue) * 100}%`,
                      }}
                    >
                      <span className="absolute right-2 -top-2.5 px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 font-mono text-[9px] border border-amber-500/30">
                        Target Rata-rata
                      </span>
                    </div>

                    {/* Vertical Month Bars */}
                    {monthlySales.map((item, idx) => {
                      const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 100));
                      const isPeak = item.revenue === peakMonth.revenue;
                      const isSelected = selectedMonthIndex === idx;

                      return (
                        <div
                          key={item.month}
                          onClick={() => setSelectedMonthIndex(idx)}
                          className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer z-20"
                        >
                          {/* Value Tag on Hover / Selected */}
                          <div
                            className={`absolute -top-10 transition-all duration-200 transform pointer-events-none whitespace-nowrap z-30 ${
                              isSelected
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-1'
                            }`}
                          >
                            <div className="px-2 py-1 rounded-md bg-slate-950 border border-amber-400 text-amber-300 font-mono text-[10px] font-bold shadow-xl">
                              {(item.revenue / 1000000).toFixed(1)} Jt
                            </div>
                          </div>

                          {/* The Bar Element */}
                          <div
                            className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 relative overflow-hidden ${
                              isPeak
                                ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 shadow-lg shadow-emerald-500/20'
                                : isSelected
                                ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 shadow-lg shadow-amber-400/30 ring-2 ring-white/50'
                                : 'bg-gradient-to-t from-amber-700/80 via-amber-600/90 to-amber-500 hover:from-amber-600 hover:to-amber-400'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          >
                            {/* Inner Shine Effect */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-white/40"></div>

                            {/* Peak Star Badge */}
                            {isPeak && (
                              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-950 bg-white/90 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                                ★
                              </div>
                            )}
                          </div>

                          {/* Month Label Under Bar */}
                          <div className="mt-2 text-center">
                            <span
                              className={`text-[11px] font-bold font-mono transition-colors block ${
                                isSelected
                                  ? 'text-amber-400 font-black scale-105'
                                  : isPeak
                                  ? 'text-emerald-400 font-extrabold'
                                  : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            >
                              {item.month}
                            </span>
                            <span className="hidden sm:block text-[9px] text-slate-500 font-mono">
                              +{item.growthMoM}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Month Inspector Card */}
                {currentSelectedMonth && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-sm">
                        📅
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">
                            {currentSelectedMonth.fullName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>+{currentSelectedMonth.growthMoM}% vs Bulan Lalu</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Kategori Paling Diminati:{' '}
                          <span className="text-amber-400 font-semibold">{currentSelectedMonth.topCategory}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-right sm:text-left">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Omzet Bulan Ini</span>
                        <span className="font-mono font-extrabold text-white text-sm text-amber-400">
                          {formatRupiah(currentSelectedMonth.revenue)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Jumlah Nota</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {currentSelectedMonth.ordersCount} Nota
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Unit Terjual</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {currentSelectedMonth.unitsSold} Unit
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Growth Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[11px] block">🏆 Bulan Penjualan Tertinggi:</span>
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{peakMonth.fullName}</span>
                      <span className="font-mono text-emerald-400">{formatRupiah(peakMonth.revenue)}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[11px] block">📊 Rata-Rata Penjualan Bulanan:</span>
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>Konsisten Positif</span>
                      <span className="font-mono text-amber-400">{formatRupiah(avgMonthlyRevenue)} / bln</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[11px] block">🚀 Laju Pertumbuhan Rata-rata:</span>
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>Tren Naik (Bullish)</span>
                      <span className="font-mono text-emerald-400 font-bold">+13.4% MoM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2B. Daily Sales Trend Line Chart (Grafik Garis Tren Penjualan Harian) */}
              {(() => {
                const plotWidth = 720;
                const plotHeight = 160;
                const paddingLeft = 55;
                const paddingTop = 25;
                const svgWidth = 800;
                const svgHeight = 230;

                const maxDailyMetricVal =
                  dailyMetric === 'revenue'
                    ? Math.max(...dailySalesData.map((d) => d.revenue)) * 1.12
                    : Math.max(...dailySalesData.map((d) => d.ordersCount)) * 1.25;

                const dailyPoints = dailySalesData.map((d, idx) => {
                  const x = paddingLeft + (idx / (dailySalesData.length - 1)) * plotWidth;
                  const val = dailyMetric === 'revenue' ? d.revenue : d.ordersCount;
                  const y = paddingTop + (1 - val / (maxDailyMetricVal || 1)) * plotHeight;
                  return { x, y, data: d, index: idx };
                });

                const linePathD = dailyPoints.reduce((acc, pt, i) => {
                  return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                }, '');

                const areaPathD = `${linePathD} L ${dailyPoints[dailyPoints.length - 1].x} ${
                  paddingTop + plotHeight
                } L ${dailyPoints[0].x} ${paddingTop + plotHeight} Z`;

                const activePoint =
                  hoveredDayIndex !== null
                    ? dailyPoints[hoveredDayIndex]
                    : dailyPoints[selectedDayIndex] || dailyPoints[23];

                const selectedPointData = activePoint.data;

                return (
                  <div className="bg-slate-950/90 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                            <LineChart className="w-4 h-4 text-emerald-400" />
                            <span>Grafik Garis Tren Penjualan Harian (30 Hari Terakhir)</span>
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Daily Line Chart
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Identifikasi pola hari dengan transaksi tertinggi: weekend, hari kerja biasa, dan siklus belanja gajian
                        </p>
                      </div>

                      {/* Toggle Metric & Legend */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                          <button
                            type="button"
                            onClick={() => setDailyMetric('revenue')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                              dailyMetric === 'revenue'
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Omzet (Rupiah)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDailyMetric('orders')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                              dailyMetric === 'orders'
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Jumlah Nota
                          </button>
                        </div>

                        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-1 bg-amber-400 rounded-full"></span>
                            <span>Tren Harian</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span>Puncak Tertinggi (Peak)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80"></span>
                            <span>Akhir Pekan</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SVG Line Chart */}
                    <div className="relative w-full overflow-hidden select-none">
                      <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="w-full h-auto max-h-72 overflow-visible"
                      >
                        <defs>
                          {/* Gradient for Line Stroke */}
                          <linearGradient id="dailyLineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="85%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>

                          {/* Gradient for Area Fill Under Line */}
                          <linearGradient id="dailyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Y-Axis Horizontal Grid Lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                          const y = paddingTop + (1 - ratio) * plotHeight;
                          const labelVal =
                            dailyMetric === 'revenue'
                              ? ((maxDailyMetricVal * ratio) / 1000000).toFixed(1) + ' Jt'
                              : Math.round(maxDailyMetricVal * ratio).toString();

                          return (
                            <g key={idx}>
                              <line
                                x1={paddingLeft}
                                y1={y}
                                x2={paddingLeft + plotWidth}
                                y2={y}
                                stroke="rgba(51, 65, 85, 0.4)"
                                strokeDasharray={ratio === 0 ? undefined : '3 3'}
                              />
                              <text
                                x={paddingLeft - 8}
                                y={y + 3.5}
                                textAnchor="end"
                                className="fill-slate-500 font-mono text-[9px]"
                              >
                                {labelVal}
                              </text>
                            </g>
                          );
                        })}

                        {/* Area Gradient Fill Under Curve */}
                        <path d={areaPathD} fill="url(#dailyAreaGrad)" />

                        {/* Main Glowing Smooth Line */}
                        <path
                          d={linePathD}
                          fill="none"
                          stroke="url(#dailyLineGrad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
                        />

                        {/* Weekend Highlight Column Backgrounds */}
                        {dailyPoints.map((pt) => {
                          if (!pt.data.isWeekend) return null;
                          const colW = plotWidth / (dailySalesData.length - 1);
                          return (
                            <rect
                              key={`bg-${pt.data.day}`}
                              x={pt.x - colW / 2}
                              y={paddingTop}
                              width={colW}
                              height={plotHeight}
                              fill="rgba(59, 130, 246, 0.04)"
                              pointerEvents="none"
                            />
                          );
                        })}

                        {/* Active / Hover Crosshair Guide Line */}
                        {activePoint && (
                          <g pointerEvents="none">
                            <line
                              x1={activePoint.x}
                              y1={paddingTop}
                              x2={activePoint.x}
                              y2={paddingTop + plotHeight}
                              stroke="#f59e0b"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              className="transition-all duration-150"
                            />
                            <circle
                              cx={activePoint.x}
                              cy={activePoint.y}
                              r="8"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2"
                              className="animate-ping opacity-60"
                            />
                          </g>
                        )}

                        {/* Data Point Circles and Hitboxes */}
                        {dailyPoints.map((pt, idx) => {
                          const isSelected = activePoint.index === idx;
                          const isPeak = pt.data.isPeak;
                          const isWeekend = pt.data.isWeekend;

                          return (
                            <g
                              key={pt.data.day}
                              className="cursor-pointer"
                              onClick={() => setSelectedDayIndex(idx)}
                              onMouseEnter={() => setHoveredDayIndex(idx)}
                              onMouseLeave={() => setHoveredDayIndex(null)}
                            >
                              {/* Transparent Wide Hitbox for Easy Clicking/Hovering */}
                              <rect
                                x={pt.x - plotWidth / (dailySalesData.length * 2)}
                                y={paddingTop}
                                width={plotWidth / dailySalesData.length}
                                height={plotHeight}
                                fill="transparent"
                              />

                              {/* Peak Day Glow Halo */}
                              {isPeak && (
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="9"
                                  fill="rgba(239, 68, 68, 0.25)"
                                  stroke="rgba(239, 68, 68, 0.6)"
                                  strokeWidth="1.5"
                                />
                              )}

                              {/* Node Circle */}
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isSelected ? 6 : isPeak ? 5 : isWeekend ? 3.5 : 2.5}
                                fill={
                                  isSelected
                                    ? '#ffffff'
                                    : isPeak
                                    ? '#ef4444'
                                    : isWeekend
                                    ? '#3b82f6'
                                    : '#f59e0b'
                                }
                                stroke={
                                  isSelected
                                    ? '#f59e0b'
                                    : isPeak
                                    ? '#ffffff'
                                    : '#0f172a'
                                }
                                strokeWidth={isSelected ? 3 : 1.5}
                                className="transition-all duration-150"
                              />
                            </g>
                          );
                        })}

                        {/* X-Axis Date Markers */}
                        {dailyPoints.map((pt, idx) => {
                          // Show label on days 1, 5, 10, 15, 20, 24, 30
                          const shouldShowLabel =
                            idx === 0 ||
                            idx === 4 ||
                            idx === 9 ||
                            idx === 14 ||
                            idx === 19 ||
                            idx === 23 ||
                            idx === 29;

                          if (!shouldShowLabel) return null;

                          const isPeak = pt.data.isPeak;

                          return (
                            <g key={`lbl-${pt.data.day}`}>
                              <line
                                x1={pt.x}
                                y1={paddingTop + plotHeight}
                                x2={pt.x}
                                y2={paddingTop + plotHeight + 4}
                                stroke="rgba(100, 116, 139, 0.6)"
                              />
                              <text
                                x={pt.x}
                                y={paddingTop + plotHeight + 15}
                                textAnchor="middle"
                                className={`text-[10px] font-mono ${
                                  isPeak
                                    ? 'fill-rose-400 font-extrabold'
                                    : 'fill-slate-400'
                                }`}
                              >
                                {pt.data.dateStr}
                              </text>
                              <text
                                x={pt.x}
                                y={paddingTop + plotHeight + 25}
                                textAnchor="middle"
                                className={`text-[8.5px] ${
                                  pt.data.isWeekend
                                    ? 'fill-blue-400 font-bold'
                                    : 'fill-slate-500'
                                }`}
                              >
                                {pt.data.dayName.slice(0, 3)}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Inspector Card for Selected Day */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            selectedPointData.isPeak
                              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                              : selectedPointData.isWeekend
                              ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                              : 'bg-amber-400/20 border border-amber-400/40 text-amber-300'
                          }`}
                        >
                          {selectedPointData.isPeak ? '🔥' : selectedPointData.isWeekend ? '🏖️' : '💼'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">
                              {selectedPointData.fullDate}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                                selectedPointData.isPeak
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                  : selectedPointData.isWeekend
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {selectedPointData.isPeak
                                ? 'PUNCAK BULANAN (PEAK)'
                                : selectedPointData.isWeekend
                                ? 'AKHIR PEKAN (WEEKEND)'
                                : 'HARI KERJA (WEEKDAY)'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Status:{' '}
                            <span className="text-amber-400 font-semibold">
                              {selectedPointData.highlightNote || 'Aktivitas transaksi normal'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-right sm:text-left">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Omzet Hari Ini</span>
                          <span className="font-mono font-extrabold text-amber-400 text-sm">
                            {formatRupiah(selectedPointData.revenue)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Transaksi</span>
                          <span className="font-mono font-bold text-white text-sm">
                            {selectedPointData.ordersCount} Nota
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Unit Sparepart</span>
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {selectedPointData.unitsSold} Unit
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pattern Insights Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* Peak Day Card */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-rose-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            <span>Hari Transaksi Tertinggi</span>
                          </span>
                          <span className="font-mono text-[10px] bg-rose-500/20 px-1.5 py-0.2 rounded border border-rose-500/30">
                            PEAK
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm">{peakDailyPoint.fullDate}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Omzet:{' '}
                          <span className="font-mono text-amber-400 font-bold">
                            {formatRupiah(peakDailyPoint.revenue)}
                          </span>{' '}
                          dari <strong>{peakDailyPoint.ordersCount} Nota</strong> ({peakDailyPoint.unitsSold} Unit).
                          Dipicu momen gajian & akhir pekan.
                        </p>
                      </div>

                      {/* Weekend vs Weekday Pattern */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-blue-500/30 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-blue-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Pola Akhir Pekan (Weekend)</span>
                          </span>
                          <span className="font-mono text-[10px] bg-blue-500/20 px-1.5 py-0.2 rounded border border-blue-500/30">
                            +{weekendBoostPct}%
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm">Sabtu & Minggu Paling Ramai</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Rata-rata{' '}
                          <span className="text-white font-mono font-semibold">
                            {formatRupiah(avgWeekendRev)}
                          </span>
                          /hari vs{' '}
                          <span className="text-slate-400 font-mono">
                            {formatRupiah(avgWeekdayRev)}
                          </span>
                          /hari kerja. Pelanggan servis laptop saat libur.
                        </p>
                      </div>

                      {/* Payday Cycle Pattern */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Siklus Belanja Gajian</span>
                          </span>
                          <span className="font-mono text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                            Tgl 24–28
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm">Lonjakan Komponen Premium</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Peningkatan order baterai laptop gaming ROG/TUF, layar IPS Full HD, dan SSD NVMe
                          1TB sebesar <strong>+45%</strong> di akhir bulan.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Top-Selling Spareparts Snapshot & Categories Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Top 5 Spareparts Snapshot */}
                <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Suku Cadang Terlaris (Top 4)</span>
                    </h4>
                    <button
                      onClick={() => setActiveTab('spareparts')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      Lihat Semua Ranking →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topSpareparts.slice(0, 4).map((item, idx) => {
                      const sharePct = Math.round((item.totalRevenue / totalSparepartsRevenue) * 100);
                      return (
                        <div key={item.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                                  idx === 0
                                    ? 'bg-amber-400 text-slate-950'
                                    : idx === 1
                                    ? 'bg-slate-300 text-slate-950'
                                    : idx === 2
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                #{idx + 1}
                              </span>
                              <div>
                                <div className="text-xs font-bold text-white line-clamp-1">{item.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{item.compatibility}</div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-mono font-bold text-amber-400 text-xs">
                                {formatRupiah(item.totalRevenue)}
                              </div>
                              <div className="text-[10px] text-slate-400">{item.unitsSold} Unit Terjual</div>
                            </div>
                          </div>

                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
                              style={{ width: `${sharePct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Revenue Breakdown & Payment Channels */}
                <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Distribusi Omzet Kategori Sparepart</span>
                  </h4>

                  <div className="space-y-3">
                    {categoryBreakdown.map((cat) => (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{cat.name}</span>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-slate-400 text-[11px]">{cat.count}</span>
                            <span className="font-bold text-white">{cat.revenue}</span>
                            <span className="text-amber-400 font-bold">({cat.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className={`bg-gradient-to-r ${cat.color} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Channel Pill Overview */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 mb-2">Metode Pembayaran Paling Diminati:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {paymentBreakdown.map((pm) => {
                        const Icon = pm.icon;
                        return (
                          <div key={pm.name} className={`p-2.5 rounded-xl border ${pm.color} space-y-1`}>
                            <div className="flex items-center justify-between">
                              <Icon className="w-3.5 h-3.5" />
                              <span className="font-mono font-bold text-xs">{pm.share}</span>
                            </div>
                            <div className="text-[10px] font-bold line-clamp-1">{pm.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Dedicated Offline Export & Archive Card (PDF & CSV) */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      <Download className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Simpan & Ekspor Laporan Penjualan Secara Offline
                      </h4>
                      <p className="text-xs text-slate-400">
                        Unduh laporan performa bulanan dan suku cadang terlaris ke laptop/komputer untuk diarsipkan secara offline tanpa butuh koneksi internet
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 w-fit font-bold">
                    ✓ Tersimpan Offline
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* PDF Card */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 hover:border-rose-400 transition-colors space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                          FORMAT DOKUMEN .PDF
                        </span>
                        <FileText className="w-5 h-5 text-rose-400" />
                      </div>
                      <div className="font-extrabold text-white text-sm">
                        Laporan Resmi PDF (Siap Cetak A4)
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Dokumen formal A4 lengkap dengan kop resmi Kevin 88 Computer, tabel KPI omzet, rekapitulasi penjualan 12 bulan, ranking sparepart terlaris, dan lembar pengesahan tanda tangan toko.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportPDF}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Laporan Format PDF (.pdf)</span>
                    </button>
                  </div>

                  {/* CSV Card */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 transition-colors space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                          FORMAT DATA .CSV / EXCEL
                        </span>
                        <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="font-extrabold text-white text-sm">
                        Spreadsheet CSV (Microsoft Excel)
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        File data tabular berstandar UTF-8 BOM yang dapat langsung dibuka dan diolah di Excel, Google Sheets, atau aplikasi pembukuan toko untuk analisis keuangan mendalam.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Data Format CSV (.csv)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOP-SELLING SPAREPARTS FULL LIST */}
          {activeTab === 'spareparts' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Daftar Lengkap Suku Cadang Terlaris (Best-Selling Spareparts)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Data diurutkan berdasarkan akumulasi omzet pendapatan dan total unit suku cadang yang terjual
                  </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
                  {[
                    { id: 'all', label: 'Semua Kategori' },
                    { id: 'baterai', label: 'Baterai' },
                    { id: 'charger', label: 'Charger' },
                    { id: 'lcd', label: 'Layar LCD' },
                    { id: 'keyboard', label: 'Keyboard' },
                    { id: 'ram', label: 'RAM / SSD' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSparepartCategoryFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        sparepartCategoryFilter === f.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spareparts Ranking Table */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Peringkat</th>
                      <th className="py-3.5 px-4">Nama Suku Cadang & Kompatibilitas</th>
                      <th className="py-3.5 px-4 text-right">Harga Satuan</th>
                      <th className="py-3.5 px-4 text-right">Terjual</th>
                      <th className="py-3.5 px-4 text-right">Total Omzet</th>
                      <th className="py-3.5 px-4 text-center">Status Stok</th>
                      <th className="py-3.5 px-4 text-center">Tingkat QC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {topSpareparts.map((item, index) => {
                      const sharePct = Math.round((item.totalRevenue / totalSparepartsRevenue) * 100);
                      return (
                        <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold">
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                                index === 0
                                  ? 'bg-amber-400 text-slate-950 font-black'
                                  : index === 1
                                  ? 'bg-slate-300 text-slate-950 font-black'
                                  : index === 2
                                  ? 'bg-amber-700 text-white font-bold'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              #{index + 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{item.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {item.compatibility}
                            </div>
                            <div className="w-48 bg-slate-900 rounded-full h-1.5 mt-1.5 overflow-hidden border border-slate-800">
                              <div
                                className="bg-amber-400 h-full rounded-full"
                                style={{ width: `${sharePct}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                            {formatRupiah(item.unitPrice)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                            {item.unitsSold} Unit
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-extrabold text-amber-400 text-sm">
                            {formatRupiah(item.totalRevenue)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {item.stockStatus === 'fast_moving' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                                ⚡ Fast Moving
                              </span>
                            ) : item.stockStatus === 'low_stock' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                                ⚠️ Perlu Restock
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                                ✓ Stok Aman
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-300">
                            <span className="text-emerald-400 font-semibold">{item.warrantyRate}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TRAFFIC & GOOGLE ANALYTICS */}
          {activeTab === 'traffic' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Pageviews</span>
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {analyticsSummary.totalPageViews.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18.4% minggu ini</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Pengunjung Unik</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {analyticsSummary.totalVisitors.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Pelanggan aktif toko</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Produk Dilihat</span>
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {analyticsSummary.totalProductViews.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-purple-300 font-medium">Interaksi katalog</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Klik WhatsApp CS</span>
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {analyticsSummary.totalWhatsAppClicks.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-medium">Konversi chat teknisi</div>
                </div>
              </div>

              {/* Top Viewed Pages */}
              <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Seksi Website Paling Banyak Dilihat Pelanggan</span>
                </h4>

                <div className="space-y-2.5">
                  {Object.values(analyticsSummary.pageMetrics || {})
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 5)
                    .map((page, idx) => {
                      const maxViews = 100;
                      const percentage = Math.min(100, Math.round((page.views / maxViews) * 100));
                      return (
                        <div key={page.pagePath} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">
                              #{idx + 1} {page.pageTitle}
                              <span className="text-[11px] text-slate-500 font-mono ml-2">{page.pagePath}</span>
                            </span>
                            <span className="font-bold text-amber-400 font-mono">
                              {page.views.toLocaleString('id-ID')} views
                            </span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIGURATION */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>ID Pengukuran Google Analytics 4 (GA4)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Masukkan Measurement ID resmi dari Google Analytics Anda (berawalan G-)
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Measurement ID (GA4)</label>
                  <input
                    type="text"
                    value={measurementId}
                    onChange={(e) => setMeasurementId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400 uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Event yang Dipantau Otomatis:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackPageViews}
                      onChange={(e) => setTrackPageViews(e.target.checked)}
                      className="rounded border-slate-700 text-amber-400 focus:ring-amber-400"
                    />
                    <span>Lacak Kunjungan Halaman & Seksi</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackProductClicks}
                      onChange={(e) => setTrackProductClicks(e.target.checked)}
                      className="rounded border-slate-700 text-amber-400 focus:ring-amber-400"
                    />
                    <span>Lacak Klik Produk Sparepart</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackCartEvents}
                      onChange={(e) => setTrackCartEvents(e.target.checked)}
                      className="rounded border-slate-700 text-amber-400 focus:ring-amber-400"
                    />
                    <span>Lacak Tambah ke Keranjang & Checkout</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trackWhatsAppClicks}
                      onChange={(e) => setTrackWhatsAppClicks(e.target.checked)}
                      className="rounded border-slate-700 text-amber-400 focus:ring-amber-400"
                    />
                    <span>Lacak Klik Konsultasi WhatsApp Teknisi</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Dasbor eksekutif bisnis Kevin 88 Computer — data diperbarui secara otomatis.</span>
          </div>
          <button
            onClick={closeAnalyticsModal}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
