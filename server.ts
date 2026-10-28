import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  DoaFormParams,
  DEFAULT_FORM_PARAMS,
  getDurasiSpec,
  resolveEffectiveEventName,
  validateFormParams,
  normalizeNaskahDoa,
  buildContextualDoaFallback,
  NaskahDoa,
} from './src/utils/doaLogic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSystemInstruction(): string {
  return `Anda adalah seorang Ulama, Imam Doa, dan Penyusun Munajat Islam yang fasih berbahasa Arab dan Indonesia, tawadhu, serta berpegang teguh pada amanah keilmuan Islam (Ahlussunnah wal Jama'ah).

TUGAS UTAMA:
Menyusun naskah doa acara dan munajat yang khidmat, menyentuh hati, fasih, dan proporsional sesuai parameter dan KEINGINAN SPESIFIK pengguna.

STRUKTUR WAJIB NASKAH DOA (5 BAGIAN BERURUTAN):
1. "Pembukaan & Hamdalah" (Istighfar, Basmalah, Pujian syukur kepada Allah SWT yang agung)
2. "Selawat Nabi SAW" (Selawat & salam kepada Nabi Muhammad SAW, keluarga, dan sahabat)
3. "Permohonan Utama" (Doa inti ma'tsur/kontekstual yang sangat relevan dengan jenis acara)
4. "Untaian Munajat Khusus" (Rintihan hati, muhasabah, serta harapan khusus/nama tokoh/instansi yang diinput pengguna)
5. "Doa Penutup" (Doa sapu jagat Rabbana atina fid-dunya hasanah..., Subhana rabbika rabbil 'izzati 'amma yashifun..., dan salam penutup)

KEINGINAN PENGGUNA (SANGAT PENTING):
- WAJIB menyebutkan dan merangkai secara eksplisit nama-nama tokoh, pejabat, mempelai, almarhum, instansi, atau poin harapan khusus yang ditulis oleh pengguna pada field "Tujuan / Harapan Khusus / Nama Tokoh & Instansi".
- Masukkan nama-nama dan permohonan tersebut ke dalam teks doa, terutama pada bagian "Untaian Munajat Khusus" dan "Permohonan Utama".
- Judul doa ("judul_doa") harus mencantumkan konteks acara dan nama tokoh/organisasi jika disebutkan oleh pengguna.

STANDAR AMANAH ILMIAH (WAJIB DIPATUHI):
- DILARANG KERAS mengarang ayat Al-Qur'an, hadis, atau sumber kitab palsu.
- Bedakan secara jujur dan tegas pada field "jenis_sumber" antara:
  1) "Doa Ma'tsur (Al-Qur'an / Hadis)" -> WAJIB mencantumkan nama surat & nomor ayat atau perawi hadis yang sahih/masyhur pada "keterangan_dalil".
  2) "Doa Kontekstual Susunan AI" -> Gunakan label ini untuk rangkaian munajat kontekstual yang disusun sesuai konteks acara dan harapan khusus.
- Seluruh teks Arab ("teks_arab") WAJIB menggunakan harakat lengkap (fathah, kasrah, dhammah, sukun, tasydid, tanwin) yang akurat secara nahwu dan sharaf.
- Jika pilihan bahasa adalah "Indonesia Saja", kosongkan string "teks_arab" ("").
- Jika pilihan bahasa adalah "Arab Saja (Full)", tetap isi "teks_arab" secara lengkap dan isi "teks_indonesia" dengan terjemahan/makna ringkas sebagai panduan pembaca.`;
}

function getUserPrompt(params: DoaFormParams): string {
  const namaAcara = resolveEffectiveEventName(params);
  const durasiSpec = getDurasiSpec(params.durasi);
  const harapan =
    params.harapanKhusus.trim() ||
    'Semoga acara berjalan lancar, penuh keberkahan, mempererat ukhuwah, dan diridhai Allah SWT.';

  return `Susunkan Naskah Doa & Munajat Khidmat secara presisi sesuai instruksi:
- Jenis Acara / Majelis: ${namaAcara}
- Pilihan Bahasa Doa: ${params.bahasa}
- Estimasi Durasi Pembacaan: ${params.durasi} (Target naskah: ${durasiSpec.targetKataLabel} — ${durasiSpec.deskripsiSingkat}, sekitar ${durasiSpec.minWords} hingga ${durasiSpec.maxWords} kata)
- Tujuan / Harapan Khusus / Nama Tokoh & Instansi dari Pengguna:
"${harapan}"

PERHATIAN KHUSUS:
Mohon rangkai doa yang secara nyata memuat hajat, nama tokoh, atau institusi yang ditulis pengguna di atas ke dalam untaian munajat. Pastikan menghasilkan tepat 5 bagian berurutan.`;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    judul_doa: {
      type: Type.STRING,
      description: 'Judul lengkap naskah doa sesuai nama acara dan tokoh/lembaga',
    },
    ringkasan_adab: {
      type: Type.STRING,
      description: '1 kalimat panduan singkat adab membaca doa ini dengan khusyuk',
    },
    bagian_doa: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nama_bagian: {
            type: Type.STRING,
            description:
              'Nama bagian doa (Pembukaan & Hamdalah, Selawat Nabi SAW, Permohonan Utama, Untaian Munajat Khusus, atau Doa Penutup)',
          },
          jenis_sumber: {
            type: Type.STRING,
            description:
              "Harus bernilai tepat 'Doa Ma'tsur (Al-Qur'an / Hadis)' atau 'Doa Kontekstual Susunan AI'",
          },
          keterangan_dalil: {
            type: Type.STRING,
            description:
              "Rujukan surat/ayat Al-Qur'an atau perawi hadis sahih/masyhur, atau penjelasan konteks munajat",
          },
          teks_arab: {
            type: Type.STRING,
            description:
              'Teks doa bahasa Arab berharakat lengkap, atau string kosong jika mode Indonesia Saja',
          },
          teks_indonesia: {
            type: Type.STRING,
            description:
              'Untaian munajat bahasa Indonesia atau terjemahan khidmat yang memuat harapan dan nama tokoh pengguna',
          },
        },
        required: [
          'nama_bagian',
          'jenis_sumber',
          'keterangan_dalil',
          'teks_arab',
          'teks_indonesia',
        ],
      },
    },
  },
  required: ['judul_doa', 'ringkasan_adab', 'bagian_doa'],
};

async function streamFallbackDoa(
  res: express.Response,
  params: DoaFormParams
): Promise<void> {
  const fallback = buildContextualDoaFallback(params);
  const sections = fallback.bagian_doa;

  // Stream each section progressively in real-time
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    res.write(
      `data: ${JSON.stringify({
        type: 'progress',
        sectionIndex: i,
        sectionName: sec.nama_bagian,
        jenisSumber: sec.jenis_sumber,
        message: `Sedang menyusun 0${i + 1}. ${sec.nama_bagian}...`,
      })}\n\n`
    );
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Stream text chunks
    const chunkText =
      params.bahasa !== 'Indonesia Saja' && sec.teks_arab
        ? `${sec.teks_arab}\n\n"${sec.teks_indonesia}"`
        : `"${sec.teks_indonesia}"`;

    res.write(
      `data: ${JSON.stringify({
        type: 'chunk',
        text: chunkText + '\n\n',
      })}\n\n`
    );
    await new Promise((resolve) => setTimeout(resolve, 70));
  }

  res.write(
    `data: ${JSON.stringify({
      type: 'done',
      naskah: fallback,
    })}\n\n`
  );
  res.end();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Real-time SSE streaming endpoint
  app.post('/api/doa/stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      const body = req.body as Partial<DoaFormParams>;
      const params: DoaFormParams = {
        jenisAcara: body.jenisAcara || DEFAULT_FORM_PARAMS.jenisAcara,
        acaraLainnya: body.acaraLainnya || '',
        bahasa: body.bahasa || DEFAULT_FORM_PARAMS.bahasa,
        durasi: body.durasi || DEFAULT_FORM_PARAMS.durasi,
        harapanKhusus: body.harapanKhusus || '',
      };

      const validation = validateFormParams(params);
      if (!validation.valid) {
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            error: validation.errorMessage,
          })}\n\n`
        );
        res.end();
        return;
      }

      res.write(
        `data: ${JSON.stringify({
          type: 'start',
          message: 'Memulai penyusunan naskah doa dan munajat khidmat...',
        })}\n\n`
      );

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
        await streamFallbackDoa(res, params);
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = getSystemInstruction();
      const userPrompt = getUserPrompt(params);

      try {
        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
          },
        });

        let accumulated = '';
        for await (const chunk of responseStream) {
          const chunkText = chunk.text;
          if (chunkText) {
            accumulated += chunkText;
            res.write(
              `data: ${JSON.stringify({
                type: 'chunk',
                text: chunkText,
              })}\n\n`
            );
          }
        }

        let parsed: Partial<NaskahDoa>;
        try {
          parsed = JSON.parse(accumulated);
        } catch {
          parsed = buildContextualDoaFallback(params);
        }

        const normalized = normalizeNaskahDoa(parsed, params);
        res.write(
          `data: ${JSON.stringify({
            type: 'done',
            naskah: normalized,
          })}\n\n`
        );
        res.end();
      } catch (streamError) {
        console.warn('Fallback stream due to error:', streamError);
        await streamFallbackDoa(res, params);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: message,
        })}\n\n`
      );
      res.end();
    }
  });

  // Regular single-turn endpoint as fallback
  app.post('/api/doa/generate', async (req, res) => {
    try {
      const body = req.body as Partial<DoaFormParams>;
      const params: DoaFormParams = {
        jenisAcara: body.jenisAcara || DEFAULT_FORM_PARAMS.jenisAcara,
        acaraLainnya: body.acaraLainnya || '',
        bahasa: body.bahasa || DEFAULT_FORM_PARAMS.bahasa,
        durasi: body.durasi || DEFAULT_FORM_PARAMS.durasi,
        harapanKhusus: body.harapanKhusus || '',
      };

      const validation = validateFormParams(params);
      if (!validation.valid) {
        res.status(400).json({ error: validation.errorMessage });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
        const fallback = buildContextualDoaFallback(params);
        res.json({ naskah: fallback });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: getUserPrompt(params),
        config: {
          systemInstruction: getSystemInstruction(),
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      const normalized = normalizeNaskahDoa(parsed, params);
      res.json({ naskah: normalized });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat menyusun doa.';
      const fallback = buildContextualDoaFallback(req.body);
      res.json({ naskah: fallback, note: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Do'a & Munajat PRO server running on http://localhost:${PORT}`);
  });
}

startServer();
