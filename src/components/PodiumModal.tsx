import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, BookMarked, Feather } from 'lucide-react';
import { BahasaDoa, NaskahDoa } from '../utils/doaLogic';

interface PodiumModalProps {
  isOpen: boolean;
  naskah: NaskahDoa;
  bahasa: BahasaDoa;
  onClose: () => void;
}

export const PodiumModal: React.FC<PodiumModalProps> = ({
  isOpen,
  naskah,
  bahasa,
  onClose,
}) => {
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="podium-modal-title"
      className="fixed inset-0 z-50 bg-[#031711]/95 text-[#fef9c3] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
        {/* Sticky Podium Header */}
        <div className="sticky top-2 z-10 rounded-2xl bg-[#06281e]/95 border border-[#d4af37]/50 px-5 py-3.5 flex items-center justify-between gap-4 mb-8 shadow-lg">
          <div>
            <p className="text-xs text-[#fde047] font-semibold">
              Mode Baca Mimbar / Podium Khidmat
            </p>
            <h2
              id="podium-modal-title"
              className="text-base sm:text-lg font-extrabold text-white truncate max-w-md sm:max-w-xl"
            >
              {naskah.judul_doa}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFontScale((s) => Math.max(0.85, s - 0.15))}
              aria-label="Perkecil ukuran teks mimbar"
              className="px-3 py-1.5 rounded-xl bg-[#0b3b2c] hover:bg-[#047857] text-[#fef9c3] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
              <span>A-</span>
            </button>
            <button
              type="button"
              onClick={() => setFontScale((s) => Math.min(1.45, s + 0.15))}
              aria-label="Perbesar ukuran teks mimbar"
              className="px-3 py-1.5 rounded-xl bg-[#0b3b2c] hover:bg-[#047857] text-[#fef9c3] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
              <span>A+</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Mode Mimbar"
              className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#fde047] text-[#031711] text-xs font-extrabold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Tutup</span>
            </button>
          </div>
        </div>

        {/* Adab Reminder */}
        <div className="rounded-2xl bg-[#0b3b2c]/80 border border-[#d4af37]/30 px-5 py-4 mb-8 text-sm text-[#eef5f2]/90">
          <span className="font-bold text-[#fde047]">Adab Membaca: </span>
          {naskah.ringkasan_adab}
        </div>

        {/* Sequential Sections */}
        <div className="space-y-10 pb-16">
          {naskah.bagian_doa.map((bagian, index) => {
            const isMaTsur =
              bagian.jenis_sumber === "Doa Ma'tsur (Al-Qur'an / Hadis)";
            return (
              <div
                key={index}
                className="rounded-3xl bg-[#06281e] border border-[#d4af37]/35 p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#d4af37]/20">
                  <span className="text-base font-extrabold text-[#fde047]">
                    0{index + 1}. {bagian.nama_bagian}
                  </span>
                  <span className="text-xs font-semibold text-[#eef5f2]/80 flex items-center gap-1.5">
                    {isMaTsur ? (
                      <BookMarked className="w-3.5 h-3.5 text-[#fde047]" />
                    ) : (
                      <Feather className="w-3.5 h-3.5 text-[#fde047]" />
                    )}
                    <span>
                      {bagian.jenis_sumber} · {bagian.keterangan_dalil}
                    </span>
                  </span>
                </div>

                {bahasa !== 'Indonesia Saja' && bagian.teks_arab && (
                  <p
                    dir="rtl"
                    lang="ar"
                    style={{ fontSize: `${2 * fontScale}rem` }}
                    className="font-arabic text-right text-white mb-6"
                  >
                    {bagian.teks_arab}
                  </p>
                )}

                {bahasa !== 'Arab Saja (Full)' && bagian.teks_indonesia && (
                  <p
                    style={{ fontSize: `${1.08 * fontScale}rem` }}
                    className="text-[#eef5f2]/90 leading-relaxed italic"
                  >
                    &ldquo;{bagian.teks_indonesia}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
