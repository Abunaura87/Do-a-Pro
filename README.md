# Do'a & Munajat PRO - Asisten Penyusun Naskah Doa Acara & Munajat Khidmat

Aplikasi web cerdas berbasis nuansa Islami modern (*Soft 3D UI*) untuk menyusun naskah doa acara resmi, majelis ilmu, walimah, pelantikan, tasyakuran, dan munajat khidmat dengan standar amanah keilmuan Islam (*Ahlussunnah wal Jama'ah*).

---

## 🚀 Panduan Deploy ke GitHub & Vercel

Aplikasi ini telah dikonfigurasi secara lengkap dengan file `vercel.json` dan *Vercel Serverless Functions* (`/api/doa/stream` dan `/api/doa/generate`), sehingga **siap di-deploy ke Vercel tanpa error**.

### 1. Push ke GitHub
1. Inisialisasi git dan buat commit:
   ```bash
   git init
   git add .
   git commit -m "feat: Do'a & Munajat PRO siap deploy"
   ```
2. Hubungkan ke repositori GitHub Anda dan push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```

---

### 2. Deploy ke Vercel (1-Click Ready)
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New...** > **Project**.
2. Pilih repositori GitHub proyek ini lalu klik **Import**.
3. Pada bagian **Build & Output Settings**:
   - **Framework Preset**: `Vite` (Otomatis terdeteksi)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Pada bagian **Environment Variables**:
   - Tambahkan variabel:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: Masukkan API Key Google Gemini Anda (didapatkan dari [Google AI Studio](https://aistudio.google.com/app/apikey))
5. Klik **Deploy**.

---

### 3. Mengapa Dijamin Bebas Error di Vercel & GitHub?
1. **File `vercel.json` Terintegrasi:**
   - Menyediakan aturan *rewrites* otomatis untuk menangani routing SPA (Single Page Application) sehingga reload halaman tidak akan mengalami `404 Not Found`.
   - Mengarahkan endpoint `/api/doa/*` ke serverless functions Vercel secara mulus.
2. **Dukungan Serverless Function (`/api/doa/stream.ts` & `/api/doa/generate.ts`):**
   - API streaming real-time menggunakan Server-Sent Events (SSE) yang didukung penuh di Vercel Serverless Node runtime.
3. **Resilient Dual-Mode Execution:**
   - Jika aplikasi dijalankan di lingkungan statis murni (misalnya GitHub Pages) tanpa backend atau API key belum disetel, aplikasi secara otomatis beralih ke *client-side fallback synthesizer* berstandar ilmiah tanpa crash atau melempar error jaringan.
4. **Build & Typecheck Bersih:**
   - `npm run build` dan `npm run lint` (`tsc --noEmit`) terverifikasi lulus 100% tanpa error atau warning usang.

---

## 🛠️ Menjalankan Lokal

```bash
# Install dependencies
npm install

# Jalankan dev server lokal
npm run dev

# Jalankan unit tests logika doa
npm test
```
Aplikasi lokal akan berjalan pada `http://localhost:3000`.
