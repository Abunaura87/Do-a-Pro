import React, { useState } from 'react';
import {
  History,
  Trash2,
  FolderOpen,
  Search,
  BookOpenCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  SavedDoaRecord,
  countScriptWords,
  resolveEffectiveEventName,
} from '../utils/doaLogic';

interface HistorySectionProps {
  records: SavedDoaRecord[];
  onLoadRecord: (record: SavedDoaRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  records,
  onLoadRecord,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = records.filter((rec) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const eventName = resolveEffectiveEventName(rec.params).toLowerCase();
    const title = rec.naskah.judul_doa.toLowerCase();
    const harapan = rec.params.harapanKhusus.toLowerCase();
    return (
      eventName.includes(q) || title.includes(q) || harapan.includes(q)
    );
  });

  return (
    <div className="space-y-8 no-print">
      {/* Standar Amanah Ilmiah Explanation Section */}
      <section
        id="standar-ilmiah"
        aria-labelledby="heading-amanah-ilmiah"
        className="soft-3d-card p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#d4af37]/25">
          <div>
            <p className="text-xs font-semibold text-[#047857]">
              03. Pedoman Penyusunan &amp; Klasifikasi Dalil
            </p>
            <h2
              id="heading-amanah-ilmiah"
              className="text-lg sm:text-xl font-bold text-[#06281e] mt-1"
            >
              Standar Amanah Ilmiah Naskah Do&apos;a
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#eef5f2]/70 border border-[#047857]/20 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#047857] mb-2">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Doa Ma&apos;tsur (Al-Qur&apos;an / Hadis)</span>
            </div>
            <p className="text-xs sm:text-sm text-[#06281e]/85 leading-relaxed">
              Lafaz doa yang bersumber langsung dari ayat suci Al-Qur&apos;an maupun
              Sunnah Rasulullah SAW yang sahih/masyhur. Dilengkapi rujukan nama
              surat dan nomor ayat atau perawi hadis agar terjaga keasliannya.
            </p>
          </div>

          <div className="rounded-2xl bg-[#fef9c3]/45 border border-[#d4af37]/40 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#ca8a04] mb-2">
              <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
              <span>Doa Kontekstual Susunan AI</span>
            </div>
            <p className="text-xs sm:text-sm text-[#06281e]/85 leading-relaxed">
              Rangkaian munajat dan permohonan yang disusun secara kontekstual
              mengikuti hajat acara, nama tokoh, atau instansi yang didoakan,
              tanpa dinisbatkan secara palsu sebagai ayat atau hadis Nabi SAW.
            </p>
          </div>
        </div>
      </section>

      {/* Riwayat Naskah Doa Tersimpan */}
      <section
        id="riwayat-doa"
        aria-labelledby="heading-riwayat-doa"
        className="soft-3d-card p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#d4af37]/25">
          <div>
            <p className="text-xs font-semibold text-[#047857] tabular-nums">
              04. Database Lokal Tertanam · {records.length} Naskah Tersimpan
            </p>
            <h2
              id="heading-riwayat-doa"
              className="text-lg sm:text-xl font-bold text-[#06281e] mt-1 flex items-center gap-2"
            >
              <History className="w-5 h-5 text-[#047857]" aria-hidden="true" />
              <span>Riwayat Naskah Do&apos;a &amp; Munajat</span>
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="w-4 h-4 text-[#06281e]/50 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Cari riwayat naskah doa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau jenis acara..."
              className="w-full rounded-xl bg-[#eef5f2]/80 border border-[#06281e]/15 focus:border-[#059669] focus:bg-white pl-9 pr-3.5 py-2 text-xs sm:text-sm text-[#06281e] outline-none"
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-10 text-sm text-[#06281e]/70">
            Belum ada riwayat naskah doa yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((rec) => {
              const eventName = resolveEffectiveEventName(rec.params);
              const wordStats = countScriptWords(rec.naskah);
              const formattedDate = new Date(rec.createdAt).toLocaleDateString(
                'id-ID',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }
              );

              return (
                <article
                  key={rec.id}
                  className="rounded-2xl bg-[#eef5f2]/55 border border-[#06281e]/12 p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#047857] font-semibold tabular-nums">
                      <span>{eventName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.params.durasi}</span>
                      <span aria-hidden="true">·</span>
                      <span>{wordStats.totalWords} kata</span>
                    </div>

                    <h3 className="text-base font-bold text-[#06281e] mt-1.5 line-clamp-2">
                      {rec.naskah.judul_doa}
                    </h3>

                    <p className="text-xs text-[#06281e]/75 mt-2 line-clamp-2 leading-relaxed">
                      {rec.params.harapanKhusus || rec.naskah.ringkasan_adab}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#06281e]/10">
                    <span className="text-xs text-[#06281e]/60 tabular-nums">
                      Disimpan {formattedDate}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onLoadRecord(rec)}
                        aria-label={`Buka naskah ${rec.naskah.judul_doa}`}
                        className="px-3 py-1.5 rounded-xl bg-[#06281e] hover:bg-[#0b3b2c] text-[#fef9c3] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#fde047]" />
                        <span>Muat Naskah</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id)}
                        aria-label={`Hapus naskah ${rec.naskah.judul_doa}`}
                        className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-[#06281e]/70 hover:text-red-700 border border-[#06281e]/15 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
