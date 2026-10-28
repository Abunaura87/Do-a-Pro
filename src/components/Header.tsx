import React from 'react';
import { BookOpen, Heart, Maximize2 } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenPodium: () => void;
}

export const Header: React.FC<HeaderProps> = ({ savedCount, onOpenPodium }) => {
  return (
    <header className="soft-3d-header sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Lockup */}
        <a
          href="#penyusun-doa"
          className="flex items-center gap-3.5 group focus:outline-none whitespace-nowrap shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0b3b2c] to-[#031711] border border-[#d4af37]/60 shadow-inner flex items-center justify-center relative shrink-0">
            <BookOpen className="w-5 h-5 text-[#fde047]" aria-hidden="true" />
            <Heart
              className="w-3 h-3 text-[#d4af37] fill-[#d4af37] absolute -bottom-1 -right-1"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Do&apos;a &amp; Munajat
              </span>
              <span className="text-xs font-extrabold tracking-wider text-[#fde047] border-b border-[#d4af37]">
                PRO
              </span>
            </div>
            <p className="text-xs text-[#eef5f2]/85 font-medium hidden sm:block">
              Asisten Penyusun Naskah Doa Acara &amp; Munajat Khidmat
            </p>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#eef5f2]/90"
        >
          <a
            href="#penyusun-doa"
            className="hover:text-[#fde047] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Parameter Doa
          </a>
          <a
            href="#lembar-naskah"
            className="hover:text-[#fde047] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Lembar Naskah
          </a>
          <a
            href="#standar-ilmiah"
            className="hover:text-[#fde047] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Amanah Ilmiah
          </a>
          <a
            href="#riwayat-doa"
            className="hover:text-[#fde047] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Riwayat Tersimpan ({savedCount})
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenPodium}
            className="px-4 py-2 rounded-xl bg-[#0b3b2c] hover:bg-[#06281e] text-[#fef9c3] border border-[#d4af37]/60 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-[#fde047]" aria-hidden="true" />
            <span>Mode Mimbar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
