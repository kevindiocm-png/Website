import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { Product } from '../../types';
import { PRESET_IMAGES } from '../../data/defaultSettings';
import { CATEGORIES, BRANDS } from '../../data/products';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

export const ProductEditModal: React.FC = () => {
  const { isProductModalOpen, closeProductModal, editingProduct, addProduct, updateProduct } = useSiteData();

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'baterai',
    brand: 'Lenovo',
    compatibleModels: [],
    partNumber: '',
    price: 350000,
    originalPrice: 400000,
    stock: 20,
    warrantyMonths: 6,
    specs: [
      { label: 'Tipe Komponen', value: 'Original Replacement' },
      { label: 'Kondisi', value: '100% Baru Bergaransi' },
    ],
    image: '/assets/images/category_batteries_chargers_1790149138356.jpg',
    isPopular: false,
    description: '',
    condition: 'Baru (Original)',
  });

  const [modelsInput, setModelsInput] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        brand: editingProduct.brand,
        compatibleModels: editingProduct.compatibleModels || [],
        partNumber: editingProduct.partNumber || '',
        price: editingProduct.price || 0,
        originalPrice: editingProduct.originalPrice || 0,
        stock: editingProduct.stock ?? 10,
        warrantyMonths: editingProduct.warrantyMonths || 3,
        specs: editingProduct.specs && editingProduct.specs.length > 0 ? editingProduct.specs : [
          { label: 'Tipe Komponen', value: 'Original Replacement' }
        ],
        image: editingProduct.image || '/assets/images/category_batteries_chargers_1790149138356.jpg',
        isPopular: !!editingProduct.isPopular,
        description: editingProduct.description || '',
        condition: editingProduct.condition || 'Baru (Original)',
      });
      setModelsInput((editingProduct.compatibleModels || []).join(', '));
    } else {
      // Default new product form
      setFormData({
        name: '',
        category: 'baterai',
        brand: 'Asus',
        compatibleModels: [],
        partNumber: '',
        price: 350000,
        originalPrice: 420000,
        stock: 15,
        warrantyMonths: 6,
        specs: [
          { label: 'Kondisi', value: '100% Baru Bersegel' },
          { label: 'Garansi', value: '6 Bulan Tukar Baru' },
        ],
        image: '/assets/images/category_batteries_chargers_1790149138356.jpg',
        isPopular: true,
        description: 'Sparepart laptop bergaransi resmi toko Kevin 88 Computer, lulus uji kompatibilitas dan stabilitas voltase.',
        condition: 'Baru (Original)',
      });
      setModelsInput('');
    }
  }, [editingProduct, isProductModalOpen]);

  if (!isProductModalOpen) return null;

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...formData.specs];
    updated[index][field] = val;
    setFormData({ ...formData, specs: updated });
  };

  const handleAddSpec = () => {
    setFormData({
      ...formData,
      specs: [...formData.specs, { label: 'Spesifikasi', value: 'Detail nilai' }],
    });
  };

  const handleRemoveSpec = (index: number) => {
    setFormData({
      ...formData,
      specs: formData.specs.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedModels = modelsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      compatibleModels: parsedModels.length > 0 ? parsedModels : ['Semua Laptop yang Cocok'],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    closeProductModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ✏️
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Update Produk Sparepart' : 'Tambah Produk Sparepart Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Data langsung disimpan dan tampil di katalog website secara real-time.
              </p>
            </div>
          </div>
          <button
            onClick={closeProductModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Nama Lengkap Sparepart <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Baterai Original Asus Vivobook 14 A412 (C21N1818)"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Row 2: Category, Brand, Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  const matchingPreset = PRESET_IMAGES.find((p) => p.category === cat);
                  setFormData({
                    ...formData,
                    category: cat,
                    image: matchingPreset ? matchingPreset.url : formData.image,
                  });
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {CATEGORIES.filter((c) => c.id !== 'semua').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Brand Laptop
              </label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {BRANDS.filter((b) => b !== 'Semua').map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="Axioo">Axioo</option>
                <option value="MSI">MSI</option>
                <option value="Toshiba">Toshiba</option>
                <option value="Universal">Universal / Semua Brand</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Kondisi & Kualitas
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Baru (Original)">Baru (Original)</option>
                <option value="Baru (OEM Grade A+)">Baru (OEM Grade A+)</option>
                <option value="Baru (High Capacity)">Baru (High Capacity Upgrade)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Part Number & Compatible Models */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Part Number / Kode Part
              </label>
              <input
                type="text"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                placeholder="Contoh: C21N1818, L19M2PB0, ADLX65YLC3A"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Model Laptop Kompatibel (Pisahkan Koma)
              </label>
              <input
                type="text"
                value={modelsInput}
                onChange={(e) => setModelsInput(e.target.value)}
                placeholder="A412FA, A412FL, X412DA, S145-14IWL"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Row 4: Pricing, Stock & Warranty */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-amber-400 mb-1">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Harga Coret / Normal
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={formData.originalPrice || ''}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                placeholder="Opsional diskon"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                Jumlah Stok Unit
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                Garansi (Bulan)
              </label>
              <input
                type="number"
                min="1"
                max="36"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:border-amber-400"
              />
            </div>
          </div>

          {/* Row 5: Image Selection (Presets or Custom URL) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Foto / Gambar Sparepart
              </label>
              <span className="text-[11px] text-slate-400">
                Pilih foto cepat atau masukkan tautan URL
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] border cursor-pointer transition-all ${
                    formData.image === preset.url
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Atau tempel URL gambar kustom (https://...)"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:border-amber-400"
            />
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Deskripsi & Catatan Pemasangan
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tuliskan keunggulan produk, garansi tukar baru, rekomendasi pemasangan..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Row 7: Dynamic Specs List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Spesifikasi Teknis (Voltase, Kapasitas, Port, dll)
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Baris Spesifikasi
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {formData.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                    placeholder="Label (contoh: Voltase)"
                    className="w-1/3 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                    placeholder="Nilai (contoh: 11.4V - 48Wh)"
                    className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(i)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                    title="Hapus baris"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 8: Highlight checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPopular"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="isPopular" className="text-xs text-slate-300">
              Tandai sebagai <span className="text-amber-400 font-semibold">Produk Terlaris / Populer</span> (Badge khusus di katalog)
            </label>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeProductModal}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-400/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
