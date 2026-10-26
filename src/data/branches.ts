import { Branch, PresetModel } from '../types';

export const BRANCHES: Branch[] = [
  {
    id: 'smg-simpang-lima',
    city: 'Semarang (Simpang Lima)',
    mallName: 'Matahari Plasa Simpang Lima Lt. 3 Plasa 1',
    address: 'Jl. Ahmad Yani No. 1, Simpang Lima, Semarang Tengah, Kota Semarang, Jawa Tengah 50241',
    phone: '024-8458-888',
    whatsapp: '6281288880017',
    operationalHours: 'Senin - Sabtu: 09.30 - 18.00 WIB',
    mapsUrl: 'https://maps.google.com/?q=Plasa+Simpang+Lima+Semarang',
    hasTechnicianOnSite: true,
  },
  {
    id: 'smg-sriwijaya',
    city: 'Semarang (Sriwijaya / Java Mall)',
    mallName: 'Kevin 88 Comp Sriwijaya Semarang',
    address: 'Kawasan Niaga Sriwijaya & Java Supermall, Wonodri, Semarang Selatan, Kota Semarang',
    phone: '024-8418-888',
    whatsapp: '6281288880014',
    operationalHours: 'Senin - Sabtu: 09.00 - 17.30 WIB',
    mapsUrl: 'https://maps.google.com/?q=Java+Supermall+Semarang',
    hasTechnicianOnSite: true,
  },
  {
    id: 'solo-comp',
    city: 'Solo (Surakarta)',
    mallName: 'Toko Kevin 88 Comp Solo',
    address: 'Sentra Komputer Solo, Jawa Tengah (Dekat Singosaren / UNS)',
    phone: '0271-658-888',
    whatsapp: '6281288880019',
    operationalHours: 'Senin - Sabtu: 09.30 - 18.00 WIB',
    mapsUrl: 'https://maps.google.com/?q=Solo+Computer+Center',
    hasTechnicianOnSite: true,
  },
  {
    id: 'madiun-comp',
    city: 'Madiun',
    mallName: 'Kevin 88 Comp Madiun',
    address: 'Pusat Elektronik & Sparepart Komputer, Kota Madiun, Jawa Timur',
    phone: '0351-468-888',
    whatsapp: '6281288880020',
    operationalHours: 'Senin - Sabtu: 09.00 - 17.30 WIB',
    mapsUrl: 'https://maps.google.com/?q=Madiun+Jawa+Timur',
    hasTechnicianOnSite: true,
  },
  {
    id: 'jogja-comp',
    city: 'Yogyakarta',
    mallName: 'Kevin 88 Comp Jogja (Jogjatronik)',
    address: 'Kawasan Jogjatronik Mall & Sentra IT, Gondomanan, Kota Yogyakarta 55121',
    phone: '0274-558-888',
    whatsapp: '6281288880018',
    operationalHours: 'Senin - Sabtu: 10.00 - 18.00 WIB',
    mapsUrl: 'https://maps.google.com/?q=Jogjatronik+Mall+Yogyakarta',
    hasTechnicianOnSite: true,
  },
  {
    id: 'jkt-mangga-dua',
    city: 'Jakarta Pusat',
    mallName: 'Mall Mangga Dua Lt. 3 No. 42B',
    address: 'Jl. Mangga Dua Raya, Ancol, Pademangan, Jakarta Pusat 14430',
    phone: '021-6288-8812',
    whatsapp: '6281288880014',
    operationalHours: 'Senin - Sabtu: 10.00 - 18.00 WIB',
    mapsUrl: 'https://maps.google.com/?q=Mall+Mangga+Dua+Jakarta',
    hasTechnicianOnSite: true,
  },
  {
    id: 'sby-hi-tech',
    city: 'Surabaya',
    mallName: 'Hi-Tech Mall (THR) Lt. 2 Blok B No. 15',
    address: 'Jl. Kusuma Bangsa No. 116-118, Tambaksari, Surabaya 60136',
    phone: '031-5348-888',
    whatsapp: '6281288880015',
    operationalHours: 'Senin - Sabtu: 10.00 - 18.00 WIB',
    mapsUrl: 'https://maps.google.com/?q=Hi-Tech+Mall+Surabaya',
    hasTechnicianOnSite: true,
  }
];

export const COMPATIBILITY_PRESETS: PresetModel[] = [
  {
    brand: 'Lenovo',
    series: 'IdeaPad Slim 3 14" / S145 Series',
    models: ['Slim 3 14ARE05', 'Slim 3 14IIL05', 'Slim 3 14ADA05', 'S145-14IWL', 'S145-14API', 'Lenovo V14-IIL'],
    recommendedParts: {
      battery: 'L19M2PB0 / L19L2PB0 (7.68V - 35Wh Li-Polymer)',
      charger: '20V 3.25A (65W) Jack Bulat 4.0 x 1.7mm atau USB-C 65W PD',
      keyboard: 'Lenovo Non-frame 320/330/S145 Layout US',
      lcd: '14.0 Slim 30 Pin FHD (1920x1080) IPS Bazel Tipis',
      ramType: 'DDR4 3200MHz SODIMM (Up to 16GB / 20GB Total)',
      ssdType: 'M.2 NVMe PCIe 2280 (Support Gen 3 / Gen 4)',
      fan: 'Fan DC 5V 4-Pin Single Silent'
    }
  },
  {
    brand: 'Asus',
    series: 'Vivobook 14 (A412 / A416 / X412)',
    models: ['Vivobook A412FA', 'Vivobook A412FL', 'Vivobook A416MA', 'Vivobook A416JA', 'X412DA'],
    recommendedParts: {
      battery: 'C21N1818 / C21N1818-1 (7.7V - 37Wh)',
      charger: '19V 3.42A (65W) Colokan Jarum Kecil 4.0 x 1.35mm',
      keyboard: 'Asus A412 / A416 Tanam Palmrest Black/Silver',
      lcd: '14.0 Slim 30 Pin Full HD IPS NanoEdge',
      ramType: 'DDR4 SODIMM 2666MHz / 3200MHz',
      ssdType: 'M.2 NVMe PCIe + Port SATA 2.5 Flex',
      fan: 'Fan Asus Vivobook Slim 4-Pin'
    }
  },
  {
    brand: 'Asus',
    series: 'TUF Gaming (FX505 / FX506 / FA506)',
    models: ['FX505DT', 'FX505DU', 'FX506LH', 'FX506LU', 'FA506IH', 'FA506IV'],
    recommendedParts: {
      battery: 'B31N1726 (11.4V - 48Wh) / 90Wh Upgrade Kit',
      charger: '20V 7.5A (150W) atau 20V 9A (180W) Jack 6.0 x 3.7mm Center Pin',
      keyboard: 'Asus TUF Gaming FX505 RGB / Red Backlight WASD Transparan',
      lcd: '15.6 Slim 40 Pin FHD 144Hz IPS Gaming',
      ramType: 'Dual Channel SODIMM DDR4 3200MHz (Up to 32GB/64GB)',
      ssdType: 'Dual Slot M.2 NVMe PCIe 2280',
      fan: 'Set Dual Fan Kipas CPU + GPU DFSCK571051514'
    }
  },
  {
    brand: 'Acer',
    series: 'Aspire 3 & 5 (A314 / A514 / Swift 3)',
    models: ['Aspire 3 A314-22', 'Aspire 3 A314-35', 'Aspire 5 A514-54', 'Swift 3 SF314-42', 'Swift 3 SF314-57'],
    recommendedParts: {
      battery: 'AP19B8M / AP18C8K (11.25V - 50Wh)',
      charger: '19V 2.37A (45W) atau 19V 3.42A (65W) Jack 3.0 x 1.1mm Biru/Kuning',
      keyboard: 'Acer A314/A514 Backlight US Layout',
      lcd: '14.0 Slim 30 Pin FHD IPS Matte Anti-Glare',
      ramType: 'DDR4 2666MHz / 3200MHz SODIMM',
      ssdType: 'M.2 NVMe PCIe Gen3/Gen4 2280',
      fan: 'Fan Acer Aspire Slim 5V 0.5A'
    }
  },
  {
    brand: 'HP',
    series: 'HP 14s / Pavilion 14',
    models: ['HP 14s-dk0000', 'HP 14s-cf0000', 'HP 14s-dq0000', 'HP Pavilion 14-ce', 'HP Pavilion 14-bf'],
    recommendedParts: {
      battery: 'HT03XL / L11119-855 (11.55V - 41.9Wh)',
      charger: '19.5V 2.31A (45W) / 19.5V 3.33A (65W) Colokan Jarum Biru 4.5 x 3.0mm',
      keyboard: 'HP 14s Tanam Silver/Hitam US Layout',
      lcd: '14.0 Slim 30-Pin eDP HD / FHD IPS',
      ramType: 'DDR4 2400MHz / 3200MHz SODIMM Dual Slot',
      ssdType: 'M.2 NVMe PCIe M-Key 2280',
      fan: 'HP 14s Series 4-Pin CPU Cooler Fan'
    }
  },
  {
    brand: 'Dell',
    series: 'Inspiron 14 & 15 (3000 / 5000 Series / Vostro)',
    models: ['Inspiron 14 3480', 'Inspiron 3501', 'Inspiron 5402', 'Vostro 3400', 'Vostro 3500'],
    recommendedParts: {
      battery: 'WN000 / YRDD6 / 42Wh 3-Cell Li-ion',
      charger: '19.5V 2.31A (45W) / 19.5V 3.34A (65W) Colokan Kecil 4.5 x 3.0mm',
      keyboard: 'Dell Inspiron 14 US QWERTY Non-Backlight / Backlight',
      lcd: '14.0 atau 15.6 Slim 30 Pin FHD IPS',
      ramType: 'DDR4 3200MHz SODIMM Dual Channel',
      ssdType: 'M.2 NVMe 2230/2280 PCIe SSD',
      fan: 'Dell Inspiron DC 5V 0.5A Hydraulic Fan'
    }
  }
];
