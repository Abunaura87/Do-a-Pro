import React from 'react';
import {
  Sparkles,
  Loader2,
  Clock,
  Languages,
  Calendar,
  FileText,
  Wand2,
  Tag,
  Radio,
} from 'lucide-react';
import {
  BAHASA_OPTIONS,
  CUSTOM_ACARA_VALUE,
  DURASI_OPTIONS,
  DoaFormParams,
  JENIS_ACARA_OPTIONS,
  getDurasiSpec,
  getContohHarapan,
} from '../utils/doaLogic';

interface DoaFormCardProps {
  params: DoaFormParams;
  isLoading: boolean;
  errorMessage: string | null;
  lastAutoSavedTime: string;
  onChangeParams: (next: DoaFormParams) => void;
  onFillContohHarapan: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QUICK_TAGS = [
  { label: '+ Tokoh/Pejabat', template: 'Tokoh / Pejabat: Bapak/Ibu [Nama Lengkap], jabatan [Nama Jabatan]' },
  { label: '+ Mempelai', template: 'Mempelai: Ananda [Nama Pria] & Ananda [Nama Wanita]' },
  { label: '+ Almarhum/ah', template: 'Almarhum/Almarhumah: [Nama Almarhum bin/binti Ayah]' },
  { label: '+ Lembaga/Instansi', template: 'Lembaga / Organisasi: [Nama Instansi / Majelis / Perusahaan]' },
  { label: '+ Hajat Keberkahan', template: 'Hajat: Diberikan kelancaran, kemudahan rizki yang berkah, dan dijauhkan dari segala marabahaya' },
];

export const DoaFormCard: React.FC<DoaFormCardProps> = ({
  params,
  isLoading,
  errorMessage,
  lastAutoSavedTime,
  onChangeParams,
  onFillContohHarapan,
  onSubmit,
}) => {
  const activeDurasiSpec = getDurasiSpec(params.durasi);
  const isCustomAcara = params.jenisAcara === CUSTOM_ACARA_VALUE;

  const handleAppendTag = (template: string) => {
    const current = params.harapanKhusus.trim();
    const updated = current ? `${current}\n• ${template}` : `• ${template}`;
    onChangeParams({
      ...params,
      harapanKhusus: updated,
    });
  };

  return (
    <section
      id="penyusun-doa"
      aria-labelledby="heading-parameter-doa"
      className="soft-3d-card p-6 sm:p-7 no-print"
    >
      <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[#d4af37]/25">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#047857] tracking-wide">
            <Radio className="w-3.5 h-3.5 text-[#059669] animate-pulse" aria-hidden="true" />
            <span>01. Konfigurasi Majelis · Riil Time Auto-Save ({lastAutoSavedTime})</span>
          </div>
          <h2
            id="heading-parameter-doa"
            className="text-xl font-bold text-[#06281e] mt-1"
          >
            Parameter Penyusunan Do&apos;a &amp; Munajat
          </h2>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 1. Pilih Jenis Acara / Majelis */}
        <div>
          <label
            htmlFor="select-jenis-acara"
            className="flex items-center gap-2 text-sm font-bold text-[#06281e] mb-2"
          >
            <Calendar className="w-4 h-4 text-[#047857]" aria-hidden="true" />
            <span>Pilih Jenis Acara / Majelis</span>
          </label>
          <select
            id="select-jenis-acara"
            value={params.jenisAcara}
            onChange={(e) => {
              const nextJenis = e.target.value;
              const currentDefault = getContohHarapan(
                params.jenisAcara,
                params.acaraLainnya
              );
              const shouldAutoUpdateHarapan =
                !params.harapanKhusus.trim() ||
                params.harapanKhusus.trim() === currentDefault.trim();
              onChangeParams({
                ...params,
                jenisAcara: nextJenis,
                harapanKhusus: shouldAutoUpdateHarapan
                  ? getContohHarapan(nextJenis, params.acaraLainnya)
                  : params.harapanKhusus,
              });
            }}
            className="w-full rounded-2xl bg-[#eef5f2]/70 border border-[#0b3b2c]/20 focus:border-[#059669] focus:bg-white px-4 py-3 text-sm font-semibold text-[#06281e] outline-none transition-colors cursor-pointer"
          >
            {JENIS_ACARA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {isCustomAcara && (
            <div className="mt-3">
              <label
                htmlFor="input-acara-lainnya"
                className="block text-xs font-bold text-[#0b3b2c] mb-1.5"
              >
                Tulis Nama Jenis Acara Spesifik
              </label>
              <input
                id="input-acara-lainnya"
                type="text"
                value={params.acaraLainnya}
                onChange={(e) =>
                  onChangeParams({
                    ...params,
                    acaraLainnya: e.target.value,
                  })
                }
                placeholder="Contoh: Haflah Akhirussanah & Khotmil Qur'an Santri..."
                className="w-full rounded-xl bg-white border border-[#d4af37]/60 focus:border-[#059669] px-4 py-2.5 text-sm text-[#06281e] placeholder:text-[#06281e]/45 outline-none"
              />
            </div>
          )}
        </div>

        {/* 2. Pilihan Bahasa Doa */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#06281e] mb-2.5">
            <Languages className="w-4 h-4 text-[#047857]" aria-hidden="true" />
            <span>Pilihan Bahasa Doa</span>
          </div>
          <div
            role="group"
            aria-label="Pilihan Bahasa Doa"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
          >
            {BAHASA_OPTIONS.map((option) => {
              const isSelected = params.bahasa === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onChangeParams({
                      ...params,
                      bahasa: option.id,
                    })
                  }
                  aria-pressed={isSelected}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors border text-center whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#06281e] text-[#fef9c3] border-[#d4af37] shadow-sm'
                      : 'bg-[#eef5f2]/65 text-[#06281e] border-[#06281e]/15 hover:bg-[#e2ece8]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#0b3b2c]/75 mt-2">
            {BAHASA_OPTIONS.find((b) => b.id === params.bahasa)?.desc}
          </p>
        </div>

        {/* 3. Estimasi Durasi Pembacaan Doa */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#06281e]">
              <Clock className="w-4 h-4 text-[#047857]" aria-hidden="true" />
              <span>Estimasi Durasi Pembacaan Doa</span>
            </div>
          </div>

          <div
            role="group"
            aria-label="Estimasi Durasi Pembacaan Doa"
            className="grid grid-cols-3 sm:grid-cols-5 gap-2"
          >
            {DURASI_OPTIONS.map((dur) => {
              const isSelected = params.durasi === dur.id;
              return (
                <button
                  key={dur.id}
                  type="button"
                  onClick={() =>
                    onChangeParams({
                      ...params,
                      durasi: dur.id,
                    })
                  }
                  aria-pressed={isSelected}
                  className={`px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors border text-center whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#047857] text-[#fef9c3] border-[#d4af37] shadow-sm'
                      : 'bg-[#eef5f2]/65 text-[#06281e] border-[#06281e]/15 hover:bg-[#e2ece8]'
                  }`}
                >
                  {dur.label}
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-[#0b3b2c] bg-[#fef9c3]/55 border border-[#d4af37]/35 rounded-xl px-3.5 py-2">
            <span className="font-semibold">
              Target Naskah: {activeDurasiSpec.targetKataLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#06281e]/85 font-medium">
              {activeDurasiSpec.deskripsiSingkat}
            </span>
          </div>
        </div>

        {/* 4. Tujuan / Harapan Khusus / Nama Tokoh & Instansi */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <label
              htmlFor="textarea-harapan-khusus"
              className="flex items-center gap-2 text-sm font-bold text-[#06281e]"
            >
              <FileText className="w-4 h-4 text-[#047857]" aria-hidden="true" />
              <span>Tujuan / Harapan Khusus / Tokoh &amp; Instansi</span>
            </label>
            <button
              type="button"
              onClick={onFillContohHarapan}
              className="px-3 py-1.5 rounded-xl bg-[#fef9c3] hover:bg-[#fde047]/60 text-[#06281e] border border-[#d4af37]/60 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#ca8a04]" aria-hidden="true" />
              <span>Contoh Harapan</span>
            </button>
          </div>

          <textarea
            id="textarea-harapan-khusus"
            rows={4}
            value={params.harapanKhusus}
            onChange={(e) =>
              onChangeParams({
                ...params,
                harapanKhusus: e.target.value,
              })
            }
            placeholder="Tuliskan nama tokoh, instansi, atau hajat khusus yang ingin dimuat dalam untaian doa..."
            className="w-full rounded-2xl bg-[#eef5f2]/60 border border-[#0b3b2c]/20 focus:border-[#059669] focus:bg-white p-3.5 text-sm text-[#06281e] leading-relaxed placeholder:text-[#06281e]/45 outline-none transition-colors"
          />

          {/* Quick Insert Chips */}
          <div className="mt-2.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#047857] mb-1.5">
              <Tag className="w-3 h-3" />
              <span>Sisipkan Cepat Sesuai Keinginan Anda:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleAppendTag(tag.template)}
                  className="px-2.5 py-1 rounded-lg bg-[#eef5f2] hover:bg-[#e2ece8] text-[#06281e] text-[11px] font-medium border border-[#06281e]/15 transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-semibold text-red-800"
          >
            {errorMessage}
          </div>
        )}

        {/* 5. Tombol Utama 3D Hijau-Emas */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full soft-3d-button-primary rounded-2xl py-4 px-6 text-sm sm:text-base font-extrabold text-[#fef9c3] flex items-center justify-center gap-2.5 disabled:opacity-65 cursor-pointer whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 text-[#fde047] animate-spin" />
              <span>Menyusun Riil Time &amp; Menyesuaikan Hajat...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#fde047]" />
              <span>Susun Naskah Do&apos;a &amp; Munajat (Riil Time)</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};
