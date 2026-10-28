import test from 'node:test';
import assert from 'node:assert/strict';
import {
  JENIS_ACARA_OPTIONS,
  CUSTOM_ACARA_VALUE,
  BAHASA_OPTIONS,
  DURASI_OPTIONS,
  MANDATORY_SECTIONS,
  DEFAULT_FORM_PARAMS,
  getDurasiSpec,
  getContohHarapan,
  resolveEffectiveEventName,
  validateFormParams,
  countScriptWords,
  buildContextualDoaFallback,
  normalizeNaskahDoa,
  formatPlainTextDoa,
} from './doaLogic';

test('JENIS_ACARA_OPTIONS contains all 14 required event types including custom option', () => {
  assert.equal(JENIS_ACARA_OPTIONS.length, 14);
  assert.equal(JENIS_ACARA_OPTIONS[0], 'Pengajian / Majelis Taklim');
  assert.equal(JENIS_ACARA_OPTIONS[13], CUSTOM_ACARA_VALUE);
});

test('BAHASA_OPTIONS and DURASI_OPTIONS match required options and defaults', () => {
  assert.equal(BAHASA_OPTIONS.length, 3);
  assert.equal(DURASI_OPTIONS.length, 5);
  const threeMin = getDurasiSpec('3 Menit');
  assert.equal(threeMin.targetKataLabel, '± 350–450 kata');
  assert.equal(threeMin.deskripsiSingkat, 'Khidmat & Proporsional');
});

test('getContohHarapan returns contextual expectations for each event type and custom events', () => {
  const pelantikan = getContohHarapan('Pelantikan Jabatan / Pengurus');
  assert.ok(pelantikan.includes('amanah'));

  const customHarapan = getContohHarapan(
    CUSTOM_ACARA_VALUE,
    'Haflah Akhirussanah Santri'
  );
  assert.ok(customHarapan.includes('Haflah Akhirussanah Santri'));
});

test('validateFormParams enforces custom event name when Lainnya is selected', () => {
  const invalidCustom = validateFormParams({
    ...DEFAULT_FORM_PARAMS,
    jenisAcara: CUSTOM_ACARA_VALUE,
    acaraLainnya: '  ',
  });
  assert.equal(invalidCustom.valid, false);
  assert.ok(invalidCustom.errorMessage);

  const validCustom = validateFormParams({
    ...DEFAULT_FORM_PARAMS,
    jenisAcara: CUSTOM_ACARA_VALUE,
    acaraLainnya: 'Muktamar Ulama Nusantara',
  });
  assert.equal(validCustom.valid, true);
  assert.equal(
    resolveEffectiveEventName({
      ...DEFAULT_FORM_PARAMS,
      jenisAcara: CUSTOM_ACARA_VALUE,
      acaraLainnya: 'Muktamar Ulama Nusantara',
    }),
    'Muktamar Ulama Nusantara'
  );
});

test('buildContextualDoaFallback produces all 5 sequential mandatory sections and source distinctions', () => {
  const naskah = buildContextualDoaFallback(DEFAULT_FORM_PARAMS);
  assert.equal(naskah.bagian_doa.length, 5);
  assert.deepEqual(
    naskah.bagian_doa.map((b) => b.nama_bagian),
    MANDATORY_SECTIONS
  );

  const hasMaTsur = naskah.bagian_doa.some(
    (b) => b.jenis_sumber === "Doa Ma'tsur (Al-Qur'an / Hadis)"
  );
  const hasContextual = naskah.bagian_doa.some(
    (b) => b.jenis_sumber === 'Doa Kontekstual Susunan AI'
  );
  assert.equal(hasMaTsur, true);
  assert.equal(hasContextual, true);

  for (const bagian of naskah.bagian_doa) {
    assert.ok(bagian.teks_arab.length > 0);
    assert.ok(bagian.teks_indonesia.length > 0);
  }
});

test('Indonesia Saja mode clears teks_arab as required by JSON schema rules', () => {
  const indoParams = {
    ...DEFAULT_FORM_PARAMS,
    bahasa: 'Indonesia Saja' as const,
  };
  const naskah = buildContextualDoaFallback(indoParams);
  for (const bagian of naskah.bagian_doa) {
    assert.equal(bagian.teks_arab, '');
    assert.ok(bagian.teks_indonesia.length > 0);
  }

  const normalized = normalizeNaskahDoa(
    {
      judul_doa: 'Doa Test',
      ringkasan_adab: 'Adab Test',
      bagian_doa: [
        {
          nama_bagian: 'Pembukaan & Hamdalah',
          jenis_sumber: "Doa Ma'tsur (Al-Qur'an / Hadis)",
          keterangan_dalil: 'QS. Al-Fatihah',
          teks_arab: 'الحمد لله',
          teks_indonesia: 'Segala puji bagi Allah',
        },
      ],
    },
    indoParams
  );
  assert.equal(normalized.bagian_doa[0].teks_arab, '');
});

test('countScriptWords and formatPlainTextDoa compute accurate word counts and formatted output', () => {
  const naskah = buildContextualDoaFallback(DEFAULT_FORM_PARAMS);
  const stats = countScriptWords(naskah);
  assert.ok(stats.totalWords > 100);
  assert.ok(stats.arabWords > 20);
  assert.ok(stats.indonesiaWords > 50);

  const plainText = formatPlainTextDoa(naskah, 'Arab + Indonesia');
  assert.ok(plainText.includes(naskah.judul_doa.toUpperCase()));
  assert.ok(plainText.includes('Pembukaan & Hamdalah'));
});
