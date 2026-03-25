"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [weekly, setWeekly] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load settings dari Supabase
  useEffect(() => {
    async function fetchSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Ambil data dari tabel users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();

      if (userError) console.error(userError);
      else if (userData) setName(userData.name || "");

      // Ambil data dari tabel settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (settingsError) console.error(settingsError);
      else if (settingsData) {
        setCurrency(settingsData.currency || "IDR");
        setWeekly(settingsData.weekly ?? true);
        setNotifications(settingsData.notifications ?? true);
        setTheme(settingsData.theme === "dark" ? "dark" : "light");
      }

      setLoading(false);
    }
    fetchSettings();
  }, []);

  // Toggle dark/light mode
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Simpan settings ke Supabase
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      alert("User belum login");
      return;
    }

    // Update nama di tabel users
    const { error: userError } = await supabase
      .from("users")
      .update({ name })
      .eq("id", userId);

    if (userError) {
      console.error("User update error:", userError);
      alert(`Gagal update nama: ${userError.message}`);
      return;
    }

    // Update preferensi di tabel settings
    const { error: settingsError } = await supabase
      .from("settings")
      .upsert({
        user_id: userId,
        currency,
        weekly,
        notifications,
        theme,
        updated_at: new Date(),
      }, { onConflict: "user_id" });

    if (settingsError) {
      console.error("Settings update error:", settingsError);
      alert(`Gagal menyimpan pengaturan: ${settingsError.message}`);
    } else {
      alert("Pengaturan berhasil disimpan!");
    }
  }
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-linear-to-r from-gray-600 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        <p className="mt-6 text-white font-semibold text-lg animate-pulse">
          Loading Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pengaturan Dashboard</h1>
            <p className="text-sm text-gray-500">Sesuaikan preferensi aplikasi keuangan Anda.</p>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 space-y-6">
              {/* Akun */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Akun</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mata Uang</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
                    >
                      <option value="IDR">IDR - Rupiah</option>
                      <option value="USD">USD - Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="JPY">JPY - Yen</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifikasi */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifikasi</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notifikasi Pembukuan</span>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Laporan Mingguan</span>
                    <input
                      type="checkbox"
                      checked={weekly}
                      onChange={(e) => setWeekly(e.target.checked)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </label>
                </div>
              </div>

              {/* Keamanan */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Keamanan</h2>
                <div className="space-y-4">
                  <button
                    type="button"
                    className="w-full text-left border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 text-gray-600"
                  >
                    Ubah Password (Coming Soon)
                  </button>
                  <button
                    type="button"
                    className="w-full text-left border border-red-300 text-red-600 rounded-lg px-3 py-2 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </section>

            {/* Sidebar kanan */}
            <aside className="space-y-6">
              {/* Tema */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Tema</h2>
                <div className="flex gap-3">
                  {(["light", "dark"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      className={`w-full py-2 rounded-lg font-medium border ${
                        theme === value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {value === "light" ? "Terang" : "Gelap"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Mode tema aktif:</p>
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                  {theme === "light" ? "Terang" : "Gelap"}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </aside>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
