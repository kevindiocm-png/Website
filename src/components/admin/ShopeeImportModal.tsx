import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useSiteData } from '../../context/SiteContext';
import { Product, ProductCategory, ProductBrand } from '../../types';
import { formatRupiah } from '../../utils/format';
import {
  Upload,
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  FileText,
  Sparkles,
  Download,
  Trash2,
  RefreshCw,
  Plus,
  HelpCircle,
  Package,
  Layers,
  ArrowRight,
  Sliders,
  CheckSquare,
  Square,
  Eye,
} from 'lucide-react';

interface ParsedShopeeItem {
  id: string;
  name: string;
  category: ProductCategory;
  brand: ProductBrand;
  partNumber: string;
  price: number;
  originalPrice?: number;
  stock: number;
  warrantyMonths: number;
  specs: { label: string; value: string }[];
  image: string;
  description: string;
  condition: string;
  compatibleModels: string[];
  selected: boolean;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  baterai: '/src/assets/images/category_batteries_chargers_1790149138356.jpg',
  charger: '/src/assets/images/category_batteries_chargers_1790149138356.jpg',
  keyboard: '/src/assets/images/category_keyboards_screens_1790149149871.jpg',
  lcd: '/src/assets/images/category_keyboards_screens_1790149149871.jpg',
  ram: '/src/assets/images/hero_laptop_spareparts_1790149123693.jpg',
  ssd: '/src/assets/images/hero_laptop_spareparts_1790149123693.jpg',
  fan: '/src/assets/images/technician_workbench_repair_1790149160100.jpg',
};

const SAMPLE_SHOPEE_PRODUCTS: Omit<ParsedShopeeItem, 'id' | 'selected'>[] = [
  {
    name: 'Baterai Asus ROG Strix G15 G512 G531 GL504 GL542 (C41N1731) Original',
    category: 'baterai',
    brand: 'Asus',
    partNumber: 'C41N1731-ROG',
    price: 485000,
    originalPrice: 550000,
    stock: 24,
    warrantyMonths: 12,
    specs: [
      { label: 'Tipe', value: 'Li-ion Polymer 66Wh' },
      { label: 'Voltase', value: '15.4V' },
      { label: 'Kualitas', value: 'Original 100% Tukar Baru' },
    ],
    image: '/src/assets/images/category_batteries_chargers_1790149138356.jpg',
    description: 'Baterai original khusus laptop gaming Asus ROG Strix G15 / G531 / GL504. Kualitas sel grade A dengan proteksi panas berlebih dan overcharge.',
    condition: 'Baru (Original)',
    compatibleModels: ['Asus ROG Strix G15 G512', 'Asus ROG G531', 'Asus GL504'],
  },
  {
    name: 'Charger Adaptor Laptop Lenovo ThinkPad / IdeaPad Type-C 65W Original PD Fast Charge',
    category: 'charger',
    brand: 'Lenovo',
    partNumber: 'ADLX65YLC3A-65W',
    price: 245000,
    originalPrice: 290000,
    stock: 45,
    warrantyMonths: 12,
    specs: [
      { label: 'Daya', value: '65 Watt' },
      { label: 'Konektor', value: 'USB Type-C Power Delivery' },
      { label: 'Output', value: '20V-3.25A / 15V-3A / 9V-2A / 5V-2A' },
    ],
    image: '/src/assets/images/category_batteries_chargers_1790149138356.jpg',
    description: 'Adaptor charger USB-C 65W original untuk Lenovo ThinkPad X1 Carbon, T480, T490, IdeaPad Slim 5, Yoga, dan laptop universal berfitur Type-C PD.',
    condition: 'Baru (Original)',
    compatibleModels: ['Lenovo ThinkPad X1', 'ThinkPad T480', 'IdeaPad Slim 5', 'Yoga 7'],
  },
  {
    name: 'Keyboard Laptop Asus TUF Gaming FX505 FX505D FX505G FX505GE FX705 RGB Backlight',
    category: 'keyboard',
    brand: 'Asus',
    partNumber: 'KB-ASUS-FX505-RGB',
    price: 215000,
    originalPrice: 260000,
    stock: 18,
    warrantyMonths: 6,
    specs: [
      { label: 'Layout', value: 'US QWERTY Standard' },
      { label: 'Lampu', value: 'RGB Backlight Ready' },
      { label: 'Tombol', value: 'WASD Highlighted Keys' },
    ],
    image: '/src/assets/images/category_keyboards_screens_1790149149871.jpg',
    description: 'Keyboard pengganti Asus TUF Gaming FX505 FX705 dengan fitur lampu RGB dan tombol WASD transparan. Tombol empuk dan presisi tinggi.',
    condition: 'Baru (Original)',
    compatibleModels: ['Asus TUF FX505D', 'Asus TUF FX505G', 'Asus TUF FX705'],
  },
  {
    name: 'Layar LCD LED 14.0 Slim 30 Pin FHD IPS 1920x1080 Bracket Kuping Atas Bawah',
    category: 'lcd',
    brand: 'Universal',
    partNumber: 'N140HCA-EAC-FHD',
    price: 685000,
    originalPrice: 790000,
    stock: 15,
    warrantyMonths: 6,
    specs: [
      { label: 'Ukuran', value: '14.0 Inch Slim' },
      { label: 'Resolusi', value: 'Full HD 1920 x 1080 IPS' },
      { label: 'Konektor', value: '30 Pin eDP' },
    ],
    image: '/src/assets/images/category_keyboards_screens_1790149149871.jpg',
    description: 'Panel layar LCD/LED 14.0 inch Full HD IPS dengan sudut pandang luas dan warna tajam. Kompatibel dengan berbagai merk Asus, Lenovo, Acer, HP, Dell.',
    condition: 'Baru (Original Grade A+)',
    compatibleModels: ['Asus VivoBook 14', 'Lenovo IdeaPad 14', 'Acer Aspire 14', 'HP 14s'],
  },
  {
    name: 'RAM Laptop SODIMM DDR4 16GB 3200MHz Kingston Fury Impact 1.2V CL20',
    category: 'ram',
    brand: 'Universal',
    partNumber: 'KF432S20IB-16',
    price: 495000,
    originalPrice: 560000,
    stock: 32,
    warrantyMonths: 36,
    specs: [
      { label: 'Kapasitas', value: '16GB Single Channel' },
      { label: 'Speed', value: 'DDR4 3200MHz PC4-25600' },
      { label: 'Garansi', value: 'Lifetime / 3 Tahun Toko' },
    ],
    image: '/src/assets/images/hero_laptop_spareparts_1790149123693.jpg',
    description: 'RAM performa tinggi SODIMM DDR4 16GB Kingston Fury Impact untuk upgrade gaming, editing render video, dan multitasking lancar tanpa lag.',
    condition: 'Baru (Original)',
    compatibleModels: ['Laptop Intel Gen 8-12', 'Laptop AMD Ryzen 3000-6000'],
  },
  {
    name: 'SSD M.2 NVMe PCIe Gen3x4 1TB Samsung 980 Read 3500MB/s V-NAND',
    category: 'ssd',
    brand: 'Universal',
    partNumber: 'MZ-V8V1T0BW-1TB',
    price: 920000,
    originalPrice: 1050000,
    stock: 20,
    warrantyMonths: 36,
    specs: [
      { label: 'Kapasitas', value: '1TB (1000GB)' },
      { label: 'Form Factor', value: 'M.2 2280 NVMe' },
      { label: 'Kecepatan', value: 'Baca 3500 MB/s · Tulis 3000 MB/s' },
    ],
    image: '/src/assets/images/hero_laptop_spareparts_1790149123693.jpg',
    description: 'SSD NVMe Samsung 980 1TB kecepatan super tinggi untuk booting Windows 5 detik dan loading software berat sekejap mata. Bergaransi resmi.',
    condition: 'Baru (Original)',
    compatibleModels: ['Semua laptop dengan slot M.2 NVMe'],
  },
  {
    name: 'Fan Kipas Pendingin Processor CPU Laptop Acer Nitro 5 AN515-54 AN515-55 AN517 Predator',
    category: 'fan',
    brand: 'Acer',
    partNumber: 'FAN-ACER-NITRO5-CPU',
    price: 115000,
    originalPrice: 145000,
    stock: 22,
    warrantyMonths: 3,
    specs: [
      { label: 'Daya', value: 'DC 5V / 0.5A' },
      { label: 'Konektor', value: '4 Pin Molex PWM' },
      { label: 'Bahan', value: 'Aluminium Baling Aerodinamis' },
    ],
    image: '/src/assets/images/technician_workbench_repair_1790149160100.jpg',
    description: 'Fan pendingin CPU original untuk Acer Nitro 5 AN515 AN517. Mengatasi laptop cepat panas, overheat, fan berbunyi berisik, atau mati sendiri.',
    condition: 'Baru (Original)',
    compatibleModels: ['Acer Nitro 5 AN515-54', 'Acer Nitro 5 AN515-55', 'Acer Predator Helios 300'],
  },
  {
    name: 'Baterai Laptop HP Pavilion 14-ce 14-cf 14-ck 14-cm 15-cs 15-cw (HT03XL) Original',
    category: 'baterai',
    brand: 'HP',
    partNumber: 'HT03XL-L11119-855',
    price: 345000,
    originalPrice: 395000,
    stock: 26,
    warrantyMonths: 6,
    specs: [
      { label: 'Tipe', value: 'Li-ion 3-Cell 41.04Wh' },
      { label: 'Voltase', value: '11.55V / 11.4V' },
      { label: 'Garansi', value: '6 Bulan Ganti Baru' },
    ],
    image: '/src/assets/images/category_batteries_chargers_1790149138356.jpg',
    description: 'Baterai HT03XL original HP Pavilion 14 dan 15 inch. Menyediakan daya stabil dan proteksi sirkuit perlindungan korsleting.',
    condition: 'Baru (Original)',
    compatibleModels: ['HP Pavilion 14-ce', 'HP 14-cf', 'HP 14-ck', 'HP 15-cs', 'HP 15-cw'],
  },
];

export const ShopeeImportModal: React.FC = () => {
  const { isShopeeModalOpen, closeShopeeModal, batchImportProducts, showToast } = useSiteData();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'guide'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [parsedItems, setParsedItems] = useState<ParsedShopeeItem[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pasteContent, setPasteContent] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isShopeeModalOpen) return null;

  // Helper to detect category from text
  const detectCategory = (text: string): ProductCategory => {
    const lower = text.toLowerCase();
    if (lower.includes('baterai') || lower.includes('battery') || lower.includes('bat ')) return 'baterai';
    if (lower.includes('charger') || lower.includes('adaptor') || lower.includes('adapter') || lower.includes('cas')) return 'charger';
    if (lower.includes('keyboard') || lower.includes('keypad') || lower.includes('tuts')) return 'keyboard';
    if (lower.includes('lcd') || lower.includes('led') || lower.includes('layar') || lower.includes('screen') || lower.includes('panel')) return 'lcd';
    if (lower.includes('ram') || lower.includes('sodimm') || lower.includes('ddr3') || lower.includes('ddr4') || lower.includes('ddr5') || lower.includes('memory')) return 'ram';
    if (lower.includes('ssd') || lower.includes('nvme') || lower.includes('sata') || lower.includes('m.2') || lower.includes('harddisk')) return 'ssd';
    if (lower.includes('fan') || lower.includes('kipas') || lower.includes('cooler') || lower.includes('cooling') || lower.includes('heatsink')) return 'fan';
    return 'baterai'; // safe default for laptop parts
  };

  // Helper to detect brand from text
  const detectBrand = (text: string): ProductBrand => {
    const lower = text.toLowerCase();
    if (lower.includes('asus') || lower.includes('rog') || lower.includes('tuf') || lower.includes('zenbook') || lower.includes('vivobook')) return 'Asus';
    if (lower.includes('lenovo') || lower.includes('thinkpad') || lower.includes('ideapad') || lower.includes('legion') || lower.includes('yoga')) return 'Lenovo';
    if (lower.includes('acer') || lower.includes('aspire') || lower.includes('nitro') || lower.includes('predator') || lower.includes('swift')) return 'Acer';
    if (lower.includes('hp') || lower.includes('pavilion') || lower.includes('omen') || lower.includes('victus') || lower.includes('probook') || lower.includes('elitebook')) return 'HP';
    if (lower.includes('dell') || lower.includes('inspiron') || lower.includes('vostro') || lower.includes('latitude') || lower.includes('xps') || lower.includes('alienware')) return 'Dell';
    if (lower.includes('apple') || lower.includes('macbook') || lower.includes('mac')) return 'Apple';
    if (lower.includes('axioo') || lower.includes('mybook') || lower.includes('pongo')) return 'Axioo';
    if (lower.includes('msi') || lower.includes('katana') || lower.includes('modern') || lower.includes('stealth')) return 'MSI';
    if (lower.includes('toshiba') || lower.includes('dynabook')) return 'Toshiba';
    return 'Universal';
  };

  // Helper to clean price number
  const cleanPrice = (val: any): number => {
    if (typeof val === 'number') return Math.max(0, Math.round(val));
    if (!val) return 0;
    const str = String(val).replace(/rp/gi, '').replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.]/g, '').trim();
    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.max(0, Math.round(num));
  };

  // Helper to extract clean SKU
  const cleanSku = (val: any, fallbackName: string): string => {
    if (val && String(val).trim().length > 1) {
      return String(val).trim();
    }
    // Generate SKU from name
    const match = fallbackName.match(/\(([A-Za-z0-9_-]+)\)/);
    if (match && match[1]) return match[1];
    return `KV88-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  // Process raw rows (array of arrays or json objects)
  const processRawData = (rows: any[][]) => {
    if (!rows || rows.length === 0) {
      setErrorMsg('File kosong atau data tidak ditemukan.');
      return;
    }

    // Shopee mass upload files frequently place notes/instructions on rows 0-3, and actual header on row 3, 4, or 5
    // Let's locate the header row by scanning for keywords
    let headerRowIdx = -1;
    let colIndices: Record<string, number> = {
      name: -1,
      price: -1,
      stock: -1,
      sku: -1,
      category: -1,
      brand: -1,
      image: -1,
      description: -1,
      condition: -1,
      warranty: -1,
    };

    const headerKeywords = {
      name: ['nama produk', 'product name', 'nama', 'title', 'nama barang', 'product_name'],
      price: ['harga', 'price', 'harga satuan', 'deal price', 'harga jual', 'original price'],
      stock: ['stok', 'stock', 'jumlah', 'qty', 'quantity', 'inventory'],
      sku: ['sku induk', 'parent sku', 'kode produk', 'sku', 'nomor sku', 'part number', 'kode barang'],
      category: ['kategori', 'category', 'kategori produk', 'nama kategori', 'category_id'],
      brand: ['merek', 'brand', 'merk'],
      image: ['foto sampul', 'gambar 1', 'foto 1', 'cover image', 'image 1', 'images', 'url foto', 'gambar produk 1'],
      description: ['deskripsi produk', 'description', 'deskripsi', 'rincian produk', 'keterangan'],
      condition: ['kondisi', 'condition'],
      warranty: ['garansi', 'warranty'],
    };

    // Scan the first 12 rows to find the best matching header row
    let maxMatchCount = 0;
    for (let r = 0; r < Math.min(12, rows.length); r++) {
      const row = rows[r];
      if (!Array.isArray(row)) continue;

      let currentMatches = 0;
      const currentIndices: Record<string, number> = {};

      row.forEach((cell, colIdx) => {
        const str = String(cell || '').toLowerCase().trim();
        for (const [key, keywords] of Object.entries(headerKeywords)) {
          if (keywords.some((kw) => str.includes(kw))) {
            if (currentIndices[key] === undefined) {
              currentIndices[key] = colIdx;
              currentMatches++;
            }
          }
        }
      });

      if (currentMatches > maxMatchCount && (currentIndices.name !== undefined || currentIndices.price !== undefined)) {
        maxMatchCount = currentMatches;
        headerRowIdx = r;
        colIndices = { ...colIndices, ...currentIndices };
      }
    }

    // Fallback: If no header row found, guess row 0
    if (headerRowIdx === -1) {
      headerRowIdx = 0;
      colIndices.name = 0;
      colIndices.price = 1;
      colIndices.stock = 2;
    }

    const dataRows = rows.slice(headerRowIdx + 1);
    const parsed: ParsedShopeeItem[] = [];

    dataRows.forEach((row, idx) => {
      if (!row || !Array.isArray(row) || row.every((c) => c === undefined || c === null || String(c).trim() === '')) {
        return; // skip completely empty row
      }

      const rawName = colIndices.name !== -1 ? String(row[colIndices.name] || '').trim() : '';
      if (!rawName || rawName.length < 3) return; // skip if no product name

      const rawPrice = colIndices.price !== -1 ? cleanPrice(row[colIndices.price]) : 150000;
      const rawStock = colIndices.stock !== -1 ? parseInt(String(row[colIndices.stock] || '15'), 10) || 15 : 15;
      const rawSku = colIndices.sku !== -1 ? cleanSku(row[colIndices.sku], rawName) : cleanSku(null, rawName);
      const rawCatStr = colIndices.category !== -1 ? String(row[colIndices.category] || '') : '';
      const rawBrandStr = colIndices.brand !== -1 ? String(row[colIndices.brand] || '') : '';
      const rawDesc = colIndices.description !== -1 ? String(row[colIndices.description] || '').trim() : '';
      const rawImg = colIndices.image !== -1 ? String(row[colIndices.image] || '').trim() : '';

      const detectedCat = detectCategory(rawCatStr + ' ' + rawName + ' ' + rawDesc);
      const detectedBrand = detectBrand(rawBrandStr + ' ' + rawName);

      // Default image fallback
      const finalImage = rawImg.startsWith('http') || rawImg.startsWith('/')
        ? rawImg
        : DEFAULT_CATEGORY_IMAGES[detectedCat] || DEFAULT_CATEGORY_IMAGES.baterai;

      parsed.push({
        id: `shopee_import_${Date.now()}_${idx}`,
        name: rawName,
        category: detectedCat,
        brand: detectedBrand,
        partNumber: rawSku,
        price: rawPrice > 0 ? rawPrice : 250000,
        originalPrice: rawPrice > 0 ? Math.round(rawPrice * 1.15) : 290000,
        stock: Math.max(1, rawStock),
        warrantyMonths: 12,
        specs: [
          { label: 'Kategori', value: detectedCat.toUpperCase() },
          { label: 'Merk Cocok', value: detectedBrand },
          { label: 'Garansi', value: '12 Bulan Tukar Baru' },
        ],
        image: finalImage,
        description: rawDesc || `Produk sparepart ${rawName} berkualitas tinggi dan bergaransi tukar baru di Kevin 88 Computer.`,
        condition: 'Baru (Original)',
        compatibleModels: [detectedBrand],
        selected: true,
      });
    });

    if (parsed.length === 0) {
      setErrorMsg('Tidak ada baris produk yang valid ditemukan dari file. Pastikan terdapat kolom "Nama Produk" dan "Harga".');
    } else {
      setErrorMsg(null);
      setParsedItems(parsed);
      showToast(`Berhasil membaca ${parsed.length} produk dari file Shopee!`, 'success');
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processRawData(rawRows);
      } catch (err: any) {
        console.error('Error reading Shopee file', err);
        setErrorMsg('Gagal membaca file. Pastikan file berformat Excel (.xlsx, .xls) atau CSV valid.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Gagal memproses file.');
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Parse pasted TSV/CSV/JSON text
  const handleProcessPastedText = () => {
    if (!pasteContent.trim()) {
      setErrorMsg('Silakan tempel teks tabel produk Shopee terlebih dahulu.');
      return;
    }

    try {
      // Check if user pasted JSON
      if (pasteContent.trim().startsWith('[') || pasteContent.trim().startsWith('{')) {
        const parsed = JSON.parse(pasteContent);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const mapped: ParsedShopeeItem[] = list.map((item, idx) => ({
          id: `pasted_${Date.now()}_${idx}`,
          name: item.name || item.nama || item['Nama Produk'] || 'Sparepart Laptop',
          category: detectCategory(item.category || item.kategori || item.name || ''),
          brand: detectBrand(item.brand || item.merek || item.name || ''),
          partNumber: item.partNumber || item.sku || item['SKU Induk'] || `KV-${Date.now()}-${idx}`,
          price: cleanPrice(item.price || item.harga || 150000),
          stock: parseInt(String(item.stock || item.stok || '10'), 10) || 10,
          warrantyMonths: 12,
          specs: [],
          image: item.image || item.foto || DEFAULT_CATEGORY_IMAGES.baterai,
          description: item.description || item.deskripsi || '',
          condition: 'Baru (Original)',
          compatibleModels: [],
          selected: true,
        }));
        setParsedItems(mapped);
        showToast(`Berhasil membaca ${mapped.length} produk dari teks JSON!`, 'success');
        return;
      }

      // Parse tabular text (tab-separated or comma-separated)
      const lines = pasteContent.trim().split(/\r?\n/);
      const rows = lines.map((line) => {
        if (line.includes('\t')) {
          return line.split('\t');
        }
        return line.split(',');
      });
      processRawData(rows);
    } catch (err: any) {
      setErrorMsg('Format teks yang ditempel tidak sesuai format tabel Shopee.');
    }
  };

  // Load 8 Sample Products directly for 1-click test
  const handleLoadSampleShopee = () => {
    const formatted: ParsedShopeeItem[] = SAMPLE_SHOPEE_PRODUCTS.map((item, index) => ({
      ...item,
      id: `sample_shopee_${Date.now()}_${index}`,
      selected: true,
    }));
    setParsedItems(formatted);
    setFileName('contoh_daftar_produk_shopee_kevin88.xlsx');
    setErrorMsg(null);
    showToast('Data contoh produk Shopee berhasil dimuat! Siap diimpor.', 'info');
  };

  // Download Sample Shopee Excel Template
  const handleDownloadShopeeTemplate = () => {
    try {
      const templateData = [
        // Header Instructions as Shopee does
        ['PETUNJUK PENGISIAN:', 'Isi data sparepart laptop toko Anda. Kolom bertanda (*) wajib diisi.'],
        ['CATATAN:', 'Kevin 88 Computer otomatis mendeteksi kategori baterai, charger, keyboard, lcd, ram, ssd, fan dari judul!'],
        [],
        // Column Headers
        [
          'Kategori (*)',
          'Nama Produk (*)',
          'Deskripsi Produk',
          'SKU Induk / Kode Produk',
          'Harga (*)',
          'Stok (*)',
          'Foto Sampul (URL)',
          'Merek',
          'Kondisi',
          'Garansi',
        ],
        // Sample Rows
        [
          'Komputer > Sparepart > Baterai',
          'Baterai Asus ROG Strix G15 G512 (C41N1731) Original',
          'Baterai original Asus ROG bergaransi 12 bulan tukar baru.',
          'C41N1731-ROG',
          485000,
          25,
          '',
          'Asus',
          'Baru',
          '12 Bulan',
        ],
        [
          'Komputer > Aksesoris > Adaptor Charger',
          'Charger Adaptor Lenovo ThinkPad Type-C 65W Original',
          'Adaptor USB-C 65W Fast Charge untuk ThinkPad dan IdeaPad.',
          'LEN-65W-TYPEC',
          245000,
          40,
          '',
          'Lenovo',
          'Baru',
          '12 Bulan',
        ],
        [
          'Komputer > Sparepart > Keyboard',
          'Keyboard Asus TUF Gaming FX505 RGB Backlight US',
          'Keyboard gaming Asus TUF tombol empuk berlampu RGB.',
          'KB-TUF-FX505',
          215000,
          18,
          '',
          'Asus',
          'Baru',
          '6 Bulan',
        ],
        [
          'Komputer > Sparepart > Layar LCD',
          'Layar LCD LED 14.0 Slim 30 Pin Full HD IPS 1080P',
          'Panel LCD 14 inch Full HD IPS tajam bebas dead pixel.',
          'LCD-140-FHD-IPS',
          685000,
          15,
          '',
          'Universal',
          'Baru',
          '6 Bulan',
        ],
        [
          'Komputer > Komponen > Memori RAM',
          'RAM SODIMM DDR4 16GB 3200MHz Kingston Fury Impact',
          'RAM laptop kencang untuk gaming dan editing lancar.',
          'RAM-DDR4-16GB-KF',
          495000,
          30,
          '',
          'Universal',
          'Baru',
          '36 Bulan',
        ],
      ];

      const ws = XLSX.utils.aoa_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Shopee Products');
      XLSX.writeFile(wb, 'Format_Import_Produk_Shopee_Kevin88.xlsx');
      showToast('Template Excel Shopee berhasil diunduh!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal mengunduh template.', 'error');
    }
  };

  // Toggle selection
  const toggleSelectAll = (select: boolean) => {
    setParsedItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const toggleSelectItem = (id: string) => {
    setParsedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleUpdateItemField = (id: string, field: keyof ParsedShopeeItem, value: any) => {
    setParsedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setParsedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Final submit to catalog
  const handleCommitImport = () => {
    const selected = parsedItems.filter((i) => i.selected);
    if (selected.length === 0) {
      setErrorMsg('Pilih minimal 1 produk untuk diimpor ke website.');
      return;
    }

    const payload: Omit<Product, 'id'>[] = selected.map((item) => ({
      name: item.name,
      category: item.category,
      brand: item.brand,
      compatibleModels: item.compatibleModels.length > 0 ? item.compatibleModels : [item.brand],
      partNumber: item.partNumber,
      price: item.price,
      originalPrice: item.originalPrice || Math.round(item.price * 1.15),
      stock: item.stock,
      warrantyMonths: item.warrantyMonths,
      specs: item.specs.length > 0 ? item.specs : [
        { label: 'Kategori', value: item.category.toUpperCase() },
        { label: 'Garansi', value: `${item.warrantyMonths} Bulan Ganti Baru` },
      ],
      image: item.image,
      isPopular: false,
      description: item.description,
      condition: item.condition,
    }));

    batchImportProducts(payload, importMode);
    closeShopeeModal();

    // Scroll to catalog section smoothly
    setTimeout(() => {
      const catalogEl = document.getElementById('katalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const selectedCount = parsedItems.filter((i) => i.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/80 border-b border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Upload & Import Produk Shopee
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  EXCEL / CSV
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kirim atau upload file ekspor Shopee Seller Centre (.xlsx, .csv) langsung ke katalog website Kevin 88
              </p>
            </div>
          </div>

          <button
            onClick={closeShopeeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'upload'
                  ? 'border-orange-500 text-orange-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1. Upload File Excel / CSV</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'paste'
                  ? 'border-orange-500 text-orange-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Tempel Teks Tabel</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeTab === 'guide'
                  ? 'border-orange-500 text-orange-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Format & Template Shopee</span>
            </button>
          </div>

          {/* Quick 1-click test button */}
          <div className="flex items-center gap-2 pb-1.5">
            <button
              type="button"
              onClick={handleLoadSampleShopee}
              className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Muat 8 produk sparepart contoh format Shopee untuk test langsung"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Coba Data Contoh Shopee</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadShopeeTemplate}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
              title="Unduh file Excel format template Shopee"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tab 1: Drag & Drop Zone */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-orange-400 bg-orange-500/10 scale-[0.99]'
                  : 'border-slate-700 hover:border-orange-500/60 bg-slate-950/70 hover:bg-slate-950'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv, .tsv, .txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-lg">
                <Upload className="w-7 h-7" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Seret & Jatuhkan File Shopee (.xlsx, .xls, .csv) di sini
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Atau klik untuk memilih file dari komputer / laptop Anda
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">.xlsx (Excel)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">.csv (Comma-Separated)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">.xls (Shopee Mass Export)</span>
              </div>

              {isLoading && (
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 animate-pulse pt-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang memproses dan membaca kolom file Shopee...</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Raw Text Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Tempel Baris Data dari Excel / Google Sheet / Shopee Seller Centre:
                </label>
                <span className="text-[11px] text-slate-400">
                  Mendukung tab-separated atau comma-separated
                </span>
              </div>

              <textarea
                rows={6}
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="Nama Produk&#9;Harga&#9;Stok&#9;Kategori&#10;Baterai Asus ROG G15&#9;485000&#9;25&#9;Baterai&#10;Charger Lenovo 65W&#9;245000&#9;40&#9;Charger..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleProcessPastedText}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Proses Teks & Deteksi Produk</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Guide */}
          {activeTab === 'guide' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Cara Download File Produk dari Shopee Seller Centre:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 mt-2 text-slate-300 leading-relaxed">
                    <li>Buka <strong>Shopee Seller Centre</strong> &gt; Masuk ke menu <strong>Produk Saya</strong>.</li>
                    <li>Klik tombol <strong>Peralatan Massal (Mass Update / Export)</strong> di kanan atas.</li>
                    <li>Pilih <strong>Informasi Dasar</strong> atau <strong>Informasi Penjualan</strong>, lalu klik <strong>Ekspor</strong>.</li>
                    <li>Download file Excel (.xlsx / .csv) yang dihasilkan oleh Shopee.</li>
                    <li>Kembali ke website Kevin 88 ini, seret / upload file tersebut di tab <strong>1. Upload File Excel</strong>.</li>
                  </ol>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/60">
                <h5 className="font-bold text-white mb-1.5">Kolom Shopee yang Dikenali Otomatis:</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-orange-400">Nama Produk:</strong><br />
                    Nama / Product Name
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-orange-400">Harga:</strong><br />
                    Harga / Price / Deal Price
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-orange-400">Stok:</strong><br />
                    Stok / Stock / Qty
                  </div>
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                    <strong className="text-orange-400">Kategori & Merk:</strong><br />
                    Otomatis dari Judul!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parsed Items Review Table */}
          {parsedItems.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-orange-400" />
                    <span>Daftar Produk Terdeteksi ({parsedItems.length} item)</span>
                  </span>

                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    {selectedCount} produk terpilih
                  </span>

                  {fileName && (
                    <span className="text-[11px] text-slate-400 font-mono hidden md:inline truncate max-w-xs">
                      📁 {fileName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(selectedCount !== parsedItems.length)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
                  >
                    {selectedCount === parsedItems.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setParsedItems([])}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-red-300 text-xs font-medium border border-slate-700 cursor-pointer"
                    title="Kosongkan daftar preview"
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>

              {/* Scrollable Table */}
              <div className="max-h-72 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-slate-300 text-[11px] uppercase tracking-wider sticky top-0 border-b border-slate-800 z-10">
                    <tr>
                      <th className="p-2.5 w-10 text-center">Pilih</th>
                      <th className="p-2.5 w-14">Foto</th>
                      <th className="p-2.5">Nama Sparepart</th>
                      <th className="p-2.5 w-32">Kategori</th>
                      <th className="p-2.5 w-24">Merk</th>
                      <th className="p-2.5 w-28">Harga (Rp)</th>
                      <th className="p-2.5 w-16 text-center">Stok</th>
                      <th className="p-2.5 w-10 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {parsedItems.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-900/60 transition-colors ${
                          !item.selected ? 'opacity-40 bg-slate-950/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSelectItem(item.id)}
                            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 bg-slate-900 border-slate-700 cursor-pointer"
                          />
                        </td>

                        {/* Thumbnail */}
                        <td className="p-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                DEFAULT_CATEGORY_IMAGES[item.category] ||
                                DEFAULT_CATEGORY_IMAGES.baterai;
                            }}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700"
                          />
                        </td>

                        {/* Name & SKU */}
                        <td className="p-2.5">
                          <div className="font-semibold text-white line-clamp-1">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            SKU: {item.partNumber}
                          </div>
                        </td>

                        {/* Category Dropdown */}
                        <td className="p-2.5">
                          <select
                            value={item.category}
                            onChange={(e) =>
                              handleUpdateItemField(item.id, 'category', e.target.value as ProductCategory)
                            }
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                          >
                            <option value="baterai">Baterai</option>
                            <option value="charger">Charger</option>
                            <option value="keyboard">Keyboard</option>
                            <option value="lcd">LCD / LED</option>
                            <option value="ram">RAM</option>
                            <option value="ssd">SSD</option>
                            <option value="fan">Fan Cooler</option>
                          </select>
                        </td>

                        {/* Brand Badge */}
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {item.brand}
                          </span>
                        </td>

                        {/* Price Input */}
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleUpdateItemField(item.id, 'price', parseInt(e.target.value, 10) || 0)
                            }
                            className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-orange-500"
                          />
                        </td>

                        {/* Stock Input */}
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            value={item.stock}
                            onChange={(e) =>
                              handleUpdateItemField(item.id, 'stock', parseInt(e.target.value, 10) || 0)
                            }
                            className="w-14 px-1.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white text-center focus:outline-none focus:border-orange-500"
                          />
                        </td>

                        {/* Actions */}
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Hapus dari daftar import"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mode Selection & Import Execution Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="text-xs font-semibold text-slate-300">
                    Metode Import ke Katalog:
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="append"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <span>Tambahkan ke Katalog Saat Ini (Append)</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="replace"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <span>Ganti / Bersihkan Seluruh Katalog (Replace)</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCommitImport}
                  disabled={selectedCount === 0}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Import {selectedCount} Produk ke Website</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Format Shopee didukung: .xlsx, .xls, .csv, dan teks salinan tabel</span>
          </div>

          <button
            onClick={closeShopeeModal}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
