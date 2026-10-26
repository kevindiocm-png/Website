export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export const MAIN_WHATSAPP_NUMBER = '6281288880014'; // Kevin 88 Computer WA Center
export const MAIN_EMAIL = 'kevindiocm@gmail.com';

export function createWhatsAppConsultationUrl(data: {
  laptopBrand?: string;
  laptopModel?: string;
  sparepartType?: string;
  notes?: string;
}): string {
  const parts: string[] = [
    'Halo Kevin 88 Computer, saya ingin konsultasi sparepart laptop:',
  ];

  if (data.laptopBrand) parts.push(`• Merk Laptop: ${data.laptopBrand}`);
  if (data.laptopModel) parts.push(`• Tipe/Model: ${data.laptopModel}`);
  if (data.sparepartType) parts.push(`• Sparepart yang dicari: ${data.sparepartType}`);
  if (data.notes) parts.push(`• Keluhan / Catatan: ${data.notes}`);

  parts.push('\nMohon info ketersediaan stok, kecocokan tipe, dan harganya. Terima kasih!');

  const text = encodeURIComponent(parts.join('\n'));
  return `https://wa.me/${MAIN_WHATSAPP_NUMBER}?text=${text}`;
}

export function createWhatsAppOrderUrl(
  items: Array<{ name: string; partNumber: string; price: number; quantity: number }>,
  subtotal: number,
  notes?: string
): string {
  const parts: string[] = [
    '*PESANAN BARU VIA WEBSITE KEVIN 88 COMPUTER*',
    '----------------------------------------',
  ];

  items.forEach((item, idx) => {
    parts.push(
      `${idx + 1}. ${item.name} (${item.partNumber})\n   Qty: ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}`
    );
  });

  parts.push('----------------------------------------');
  parts.push(`*Total Belanja:* ${formatRupiah(subtotal)}`);
  if (notes) {
    parts.push(`*Catatan Tambahan:* ${notes}`);
  }
  parts.push('\nHalo Kevin 88 Computer, saya ingin konfirmasi pesanan di atas. Mohon info ketersediaan stok & petunjuk pembayarannya. Terima kasih!');

  const text = encodeURIComponent(parts.join('\n'));
  return `https://wa.me/${MAIN_WHATSAPP_NUMBER}?text=${text}`;
}

import { OrderInvoice } from '../types';

export function createWhatsAppInvoiceUrl(invoice: OrderInvoice): string {
  const paymentLabels: Record<string, string> = {
    qris: 'QRIS (Semua E-Wallet & Bank)',
    bca: 'Transfer Bank BCA (0123-456-789)',
    mandiri: 'Transfer Bank Mandiri (136-00-1234567-8)',
    bri: 'Transfer Bank BRI (0083-01-002345-50-1)',
    bni: 'Transfer Bank BNI (0812-3456-7890)',
    cod: 'COD / Ambil di Toko Cabang',
  };

  const lines: string[] = [
    `*NOTA PESANAN RESMI KEVIN 88 COMPUTER*`,
    `No. Invoice: ${invoice.invoiceNumber}`,
    `Tanggal: ${new Date(invoice.createdAt).toLocaleString('id-ID')}`,
    `----------------------------------------`,
    `*DATA PEMESAN:*`,
    `Nama: ${invoice.customer.name}`,
    `No. WA: ${invoice.customer.phone}`,
    `Alamat Kirim: ${invoice.customer.address}, ${invoice.customer.city}`,
    `Tipe Laptop: ${invoice.customer.laptopModel || '-'}`,
    `----------------------------------------`,
    `*RINCIAN PRODUK:*`,
  ];

  invoice.items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.product.name}\n   SKU: ${item.product.partNumber} | Garansi: ${item.product.warrantyMonths} Bln\n   Qty: ${item.quantity} x ${formatRupiah(item.product.price)} = ${formatRupiah(item.product.price * item.quantity)}`
    );
  });

  lines.push(`----------------------------------------`);
  lines.push(`Subtotal: ${formatRupiah(invoice.subtotal)}`);
  lines.push(`Ongkos Kirim (${invoice.shippingMethod.toUpperCase()}): ${formatRupiah(invoice.shippingFee)}`);
  if (invoice.discount > 0) {
    lines.push(`Diskon Promo: -${formatRupiah(invoice.discount)}`);
  }
  lines.push(`*TOTAL TAGIHAN: ${formatRupiah(invoice.total)}*`);
  lines.push(`Metode Bayar: ${paymentLabels[invoice.paymentMethod] || invoice.paymentMethod}`);
  lines.push(`Status: ${invoice.paymentStatus.toUpperCase()}`);
  lines.push(`----------------------------------------`);
  lines.push(`Halo admin Kevin 88 Computer, ini nota pesanan saya dari website. Mohon verifikasi pembayaran dan proses pengiriman sparepart saya. Terima kasih!`);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${MAIN_WHATSAPP_NUMBER}?text=${text}`;
}
