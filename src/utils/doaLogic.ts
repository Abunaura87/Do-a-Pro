export type BahasaDoa = 'Arab + Indonesia' | 'Arab Saja (Full)' | 'Indonesia Saja';

export type DurasiDoa = '1 Menit' | '3 Menit' | '5 Menit' | '7 Menit' | '10 Menit';

export type JenisSumberDoa =
  | "Doa Ma'tsur (Al-Qur'an / Hadis)"
  | 'Doa Kontekstual Susunan AI';

export interface BagianDoa {
  nama_bagian: string;
  jenis_sumber: JenisSumberDoa;
  keterangan_dalil: string;
  teks_arab: string;
  teks_indonesia: string;
}

export interface NaskahDoa {
  judul_doa: string;
  ringkasan_adab: string;
  bagian_doa: BagianDoa[];
}

export interface DoaFormParams {
  jenisAcara: string;
  acaraLainnya: string;
  bahasa: BahasaDoa;
  durasi: DurasiDoa;
  harapanKhusus: string;
}

export interface SavedDoaRecord {
  id: string;
  createdAt: string;
  params: DoaFormParams;
  naskah: NaskahDoa;
}

export const CUSTOM_ACARA_VALUE = 'Lainnya (Tulis Jenis Acara Sendiri...)';

export const JENIS_ACARA_OPTIONS: string[] = [
  'Pengajian / Majelis Taklim',
  'Pelantikan Jabatan / Pengurus',
  'Rapat / Musyawarah Kerja',
  'Peringatan Maulid Nabi Muhammad SAW',
  'Peringatan Isra Mikraj',
  "Pernikahan / Walimatul 'Ursy",
  'Syukuran / Tasyakuran Nikmat',
  'Wisuda / Kelulusan',
  'Kegiatan Pendidikan / Sekolah / Pesantren',
  'Takziah / Doa Arwah & Keluarga Duka',
  'Doa Kesembuhan Orang Sakit',
  'Pembukaan Kegiatan Resmi',
  'Penutupan Kegiatan Resmi',
  CUSTOM_ACARA_VALUE,
];

export const BAHASA_OPTIONS: {
  id: BahasaDoa;
  label: string;
  desc: string;
}[] = [
  {
    id: 'Arab + Indonesia',
    label: 'Arab + Indonesia',
    desc: 'Lafaz Arab berharakat lengkap disertai munajat & terjemahan khidmat',
  },
  {
    id: 'Arab Saja (Full)',
    label: 'Arab Saja (Full)',
    desc: 'Seluruh untaian doa dalam bahasa Arab fasih berharakat lengkap',
  },
  {
    id: 'Indonesia Saja',
    label: 'Indonesia Saja',
    desc: 'Untaian munajat bahasa Indonesia puitis disertai transliterasi seperlunya',
  },
];

export interface DurasiSpec {
  id: DurasiDoa;
  label: string;
  targetKataLabel: string;
  deskripsiSingkat: string;
  minWords: number;
  maxWords: number;
}

export const DURASI_OPTIONS: DurasiSpec[] = [
  {
    id: '1 Menit',
    label: '1 Menit',
    targetKataLabel: '± 130–180 kata',
    deskripsiSingkat: 'Ringkas, Padat & Inti',
    minWords: 130,
    maxWords: 180,
  },
  {
    id: '3 Menit',
    label: '3 Menit',
    targetKataLabel: '± 350–450 kata',
    deskripsiSingkat: 'Khidmat & Proporsional',
    minWords: 350,
    maxWords: 450,
  },
  {
    id: '5 Menit',
    label: '5 Menit',
    targetKataLabel: '± 600–750 kata',
    deskripsiSingkat: 'Mendalam & Komprehensif',
    minWords: 600,
    maxWords: 750,
  },
  {
    id: '7 Menit',
    label: '7 Menit',
    targetKataLabel: '± 850–1.050 kata',
    deskripsiSingkat: 'Untaian Munajat Lengkap',
    minWords: 850,
    maxWords: 1050,
  },
  {
    id: '10 Menit',
    label: '10 Menit',
    targetKataLabel: '± 1.200–1.500 kata',
    deskripsiSingkat: 'Kajian Doa & Muhasabah Panjang',
    minWords: 1200,
    maxWords: 1500,
  },
];

export const CONTOH_HARAPAN_MAP: Record<string, string> = {
  'Pengajian / Majelis Taklim':
    'Semoga ilmu yang dikaji di Majelis Taklim Al-Ikhlas hari ini menjadi ilmu yang bermanfaat, melembutkan hati seluruh jamaah, mempererat ukhuwah Islamiyah warga, serta mendatangkan keberkahan bagi guru kami dan seluruh keluarga besar jamaah.',
  'Pelantikan Jabatan / Pengurus':
    'Memohon kekuatan, sifat amanah, kejujuran, dan kebijaksanaan bagi para pengurus periode 2026–2030 yang baru dilantik agar mampu mengemban tanggung jawab dengan adil, dijauhkan dari khianat, dan membawa kemajuan yang berkah bagi organisasi serta masyarakat.',
  'Rapat / Musyawarah Kerja':
    'Semoga Musyawarah Kerja Tahunan ini diliputi kejernihan pikiran, kelapangan dada, dan kesatuan hati untuk melahirkan keputusan serta program kerja terbaik yang maslahat, realistis, dan diridhai Allah SWT.',
  'Peringatan Maulid Nabi Muhammad SAW':
    'Semoga peringatan Maulid Nabi Muhammad SAW ini menumbuhkan kecintaan sejati kepada Rasulullah SAW, menghidupkan sunnah dan akhlak mulia beliau dalam keluarga serta lingkungan masyarakat, dan kelak memperoleh syafaat uzhma di Yaumil Qiyamah.',
  'Peringatan Isra Mikraj':
    'Semoga hikmah Isra Mikraj menguatkan kualitas salat lima waktu berjamaah, meneguhkan keimanan di tengah ujian zaman, serta menjadikan salat sebagai penyejuk hati dan pencegah perbuatan keji maupun mungkar.',
  "Pernikahan / Walimatul 'Ursy":
    'Memohon keberkahan bagi kedua mempelai (Ananda Ahmad Fadhil & Ananda Zahra Humaira) agar dikaruniai keluarga yang sakinah, mawaddah, wa rahmah, disatukan dalam kebaikan, serta dianugerahi keturunan yang saleh dan salihah.',
  'Syukuran / Tasyakuran Nikmat':
    'Mensyukuri limpahan nikmat kesehatan, rezeki yang halal, dan pencapaian keluarga besar Bapak H. Abdullah, seraya memohon agar nikmat ini menambah ketawadhuan, kedermawanan, dan keberkahan yang langgeng.',
  'Wisuda / Kelulusan':
    'Semoga para wisudawan dan wisudawati angkatan ini dikaruniai ilmu yang amaliyah dan amal yang ilmiyah, dimudahkan meraih pengabdian serta karir yang mulia, dan senantiasa berbakti kepada orang tua, agama, dan bangsa.',
  'Kegiatan Pendidikan / Sekolah / Pesantren':
    'Memohon keberkahan bagi para pendidik, asatidz, dan santri/siswa agar diberikan kemudahan memahami ilmu syar’i maupun ilmu sains, dijaga akhlaknya, serta dijadikan generasi rabbani yang mencerahkan umat.',
  'Takziah / Doa Arwah & Keluarga Duka':
    'Memohon ampunan, rahmat, dan kelapangan kubur bagi almarhum/almarhumah, diterima seluruh amal ibadahnya, diampuni kekhilafannya, serta keluarga yang ditinggalkan diberikan ketabahan, keikhlasan, dan kekuatan iman.',
  'Doa Kesembuhan Orang Sakit':
    'Memohon kesembuhan yang sempurna (syifaan la yughadiru saqaman) bagi saudara/orang tua kami yang sedang diuji sakit, diangkat rasa nyerinya, dijadikan penggugur dosa, dan dikuatkan kesabaran keluarga yang merawat.',
  'Pembukaan Kegiatan Resmi':
    'Memohon kelancaran, kemudahan, dan perlindungan dari awal hingga akhir rangkaian acara resmi ini agar berjalan tertib, memberi manfaat nyata bagi peserta, serta bernilai ibadah di sisi Allah SWT.',
  'Penutupan Kegiatan Resmi':
    'Mensyukuri terlaksananya seluruh rangkaian kegiatan dengan lancar, memohon agar hasil kegiatan dapat ditindaklanjuti dengan penuh amanah, dan memohon ampunan atas segala kekurangan selama penyelenggaraan acara.',
  [CUSTOM_ACARA_VALUE]:
    'Semoga kegiatan ini senantiasa dinaungi rahmat dan keberkahan Allah SWT, dimudahkan segala urusan para panitia dan peserta, serta membuahkan kebaikan dunia dan akhirat.',
};

export const MANDATORY_SECTIONS = [
  'Pembukaan & Hamdalah',
  'Selawat Nabi SAW',
  'Permohonan Utama',
  'Untaian Munajat Khusus',
  'Doa Penutup',
];

export const DEFAULT_FORM_PARAMS: DoaFormParams = {
  jenisAcara: 'Pengajian / Majelis Taklim',
  acaraLainnya: '',
  bahasa: 'Arab + Indonesia',
  durasi: '3 Menit',
  harapanKhusus: CONTOH_HARAPAN_MAP['Pengajian / Majelis Taklim'],
};

export function getDurasiSpec(durasi: DurasiDoa): DurasiSpec {
  return (
    DURASI_OPTIONS.find((item) => item.id === durasi) || DURASI_OPTIONS[1]
  );
}

export function getContohHarapan(jenisAcara: string, acaraLainnya?: string): string {
  if (jenisAcara === CUSTOM_ACARA_VALUE && acaraLainnya?.trim()) {
    return `Semoga pelaksanaan ${acaraLainnya.trim()} ini berjalan khidmat, lancar, dan penuh keberkahan, mempererat persaudaraan seluruh hadirin, serta menghadirkan kemaslahatan nyata yang diridhai Allah SWT.`;
  }
  return (
    CONTOH_HARAPAN_MAP[jenisAcara] ||
    CONTOH_HARAPAN_MAP['Pengajian / Majelis Taklim']
  );
}

export function resolveEffectiveEventName(params: DoaFormParams): string {
  if (params.jenisAcara === CUSTOM_ACARA_VALUE) {
    const trimmed = params.acaraLainnya.trim();
    return trimmed.length > 0 ? trimmed : 'Majelis & Acara Khusus';
  }
  return params.jenisAcara;
}

export function validateFormParams(params: DoaFormParams): {
  valid: boolean;
  errorMessage?: string;
} {
  if (
    params.jenisAcara === CUSTOM_ACARA_VALUE &&
    params.acaraLainnya.trim().length < 3
  ) {
    return {
      valid: false,
      errorMessage:
        'Mohon tuliskan nama jenis acara terlebih dahulu (minimal 3 karakter) pada kolom Jenis Acara Sendiri.',
    };
  }
  return { valid: true };
}

export function countWordsInText(text: string): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function countScriptWords(naskah: NaskahDoa): {
  totalWords: number;
  arabWords: number;
  indonesiaWords: number;
  estimatedMinutes: number;
} {
  let arabWords = 0;
  let indonesiaWords = 0;

  for (const bagian of naskah.bagian_doa) {
    arabWords += countWordsInText(bagian.teks_arab);
    indonesiaWords += countWordsInText(bagian.teks_indonesia);
  }

  const totalWords = arabWords + indonesiaWords;
  const estimatedMinutes = Math.max(1, Math.round(totalWords / 130));

  return {
    totalWords,
    arabWords,
    indonesiaWords,
    estimatedMinutes,
  };
}

export function formatPlainTextDoa(naskah: NaskahDoa, bahasa: BahasaDoa): string {
  const lines: string[] = [];
  lines.push(`====================================================`);
  lines.push(naskah.judul_doa.toUpperCase());
  lines.push(`====================================================`);
  lines.push(`Panduan Adab: ${naskah.ringkasan_adab}`);
  lines.push('');

  naskah.bagian_doa.forEach((bagian, idx) => {
    lines.push(`${idx + 1}. ${bagian.nama_bagian}`);
    lines.push(`   Sumber: ${bagian.jenis_sumber} — ${bagian.keterangan_dalil}`);
    if (bahasa !== 'Indonesia Saja' && bagian.teks_arab.trim()) {
      lines.push('');
      lines.push(`   ${bagian.teks_arab.trim()}`);
    }
    if (bahasa !== 'Arab Saja (Full)' && bagian.teks_indonesia.trim()) {
      lines.push('');
      lines.push(`   "${bagian.teks_indonesia.trim()}"`);
    }
    lines.push('');
    lines.push('----------------------------------------------------');
  });

  return lines.join('\n');
}

export function normalizeNaskahDoa(
  raw: Partial<NaskahDoa>,
  params: DoaFormParams
): NaskahDoa {
  const fallback = buildContextualDoaFallback(params);
  const judul_doa =
    typeof raw.judul_doa === 'string' && raw.judul_doa.trim()
      ? raw.judul_doa.trim()
      : fallback.judul_doa;
  const ringkasan_adab =
    typeof raw.ringkasan_adab === 'string' && raw.ringkasan_adab.trim()
      ? raw.ringkasan_adab.trim()
      : fallback.ringkasan_adab;

  const rawBagian = Array.isArray(raw.bagian_doa) ? raw.bagian_doa : [];
  if (rawBagian.length === 0) {
    return fallback;
  }

  const normalizedBagian: BagianDoa[] = rawBagian.map((item, idx) => {
    const jenis_sumber: JenisSumberDoa =
      item?.jenis_sumber === "Doa Ma'tsur (Al-Qur'an / Hadis)"
        ? "Doa Ma'tsur (Al-Qur'an / Hadis)"
        : 'Doa Kontekstual Susunan AI';

    const teks_arab =
      params.bahasa === 'Indonesia Saja'
        ? ''
        : typeof item?.teks_arab === 'string'
          ? item.teks_arab.trim()
          : '';

    const teks_indonesia =
      typeof item?.teks_indonesia === 'string'
        ? item.teks_indonesia.trim()
        : '';

    return {
      nama_bagian:
        typeof item?.nama_bagian === 'string' && item.nama_bagian.trim()
          ? item.nama_bagian.trim()
          : MANDATORY_SECTIONS[idx] || `Bagian Doa ${idx + 1}`,
      jenis_sumber,
      keterangan_dalil:
        typeof item?.keterangan_dalil === 'string' && item.keterangan_dalil.trim()
          ? item.keterangan_dalil.trim()
          : jenis_sumber === "Doa Ma'tsur (Al-Qur'an / Hadis)"
            ? "Lafaz Ma'tsur dari Al-Qur'an dan Sunnah Nabawiyah"
            : 'Susunan munajat kontekstual sesuai adab doa acara',
      teks_arab,
      teks_indonesia,
    };
  });

  return {
    judul_doa,
    ringkasan_adab,
    bagian_doa: normalizedBagian,
  };
}

export function buildContextualDoaFallback(params: DoaFormParams): NaskahDoa {
  const namaAcara = resolveEffectiveEventName(params);
  const isIndoOnly = params.bahasa === 'Indonesia Saja';
  const rawHarapan = params.harapanKhusus.trim();
  const harapan =
    rawHarapan ||
    getContohHarapan(params.jenisAcara, params.acaraLainnya);

  const isLong =
    params.durasi === '5 Menit' ||
    params.durasi === '7 Menit' ||
    params.durasi === '10 Menit';

  // Customize title if user wrote a specific event or hope
  let dynamicTitle = `Naskah Do'a & Munajat Khidmat: ${namaAcara}`;
  if (params.jenisAcara === CUSTOM_ACARA_VALUE && params.acaraLainnya.trim()) {
    dynamicTitle = `Naskah Do'a & Munajat Khidmat: ${params.acaraLainnya.trim()}`;
  }

  const permohonanMaTsurByEvent: Record<
    string,
    { dalil: string; arab: string; indo: string }
  > = {
    'Pengajian / Majelis Taklim': {
      dalil: 'QS. Thaha: 114 & HR. Ibnu Majah no. 925 (Hadis Sahih)',
      arab: 'رَبِّ زِدْنِي عِلْمًا، اللَّهُمَّ إِنَّا نَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا، اللَّهُمَّ انْفَعْنَا بِمَا عَلَّمْتَنَا، وَعَلِّمْنَا مَا يَنْفَعُنَا، وَزِدْنَا عِلْمًا وَهُدًى وَتُقًى.',
      indo: 'Ya Rabb kami, tambahkanlah kepada kami ilmu pengetahuan. Ya Allah, sesungguhnya kami memohon kepada-Mu ilmu yang bermanfaat, rezeki yang halal lagi baik, dan amal ibadah yang diterima. Ya Allah, berikanlah manfaat atas ilmu yang telah Engkau ajarkan kepada kami, ajarkanlah kepada kami apa yang bermanfaat bagi kami, serta tambahkanlah kepada kami ilmu, petunjuk, dan ketakwaan.',
    },
    'Pelantikan Jabatan / Pengurus': {
      dalil: 'QS. Al-Isra: 80 & HR. Muslim no. 1826 (Doa Amanah Kepemimpinan)',
      arab: 'رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَلْ لِي مِنْ لَدُنْكَ سُلْطَانًا نَصِيرًا. اللَّهُمَّ مَنْ وَلِيَ مِنْ أَمْرِ أُمَّتِي شَيْئًا فَرَفَقَ بِهِمْ فَارْفُقْ بِهِ.',
      indo: 'Ya Rabbku, masukkanlah aku ke tempat masuk yang benar dan keluarkanlah pula aku ke tempat keluar yang benar, serta berikanlah kepadaku dari sisi-Mu kekuasaan yang menolong. Ya Allah, siapa saja yang mengemban amanah urusan umat ini lalu ia berlaku santun dan kasih sayang kepada mereka, maka limpahkanlah kelembutan dan pertolongan-Mu kepadanya.',
    },
    "Pernikahan / Walimatul 'Ursy": {
      dalil: 'HR. Abu Dawud no. 2130, Tirmidzi no. 1091 & QS. Al-Furqan: 74',
      arab: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ. رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا.',
      indo: 'Semoga Allah melimpahkan keberkahan kepadamu dalam suka maupun duka, dan menghimpun kalian berdua dalam kebaikan. Ya Rabb kami, anugerahkanlah kepada kami pasangan hidup dan keturunan kami sebagai penyejuk mata kami, dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.',
    },
    'Takziah / Doa Arwah & Keluarga Duka': {
      dalil: 'HR. Muslim no. 963 (Doa Jenazah / Arwah dalam Shahih Muslim)',
      arab: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ.',
      indo: 'Ya Allah, ampunilah dirinya, rahmatilah ia, sejahterakanlah ia, dan maafkanlah segala kekhilafannya. Muliakanlah tempat persinggahannya, luaskanlah alam kuburnya, basuhlah ia dengan air, salju, dan embun yang sejuk, serta bersihkanlah ia dari segala dosa sebagaimana kain putih dibersihkan dari noda.',
    },
    'Doa Kesembuhan Orang Sakit': {
      dalil: 'HR. Bukhari no. 5675 & Muslim no. 2191 (Doa Ruqyah & Kesembuhan)',
      arab: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا.',
      indo: 'Ya Allah, Rabb seluruh manusia, hilangkanlah rasa sakit dan penyakit ini. Sembuhkanlah, karena Engkaulah Maha Penyembuh; tiada kesembuhan sejati melainkan kesembuhan dari sisi-Mu, kesembuhan paripurna yang tidak menyisakan rasa sakit sedikit pun.',
    },
  };

  const selectedMaTsur = permohonanMaTsurByEvent[params.jenisAcara] || {
    dalil: 'QS. Al-Kahfi: 10, QS. Al-Baqarah: 286 & HR. Muslim no. 2722',
    arab: 'رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا. اللَّهُمَّ إِنَّا نَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى، رَبِّ يَسِّرْ وَلَا تُعَسِّرْ رَبِّ تَمِّمْ بِالْخَيْرِ.',
    indo: 'Ya Rabb kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah bagi kami petunjuk yang lurus dalam urusan kami ini. Ya Allah, kami memohon kepada-Mu petunjuk, ketakwaan, kehormatan diri, dan kecukupan hati. Ya Rabb kami, mudahkanlah urusan kami dan jangan Engkau persulit, serta sempurnakanlah dengan penuh kebaikan.',
  };

  const extraLongMunajatArab = isLong
    ? ' اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا، وَأَصْلِحْ ذَاتَ بَيْنِنَا، وَاهْدِنَا سُبُلَ السَّلَامِ، وَنَجِّنَا مِنَ الظُّلُمَاتِ إِلَى النُّورِ، وَبَارِكْ لَنَا فِي أَسْمَاعِنَا وَأَبْصَارِنَا وَقُلُوبِنَا وَأَزْوَاجِنَا وَذُرِّيَّاتِنَا وَأَوْقَاتِنَا وَأَعْمَالِنَا.'
    : '';

  const extraLongMunajatIndo = isLong
    ? ' Ya Allah, satukanlah hati-hati kami dalam ketaatan kepada-Mu, damaikanlah hubungan di antara kami, tunjukkanlah kepada kami jalan-jalan keselamatan, dan keluarkanlah kami dari gelapnya kelalaian menuju cahaya iman. Berkahilah pendengaran kami, pandangan kami, hati kami, keluarga kami, serta setiap langkah pengabdian yang kami ikhtiarkan bersama.'
    : '';

  return {
    judul_doa: dynamicTitle,
    ringkasan_adab:
      'Awali dengan merendahkan hati, menghadap kiblat bila memungkinkan, mengangkat kedua tangan dengan penuh harap (raja’) dan takut (khauf), serta membacanya dengan suara lembut, tartil, dan tidak tergesa-gesa.',
    bagian_doa: [
      {
        nama_bagian: 'Pembukaan & Hamdalah',
        jenis_sumber: "Doa Ma'tsur (Al-Qur'an / Hadis)",
        keterangan_dalil:
          'QS. Al-Fatihah: 1–2, Istighfar Nabawi (HR. Muslim) & Tahmid Pembuka Majelis',
        teks_arab: isIndoOnly
          ? ''
          : 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ (٣×). بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا الشَّاكِرِينَ، حَمْدًا النَّاعِمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ، يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ الْكَرِيمِ وَعَظِيمِ سُلْطَانِكَ.',
        teks_indonesia:
          'Aku memohon ampun kepada Allah Yang Maha Agung, tiada Tuhan yang berhak disembah selain Dia Yang Maha Hidup lagi Maha Mengurus makhluk-Nya, dan aku bertobat kepada-Nya (3x). Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah Tuhan semesta alam; pujian orang-orang yang bersyukur, pujian hamba-hamba yang menikmati karunia-Nya, pujian yang sebanding dengan limpahan nikmat-Nya dan menandingi tambahan anugerah-Nya. Wahai Rabb kami, hanya bagi-Mu segala puji sebagaimana layak bagi keagungan wajah-Mu yang mulia dan kebesaran kekuasaan-Mu.',
      },
      {
        nama_bagian: 'Selawat Nabi SAW',
        jenis_sumber: "Doa Ma'tsur (Al-Qur'an / Hadis)",
        keterangan_dalil:
          'QS. Al-Ahzab: 56 & Selawat Ibrahimiyah (HR. Bukhari no. 3370 & Muslim no. 406)',
        teks_arab: isIndoOnly
          ? ''
          : 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا صَلَّيْتَ وَبَارَكْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ.',
        teks_indonesia:
          'Ya Allah, limpahkanlah rahmat, kemuliaan, keselamatan, dan keberkahan kepada junjungan kami Nabi Muhammad SAW beserta keluarga dan seluruh sahabat beliau, sebagaimana Engkau telah melimpahkan rahmat dan keberkahan kepada Nabi Ibrahim AS dan keluarganya di seluruh alam. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
      },
      {
        nama_bagian: 'Permohonan Utama',
        jenis_sumber: "Doa Ma'tsur (Al-Qur'an / Hadis)",
        keterangan_dalil: selectedMaTsur.dalil,
        teks_arab: isIndoOnly ? '' : selectedMaTsur.arab,
        teks_indonesia: selectedMaTsur.indo,
      },
      {
        nama_bagian: 'Untaian Munajat Khusus',
        jenis_sumber: 'Doa Kontekstual Susunan AI',
        keterangan_dalil: `Susunan munajat kontekstual khusus untuk acara ${namaAcara} sesuai adab doa ulama`,
        teks_arab: isIndoOnly
          ? ''
          : `اللَّهُمَّ يَا مُجِيبَ السَّائِلِينَ وَيَا قَاضِيَ الْحَاجَاتِ، اجْعَلْ جَمْعَنَا هَذَا فِي هَذَا الْمَجْلِسِ الْمُبَارَكِ جَمْعًا مَرْحُومًا، وَتَفَرُّقَنَا مِنْ بَعْدِهِ تَفَرُّقًا مَعْصُومًا، وَلَا تَجْعَلْ فِينَا وَلَا مَعَنَا شَقِيًّا وَلَا مَحْرُومًا.${extraLongMunajatArab}`,
        teks_indonesia: `Ya Allah, Wahai Dzat Yang Maha Mengabulkan permohonan hamba yang menengadahkan tangan, di dalam majelis ${namaAcara} yang penuh khidmat ini kami bersimpuh di hadapan-Mu. Jadikanlah perkumpulan kami hari ini sebagai perkumpulan yang Engkau rahmati, dan perpisahan kami setelahnya sebagai perpisahan yang Engkau pelihara dari dosa. Ya Allah, kabulkanlah harapan dan ikhtiar kami bersama: ${harapan}${extraLongMunajatIndo}`,
      },
      {
        nama_bagian: 'Doa Penutup',
        jenis_sumber: "Doa Ma'tsur (Al-Qur'an / Hadis)",
        keterangan_dalil:
          'QS. Al-Baqarah: 201 (Doa Sapu Jagat), QS. Ali Imran: 8 & QS. Ash-Shaffat: 180–182',
        teks_arab: isIndoOnly
          ? ''
          : 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ، وَسَلَامٌ عَلَى الْمُرْسَلِينَ، وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.',
        teks_indonesia:
          'Ya Rabb kami, janganlah Engkau condongkan hati kami kepada kesesatan setelah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu; sesungguhnya Engkau Maha Pemberi karunia. Ya Rabb kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, serta peliharalah kami dari siksa api neraka. Mahasuci Tuhanmu, Tuhan Pemilik kemuliaan dari apa yang mereka sifatkan. Dan kesejahteraan dilimpahkan atas para rasul. Segala puji bagi Allah Tuhan seluruh alam. Aamiin ya Rabbal ‘Alamiin.',
      },
    ],
  };
}
