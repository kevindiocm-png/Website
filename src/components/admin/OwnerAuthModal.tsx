import React, { useState } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { loginAsOwner } from '../../firebase/dbService';
import {
  X,
  Lock,
  ShieldCheck,
  Key,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export const OwnerAuthModal: React.FC = () => {
  const {
    isOwnerAuthModalOpen,
    closeOwnerAuthModal,
    verifyOwnerPin,
    setAdminMode,
    showToast,
  } = useSiteData();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  if (!isOwnerAuthModalOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pin.trim()) {
      setErrorMsg('Silakan masukkan PIN keamanan pemilik.');
      return;
    }

    const isValid = verifyOwnerPin(pin.trim());
    if (isValid) {
      setPin('');
      setErrorMsg('');
    } else {
      setErrorMsg('PIN Keamanan salah! Akses ditolak. Hanya pemilik sah toko yang dapat mengedit.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoadingGoogle(true);
      setErrorMsg('');
      await loginAsOwner('kevindiocm@gmail.com');
      setAdminMode(true);
      closeOwnerAuthModal();
      showToast('Login Pemilik Berhasil! Mode Edit Toko diaktifkan.', 'success');
    } catch (err: any) {
      setErrorMsg('Gagal masuk dengan Google: ' + (err?.message || 'Silakan gunakan PIN pemilik.'));
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Akses Khusus Pemilik Toko
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  Owner Only
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hanya pemilik Kevin 88 Computer yang dapat mengedit website
              </p>
            </div>
          </div>

          <button
            onClick={closeOwnerAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Notice for Customers vs Owner */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Sistem Proteksi Keamanan Toko</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Pelanggan umum hanya diperbolehkan berbelanja pada mode customer. Untuk mengubah katalog, harga, tema, dan tata letak, Anda harus memverifikasi hak pemilik.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Option A: Quick Owner PIN */}
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Masukkan PIN Keamanan Pemilik:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN Pemilik (Default: 8888)"
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm tracking-widest focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
            >
              <span>Verifikasi PIN & Masuk Mode Edit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] font-mono text-slate-500 uppercase">
              atau login Google
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Option B: Google Login for Owner */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {/* Google colored G icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoadingGoogle ? 'Memproses...' : 'Login Google Pemilik (kevindiocm@gmail.com)'}</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Akun resmi pemilik: <strong className="text-slate-400">kevindiocm@gmail.com</strong>
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">
            Toko Kevin 88 Computer
          </span>
          <button
            onClick={closeOwnerAuthModal}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
          >
            Batal (Mode Customer)
          </button>
        </div>
      </div>
    </div>
  );
};
