import { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { SiteProvider, useSiteData } from './context/SiteContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProductCatalog } from './components/ProductCatalog';
import { BranchesSection } from './components/BranchesSection';
import { WarrantyCheckSection } from './components/WarrantyCheckSection';
import { FaqSection } from './components/FaqSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ConsultationModal } from './components/ConsultationModal';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { QrisPaymentModal } from './components/QrisPaymentModal';
import { OrdersHistoryModal } from './components/OrdersHistoryModal';
import { ProductCompareBar } from './components/ProductCompareBar';
import { ProductCompareModal } from './components/ProductCompareModal';
import { WarrantyCheckModal } from './components/WarrantyCheckModal';

// Admin / Live Direct CMS Components
import { AdminStatusBar } from './components/admin/AdminStatusBar';
import { OdooBuilderDrawer } from './components/admin/OdooBuilderDrawer';
import { PublishModal } from './components/admin/PublishModal';
import { BrandingEditModal } from './components/admin/BrandingEditModal';
import { ProductEditModal } from './components/admin/ProductEditModal';
import { BranchEditModal } from './components/admin/BranchEditModal';
import { BannerEditModal } from './components/admin/BannerEditModal';
import { HeroEditModal } from './components/admin/HeroEditModal';
import { AboutEditModal } from './components/admin/AboutEditModal';
import { FaqEditModal } from './components/admin/FaqEditModal';
import { TestimonialsEditModal } from './components/admin/TestimonialsEditModal';
import { ThemeEditModal } from './components/admin/ThemeEditModal';
import { BackgroundEditModal } from './components/admin/BackgroundEditModal';
import { FooterEditModal } from './components/admin/FooterEditModal';
import { PaymentEditModal } from './components/admin/PaymentEditModal';
import { WarrantyEditModal } from './components/admin/WarrantyEditModal';
import { SectionHeadersEditModal } from './components/admin/SectionHeadersEditModal';
import { ShopeeImportModal } from './components/admin/ShopeeImportModal';
import { LiveCMSModal } from './components/admin/LiveCMSModal';
import { ToastNotification } from './components/admin/ToastNotification';
import { AnalyticsModal } from './components/admin/AnalyticsModal';
import { OwnerAuthModal } from './components/admin/OwnerAuthModal';
import { StoreOverviewModal } from './components/admin/StoreOverviewModal';
import { OwnerLiveAlertToast } from './components/admin/OwnerLiveAlertToast';

import { MessageSquare, Edit3 } from 'lucide-react';

function AppContent() {
  const {
    settings,
    isAdminMode,
    isOwner,
    setAdminMode,
    openBannerModal,
    trackUserEvent,
  } = useSiteData();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kevin88_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('kevin88_cart', JSON.stringify(cart));
    } catch {
      // localStorage may fail in restricted sandboxes
    }
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    trackUserEvent('add_to_cart', {
      productName: product.name,
      price: product.price,
      category: product.category,
    });
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const whatsappNumber = settings.contacts?.whatsappNumber || '6281288880014';

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200 relative ${isAdminMode ? 'pb-36 sm:pb-28' : 'pb-16 sm:pb-0'}`}>
      {/* 1. OWNER PREVIEW BANNER: Visible ONLY to verified Owner when previewing Customer Mode */}
      {isOwner && !isAdminMode && (
        <div
          id="owner-preview-banner"
          className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/50 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg relative z-40 print:hidden"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-extrabold text-white">
              Mode Tampilan Pelanggan (Customer View)
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Tampilan persis yang dilihat pelanggan. Terhubung ke Cloud Firestore real-time.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAdminMode(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-400/20 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Buka Mode Kelola Owner</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Notice Banner (Directly Updatable) */}
      {settings.announcement?.enabled && (
        <div
          id="banner-announcement"
          className="text-xs font-semibold px-4 py-1.5 text-center flex items-center justify-center gap-2 relative z-30 transition-colors print:hidden"
          style={{
            backgroundColor: settings.announcement?.bgColor || 'var(--theme-primary, #f59e0b)',
            color: settings.announcement?.textColor || 'var(--theme-primary-text, #020617)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
          <span className="line-clamp-1">{settings.announcement.text}</span>
          {isAdminMode && (
            <button
              onClick={openBannerModal}
              className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/15 hover:bg-black/25 text-[11px] font-bold cursor-pointer transition-colors"
              title="Edit teks & warna banner ini langsung"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Banner</span>
            </button>
          )}
        </div>
      )}

      {/* Header following Top Bar Contract */}
      <div id="navbar-header" className="print:hidden">
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main id="app-main-content" className="flex-1 print:hidden">
        {/* Hero Section */}
        <Hero
          onSearch={(query) => setSearchQuery(query)}
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />

        {/* 1. Tentang Kami - Kevin 88 Computer */}
        <AboutSection />

        {/* 2. Product Catalog with in-place stock, price & add/edit */}
        <ProductCatalog
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            if (p) {
              trackUserEvent('view_item', {
                productName: p.name,
                price: p.price,
                category: p.category,
                partNumber: p.partNumber,
              });
            }
          }}
          onAddToCart={handleAddToCart}
          initialSearchQuery={searchQuery}
        />

        {/* 3. Physical Store Branches with in-place edit & Google Maps */}
        <BranchesSection />

        {/* 4. Layanan Purna Jual & Cek Garansi Resmi */}
        <WarrantyCheckSection />

        {/* 5. FAQ */}
        <FaqSection />

        {/* 6. Testimoni Pelanggan */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <div id="website-footer" className="print:hidden">
        <Footer />
      </div>

      {/* Floating WhatsApp Quick Consultation Action Button */}
      <aside id="whatsapp-floating-btn" aria-label="Bantuan WhatsApp" className="fixed bottom-5 right-5 z-30 print:hidden">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Kevin 88 Computer, saya ingin tanya ketersediaan sparepart laptop:')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
          aria-label="Chat WhatsApp Kevin 88 Computer"
        >
          <MessageSquare className="w-4 h-4 fill-slate-950" />
          <span className="hidden sm:inline">Tanya Sparepart via WA</span>
        </a>
      </aside>

      {/* Slide-out Cart Drawer */}
      <div className="print:hidden">
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />
      </div>

      {/* Product Detail Modal */}
      <div className="print:hidden">
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Free Consultation Modal */}
      <div className="print:hidden">
        <ConsultationModal
          isOpen={isConsultationOpen}
          onClose={() => setIsConsultationOpen(false)}
        />
      </div>

      {/* Admin Floating Control Bar & Odoo Builder Drawer */}
      <div id="admin-status-bar" className="print:hidden">
        <AdminStatusBar />
      </div>
      <div id="odoo-builder-drawer" className="print:hidden">
        <OdooBuilderDrawer />
      </div>

      {/* Customer Commerce Modals: Checkout, Automatic Invoice, Orders Tracking */}
      <div className="print:hidden">
        <CheckoutModal items={cart} onClearCart={handleClearCart} />
      </div>
      <InvoiceModal />
      <div className="print:hidden">
        <QrisPaymentModal />
      </div>
      <div className="print:hidden">
        <OrdersHistoryModal />
      </div>

      {/* Product Comparison Bar & Modal (Up to 3 products) */}
      <div className="print:hidden">
        <ProductCompareBar />
        <ProductCompareModal
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Warranty Verification Modal */}
      <div className="print:hidden">
        <WarrantyCheckModal />
      </div>

      {/* Admin Modals */}
      <OwnerAuthModal />
      <PublishModal />
      <BrandingEditModal />
      <ProductEditModal />
      <BranchEditModal />
      <BannerEditModal />
      <HeroEditModal />
      <AboutEditModal />
      <FaqEditModal />
      <TestimonialsEditModal />
      <ThemeEditModal />
      <BackgroundEditModal />
      <FooterEditModal />
      <PaymentEditModal />
      <WarrantyEditModal />
      <SectionHeadersEditModal />
      <ShopeeImportModal />
      <LiveCMSModal />
      <AnalyticsModal />
      <StoreOverviewModal />
      <OwnerLiveAlertToast />
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}
