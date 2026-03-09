"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { MoonIcon, Cog6ToothIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  ChartBarIcon,
  WalletIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { appVersion } from "@/lib/version";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });


export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <aside className="w-64 h-screen bg-blue-600 text-white flex flex-col justify-between shadow-lg">
      {/* Top Menu */}
      <div>
        <div className={`${poppins.className} px-6 py-4 text-2xl tracking-wide font-bold`}>
            <span className="font-bold text-align-center text-white">Moneto <span className="text-sm text-blue-200">v{appVersion}</span></span>
        </div>
        {/* KEUANGAN */}
        <div className="px-6 mt-4 text-xs font-semibold text-blue-200">KEUANGAN</div>
        <nav className="mt-2 space-y-2 px-4">
          <SidebarItem icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={<ClipboardDocumentListIcon className="w-5 h-5" />} label="Transaksi" href="/transactions" />
          <SidebarItem icon={<WalletIcon className="w-5 h-5" />} label="Budget" href="/budgets" />
          <SidebarItem icon={<ChartBarIcon className="w-5 h-5" />} label="Laporan" href="/reports" />
        </nav>

        {/* SISTEM */}
        <div className="px-6 mt-6 text-xs font-semibold text-blue-200">SISTEM</div>
        <nav className="mt-2 space-y-2 px-4">
          <SidebarItem icon={<Cog6ToothIcon className="w-5 h-5" />} label="Pengaturan" href="/settings" />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center space-x-2 text-sm hover:text-blue-200 transition"
          >
            <MoonIcon className="w-5 h-5" />
            <span>{darkMode ? "Mode Terang" : "Mode Gelap"}</span>
          </button>
        </nav>
      </div>
      
      {/* Profile & Logout */}
      <div className="px-6 py-4 border-t border-blue-500 flex items-center justify-between">
        {user && (
          <div className="flex items-center space-x-2">
            <img
              src={
                user.user_metadata?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user.user_metadata?.name || user.email}&background=0D8ABC&color=fff`
              }
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-sm font-medium">{user.user_metadata?.name || user.email}</p>
              <p className="text-xs text-blue-200">Pengguna Keluarga</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}>
          <ArrowRightCircleIcon className="w-6 h-6 text-white hover:text-red-300 transition" />
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 text-sm hover:text-blue-200 transition"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}