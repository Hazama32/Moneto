Moneto 💰 (*BETA*)

Moneto adalah **Personal Finance Manager** berbasis web yang membantu kamu mengelola keuangan pribadi dengan cara yang sederhana, jelas, dan terorganisir. Dibangun menggunakan **Next.js**, **Tailwind CSS v4**, dan **Supabase** sebagai backend, Moneto dirancang untuk memberikan pengalaman yang cepat, responsif, dan aman.

---

✨ Fitur Utama
- **Dashboard Keuangan**: Ringkasan saldo, pemasukan, dan pengeluaran dalam satu tampilan.
- **Manajemen Transaksi**: Tambah, edit, dan hapus transaksi dengan kategori yang fleksibel.
- **Budgeting**: Atur anggaran bulanan dan pantau progres secara otomatis.
- **Dark Mode**: Dukungan tema gelap yang nyaman untuk mata. (Coming Soon )
- **Multi-user Support**: Data pengguna aman dengan **Row Level Security (RLS)** di Supabase.
- **Responsive Design**: Optimal untuk desktop maupun mobile.

---

🛠️ Teknologi yang Digunakan
- [Next.js](https://nextjs.org/) – Framework React untuk frontend.
- [Tailwind CSS v4](https://tailwindcss.com/) – Utility-first CSS untuk styling.
- [Supabase](https://supabase.com/) – Database PostgreSQL + autentikasi + API real-time.

---

🚀 Instalasi & Setup
1. Clone repository:
   git clone (https://github.com/Hazama32/Moneto.git)
   cd moneto
2. Install dependencies:
   npm install
3. Buat file .env.local dan isi dengan konfigurasi Supabase:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Jalankan development server:
   npm run dev
5. Buka http://localhost:3000 di browser.

---

📂 Struktur Proyek

moneto/

├── components/       # Komponen UI reusable

├── pages/            # Routing Next.js

├── lib/              # Helper & konfigurasi Supabase

├── styles/           # Styling global

├── public/           # Asset statis

---

🔒 Keamanan
1. Autentikasi Supabase untuk login/registrasi.
2. Row Level Security (RLS) memastikan setiap user hanya bisa mengakses datanya sendiri.
3. Validasi input untuk mencegah error dan menjaga integritas data.

📈 Roadmap
1. Integrasi grafik interaktif untuk analisis keuangan.
2. Fitur ekspor laporan keuangan (PDF/Excel) (Coming Soon)
3. Notifikasi pengingat budget. (On Progress)
