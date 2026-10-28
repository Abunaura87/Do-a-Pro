import React, { useState } from 'react';
import {
  Copy,
  Check,
  BookmarkPlus,
  Printer,
  Maximize2,
  BookMarked,
  Feather,
  Type as TypeIcon,
  Edit3,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import {
  BagianDoa,
  BahasaDoa,
  DurasiDoa,
  NaskahDoa,
  countScriptWords,
  formatPlainTextDoa,
} from '../utils/doaLogic';

interface DoaScriptCardProps {
  naskah: NaskahDoa;
  bahasa: BahasaDoa;
  durasi: DurasiDoa;
  isLoading: boolean;
  isStreaming?: boolean;
  streamingStatus?: string;
  streamingSnippet?: string;
  onSaveToHistory: () => void;
  onOpenPodium: () => void;
  onUpdateNaskah?: (updated: NaskahDoa) => void;
}

export const DoaScriptCard: React.FC<DoaScriptCardProps> = ({
  naskah,
  bahasa,
  durasi,
  isLoading,
  isStreaming = false,
  streamingStatus = '',
  streamingSnippet = '',
  onSaveToHistory,
  onOpenPodium,
  onUpdateNaskah,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [arabScale, setArabScale] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [isEditMode, setIsEditMode] = useState(false);

  const stats = countScriptWords(naskah);

  const arabFontSizeClass =
    arabScale === 'normal'
      ? 'text-2xl sm:text-[1.7rem]'
      : arabScale === 'large'
        ? 'text-[1.75rem] sm:text-3xl'
        : 'text-3xl sm:text-4xl';

  const handleCopyAll = async () => {
    const text = formatPlainTextDoa(naskah, bahasa);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopySection = async (idx: number) => {
    const b = naskah.bagian_doa[idx];
    if (!b) return;
    const parts = [
      `${idx + 1}. ${b.nama_bagian} (${b.jenis_sumber} — ${b.keterangan_dalil})`,
      bahasa !== 'Indonesia Saja' && b.teks_arab ? b.teks_arab : '',
      bahasa !== 'Arab Saja (Full)' && b.teks_indonesia ? b.teks_indonesia : '',
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(parts.join('\n\n'));
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    onSaveToHistory();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSectionTextChange = (
    index: number,
    field: 'teks_arab' | 'teks_indonesia' | 'nama_bagian' | 'keterangan_dalil',
    val: string
  ) => {
    if (!onUpdateNaskah) return;
    const nextBagian: BagianDoa[] = naskah.bagian_doa.map((b, i) =>
      i === index ? { ...b, [field]: val } : b
    );
    onUpdateNaskah({
      ...naskah,
      bagian_doa: nextBagian,
    });
  };

  const handleTitleChange = (val: string) => {
    if (!onUpdateNaskah) return;
    onUpdateNaskah({
      ...naskah,
      judul_doa: val,
    });
  };

  return (
    <section
      id="lembar-naskah"
      aria-labelledby="heading-judul-doa"
      className="soft-3d-card p-6 sm:p-8 relative"
    >
      {/* Top Title & Action Toolbar */}
      <div className="pb-5 mb-6 border-b border-[#d4af37]/30 space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#047857] tabular-nums">
            <span>02. Lembar Naskah Khidmat</span>
            <span aria-hidden="true">·</span>
            <span>{bahasa}</span>
            <span aria-hidden="true">·</span>
            <span>Target {durasi}</span>
            <span aria-hidden="true">·</span>
            <span>{stats.totalWords} Kata</span>
            {isStreaming && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>Riil Time Streaming</span>
              </span>
            )}
          </div>

          {isEditMode ? (
            <input
              type="text"
              aria-label="Edit Judul Naskah Doa"
              value={naskah.judul_doa}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-xl sm:text-2xl font-extrabold text-[#06281e] mt-1.5 bg-[#eef5f2] border border-[#047857] rounded-xl px-3 py-1.5 outline-none"
            />
          ) : (
            <h1
              id="heading-judul-doa"
              className="text-xl sm:text-2xl font-extrabold text-[#06281e] mt-1.5 text-balance"
            >
              {naskah.judul_doa}
            </h1>
          )}
        </div>

        {/* Action Toolbar in a single balanced row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 no-print">
          <div
            role="group"
            aria-label="Ukuran Huruf Arab"
            className="flex items-center bg-[#eef5f2] rounded-xl p-1 border border-[#06281e]/10"
          >
            <TypeIcon className="w-3.5 h-3.5 text-[#047857] ml-2 mr-1" />
            {(
              [
                { id: 'normal', label: 'A' },
                { id: 'large', label: 'A+' },
                { id: 'xlarge', label: 'A++' },
              ] as const
            ).map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() => setArabScale(sz.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  arabScale === sz.id
                    ? 'bg-[#06281e] text-[#fef9c3]'
                    : 'text-[#06281e]/75 hover:text-[#06281e]'
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Inline Direct Editing Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                isEditMode
                  ? 'bg-[#047857] text-[#fef9c3] border-[#d4af37]'
                  : 'bg-[#eef5f2] hover:bg-[#e2ece8] text-[#06281e] border-[#06281e]/15'
              }`}
            >
              {isEditMode ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#fde047]" />
                  <span>Selesai Edit</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Edit Naskah</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-2 rounded-xl bg-[#fef9c3] hover:bg-[#fde047]/70 text-[#06281e] border border-[#d4af37]/60 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Tersimpan di Riwayat</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 text-[#ca8a04]" />
                  <span>Simpan Riwayat</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyAll}
              className="px-3.5 py-2 rounded-xl bg-[#eef5f2] hover:bg-[#e2ece8] text-[#06281e] border border-[#06281e]/15 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Salin Semua</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#eef5f2] hover:bg-[#e2ece8] text-[#06281e] border border-[#06281e]/15 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#047857]" />
              <span>Cetak</span>
            </button>

            <button
              type="button"
              onClick={onOpenPodium}
              className="px-3.5 py-2 rounded-xl bg-[#06281e] hover:bg-[#0b3b2c] text-[#fef9c3] border border-[#d4af37]/50 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#fde047]" />
              <span>Layar Mimbar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ringkasan Adab Banner */}
      <div className="rounded-2xl bg-[#eef5f2]/85 border border-[#d4af37]/35 px-4 py-3.5 mb-7 flex items-start gap-3">
        <BookMarked className="w-5 h-5 text-[#047857] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#06281e]/90 leading-relaxed">
          <span className="font-bold text-[#06281e]">Panduan Adab Pembacaan: </span>
          {naskah.ringkasan_adab}
        </div>
      </div>

      {/* Real-time Streaming Box when AI is actively streaming */}
      {(isLoading || isStreaming) && (
        <div
          aria-live="polite"
          className="rounded-2xl bg-[#06281e] text-[#fef9c3] p-5 mb-6 border border-[#d4af37] shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#fde047] animate-pulse" />
              <span className="text-sm font-bold text-[#fde047]">
                {streamingStatus || 'Sedang Menyusun Naskah Doa Riil Time...'}
              </span>
            </div>
            <span className="text-xs text-[#eef5f2]/75 font-mono">
              Live Token Stream
            </span>
          </div>

          {streamingSnippet && (
            <div className="rounded-xl bg-[#031711]/90 p-3 font-mono text-xs text-[#eef5f2]/85 max-h-24 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-[#d4af37]/25">
              {streamingSnippet}
            </div>
          )}
        </div>
      )}

      {/* 5 Sequential Sections of Doa */}
      <div className="divide-y divide-[#06281e]/10 space-y-8">
        {naskah.bagian_doa.map((bagian, index) => {
          const isMaTsur =
            bagian.jenis_sumber === "Doa Ma'tsur (Al-Qur'an / Hadis)";
          const showArab =
            bahasa !== 'Indonesia Saja' && Boolean(bagian.teks_arab?.trim());
          const showIndo =
            bahasa !== 'Arab Saja (Full)' && Boolean(bagian.teks_indonesia?.trim());

          return (
            <article
              key={`${bagian.nama_bagian}-${index}`}
              className={index > 0 ? 'pt-8' : ''}
            >
              {/* Section Header & Scholarly Source Attribution */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-[#06281e] tabular-nums">
                    0{index + 1}. {bagian.nama_bagian}
                  </span>
                  <span aria-hidden="true" className="text-[#06281e]/40">
                    ·
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      isMaTsur ? 'text-[#047857]' : 'text-[#ca8a04]'
                    }`}
                  >
                    {isMaTsur ? (
                      <BookMarked className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Feather className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{bagian.jenis_sumber}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopySection(index)}
                  aria-label={`Salin bagian ${bagian.nama_bagian}`}
                  className="text-xs font-semibold text-[#047857] hover:text-[#06281e] flex items-center gap-1 transition-colors no-print cursor-pointer"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Bagian Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Bagian</span>
                    </>
                  )}
                </button>
              </div>

              {/* Keterangan Dalil / Sumber */}
              <p className="text-xs text-[#0b3b2c]/80 font-medium mb-4">
                Rujukan / Keterangan: {bagian.keterangan_dalil}
              </p>

              {/* Arabic Vocalized Text (Render or Editable Textarea) */}
              {showArab && (
                <>
                  {isEditMode ? (
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-[#06281e] mb-1">
                        Edit Teks Arab (RTL):
                      </label>
                      <textarea
                        dir="rtl"
                        rows={3}
                        value={bagian.teks_arab}
                        onChange={(e) =>
                          handleSectionTextChange(
                            index,
                            'teks_arab',
                            e.target.value
                          )
                        }
                        className="w-full font-arabic text-xl rounded-xl bg-white border border-[#047857] p-3 text-right outline-none"
                      />
                    </div>
                  ) : (
                    <div
                      dir="rtl"
                      lang="ar"
                      className={`font-arabic ${arabFontSizeClass} text-[#031711] text-right bg-[#eef5f2]/55 rounded-2xl px-5 py-5 mb-4 tracking-normal select-text`}
                    >
                      {bagian.teks_arab}
                    </div>
                  )}
                </>
              )}

              {/* Indonesian Translation / Munajat (Render or Editable Textarea) */}
              {showIndo && (
                <>
                  {isEditMode ? (
                    <div className="mb-2">
                      <label className="block text-xs font-bold text-[#06281e] mb-1">
                        Edit Untaian Munajat / Terjemahan Bahasa Indonesia:
                      </label>
                      <textarea
                        rows={3}
                        value={bagian.teks_indonesia}
                        onChange={(e) =>
                          handleSectionTextChange(
                            index,
                            'teks_indonesia',
                            e.target.value
                          )
                        }
                        className="w-full text-sm rounded-xl bg-white border border-[#047857] p-3 outline-none leading-relaxed"
                      />
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-[#06281e]/90 leading-relaxed italic">
                      &ldquo;{bagian.teks_indonesia}&rdquo;
                    </p>
                  )}
                </>
              )}

              {/* When Arab Saja (Full) is selected, provide subtle guide note */}
              {bahasa === 'Arab Saja (Full)' && bagian.teks_indonesia && !isEditMode && (
                <p className="text-xs text-[#06281e]/65 mt-2 leading-relaxed">
                  Makna ringkas: {bagian.teks_indonesia}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
