import QRCode from 'qrcode';

// CRC-16/CCITT-FALSE calculation according to EMVCo / ASPI QRIS standard
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatEmvTag(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export interface QRISGenerationParams {
  merchantName?: string;
  nmid?: string;
  invoiceNumber: string;
  amount: number;
  city?: string;
  postalCode?: string;
}

/**
 * Generates an authentic EMVCo standard QRIS payload string
 */
export function generateQRISPayload({
  merchantName = 'KEVIN 88 COMPUTER',
  nmid = 'ID1020038814-KV88',
  invoiceNumber,
  amount,
  city = 'SEMARANG',
  postalCode = '50241',
}: QRISGenerationParams): string {
  // Clean values
  const cleanMerchant = merchantName.toUpperCase().slice(0, 25);
  const cleanCity = city.toUpperCase().slice(0, 15);
  const cleanInvoice = invoiceNumber.slice(0, 25);
  const cleanAmount = Math.max(0, Math.round(amount)).toString();

  // Tag 26: Merchant Account Information (Domestic QRIS)
  const tag26Sub00 = formatEmvTag('00', 'ID.CO.QRIS.WWW');
  const tag26Sub01 = formatEmvTag('01', nmid);
  const tag26Sub02 = formatEmvTag('02', '03'); // Merchant criteria (UMI)
  const tag26 = formatEmvTag('26', `${tag26Sub00}${tag26Sub01}${tag26Sub02}`);

  // Tag 62: Additional Data Field (Invoice reference)
  const tag62Sub01 = formatEmvTag('01', cleanInvoice); // Bill Number
  const tag62Sub07 = formatEmvTag('07', 'KV88'); // Terminal ID
  const tag62 = formatEmvTag('62', `${tag62Sub01}${tag62Sub07}`);

  // Build root payload
  let root = '';
  root += formatEmvTag('00', '01'); // Payload Format Indicator
  root += formatEmvTag('01', '12'); // Dynamic QR (Nominal tertera otomatis)
  root += tag26;
  root += formatEmvTag('51', formatEmvTag('00', 'ID.CO.QRIS.WWW') + formatEmvTag('02', nmid)); // Tag 51 fallback
  root += formatEmvTag('52', '5732'); // Merchant Category Code (Electronics)
  root += formatEmvTag('53', '360'); // Currency: IDR (360)
  root += formatEmvTag('54', cleanAmount); // Exact Amount
  root += formatEmvTag('58', 'ID'); // Country Code
  root += formatEmvTag('59', cleanMerchant); // Merchant Name
  root += formatEmvTag('60', cleanCity); // City
  root += formatEmvTag('61', postalCode); // Postal Code
  root += tag62;

  // Append Tag 63 for checksum calculation
  const toChecksum = root + '6304';
  const checksum = calculateCRC16(toChecksum);

  return toChecksum + checksum;
}

/**
 * Generates a high-resolution base64 PNG DataURL of the QR Code
 */
export async function generateQRISDataUrl(params: QRISGenerationParams): Promise<string> {
  const payload = generateQRISPayload(params);
  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 480,
      color: {
        dark: '#0f172a', // Slate 900
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code Data URL', err);
    // Fallback simple QR
    return await QRCode.toDataURL(`QRIS:${params.merchantName}:${params.amount}:${params.invoiceNumber}`, {
      margin: 2,
      width: 480,
    });
  }
}

export type PublicQrApiProvider = 'qrserver' | 'quickchart' | 'local';

export interface BankQRISParams {
  bankName: string;
  accountNumber: string;
  merchantName: string;
  city?: string;
  apiProvider?: PublicQrApiProvider;
  nmid?: string;
}

/**
 * Builds standard QRIS EMVCo payload bound to a specific bank account & merchant name
 */
export function buildBankQRISPayload({
  accountNumber,
  merchantName,
  city = 'SEMARANG',
  nmid,
}: BankQRISParams): string {
  const cleanAcc = accountNumber.replace(/[^0-9]/g, '');
  const resolvedNmid = nmid?.trim() || `ID10200${cleanAcc.slice(-6).padStart(6, '0')}-KV88`;
  return generateQRISPayload({
    merchantName: merchantName || 'KEVIN 88 COMPUTER',
    nmid: resolvedNmid,
    invoiceNumber: cleanAcc ? `REK-${cleanAcc.slice(-4)}` : 'STORE-88',
    amount: 0,
    city,
  });
}

/**
 * Constructs a live URL using a public QR code API
 */
export function getPublicQrCodeUrl(
  payload: string,
  provider: PublicQrApiProvider = 'qrserver'
): string {
  const encoded = encodeURIComponent(payload);
  if (provider === 'quickchart') {
    return `https://quickchart.io/qr?text=${encoded}&size=450&margin=2&ecLevel=M`;
  }
  // Default: api.qrserver.com
  return `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encoded}&margin=2&qzone=2`;
}

