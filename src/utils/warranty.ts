import { WarrantyRecord } from '../types';

export interface CalculatedWarranty {
  record: WarrantyRecord;
  purchaseDateFormatted: string;
  expiryDateFormatted: string;
  remainingDays: number;
  totalDays: number;
  usedDays: number;
  percentageUsed: number;
  status: 'active' | 'expiring_soon' | 'expired';
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  statusBorder: string;
}

export function calculateWarrantyDetails(
  record: WarrantyRecord,
  referenceDate: Date = new Date()
): CalculatedWarranty {
  const purchase = new Date(record.purchaseDate);
  // Add warranty months
  const expiry = new Date(purchase);
  expiry.setMonth(expiry.getMonth() + (record.warrantyMonths || 1));

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((expiry.getTime() - purchase.getTime()) / msPerDay));
  const remainingDays = Math.round((expiry.getTime() - referenceDate.getTime()) / msPerDay);
  const usedDays = Math.max(0, totalDays - Math.max(0, remainingDays));
  const percentageUsed = Math.min(100, Math.max(0, Math.round((usedDays / totalDays) * 100)));

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  let status: 'active' | 'expiring_soon' | 'expired';
  let statusLabel: string;
  let statusColor: string;
  let statusBg: string;
  let statusBorder: string;

  if (remainingDays < 0) {
    status = 'expired';
    statusLabel = 'Garansi Kedaluwarsa';
    statusColor = 'text-rose-400';
    statusBg = 'bg-rose-500/10';
    statusBorder = 'border-rose-500/30';
  } else if (remainingDays <= 30) {
    status = 'expiring_soon';
    statusLabel = `Segera Berakhir (${remainingDays} hari tersisa)`;
    statusColor = 'text-amber-400';
    statusBg = 'bg-amber-500/10';
    statusBorder = 'border-amber-500/30';
  } else {
    status = 'active';
    statusLabel = `Garansi Aktif (${remainingDays} hari tersisa)`;
    statusColor = 'text-emerald-400';
    statusBg = 'bg-emerald-500/10';
    statusBorder = 'border-emerald-500/30';
  }

  return {
    record,
    purchaseDateFormatted: formatDate(purchase),
    expiryDateFormatted: formatDate(expiry),
    remainingDays,
    totalDays,
    usedDays,
    percentageUsed,
    status,
    statusLabel,
    statusColor,
    statusBg,
    statusBorder,
  };
}
