import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { X, Check, HelpCircle } from 'lucide-react';

export const FaqEditModal: React.FC = () => {
  const { isFaqModalOpen, closeFaqModal, editingFaq, addFaq, updateFaq } = useSiteData();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
    } else {
      setQuestion('');
      setAnswer('');
    }
  }, [editingFaq, isFaqModalOpen]);

  if (!isFaqModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (editingFaq) {
      updateFaq(editingFaq.id, { question, answer });
    } else {
      addFaq({ question, answer });
    }
    closeFaqModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingFaq ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Pertanyaan yang sering ditanyakan seputar sparepart & garansi.
              </p>
            </div>
          </div>
          <button
            onClick={closeFaqModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Pertanyaan (FAQ)
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Berapa lama masa garansi sparepart?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Jawaban Lengkap
            </label>
            <textarea
              required
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Tuliskan jawaban yang jelas dan membantu pelanggan..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={closeFaqModal}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>{editingFaq ? 'Simpan Perubahan' : 'Tambahkan ke FAQ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
