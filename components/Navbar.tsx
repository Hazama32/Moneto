/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  MoonIcon,
  Cog6ToothIcon,
  ArrowRightCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  ChartBarIcon,
  WalletIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { appVersion } from "@/lib/version";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 h-screen bg-blue-600 text-white flex flex-col justify-between shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Top Menu */}
        <div>
          <div
            className={`${poppins.className} px-6 py-4 text-2xl tracking-wide font-bold`}
          >
            <span className="font-bold text-white">
              Moneto{" "}
              <span className="text-sm text-blue-200">v{appVersion}</span>
            </span>
          </div>

          {/* KEUANGAN */}
          <div className="px-6 mt-4 text-xs font-semibold text-blue-200">
            KEUANGAN
          </div>
          <nav className="mt-2 space-y-2 px-4">
            <SidebarItem
              icon={<HomeIcon className="w-5 h-5" />}
              label="Dashboard"
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
              label="Transaksi"
              href="/dashboard/transactions"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              icon={<WalletIcon className="w-5 h-5" />}
              label="Tabungan"
              href="/dashboard/tabungan"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              icon={<ChartBarIcon className="w-5 h-5" />}
              label="Laporan"
              href="/dashboard/reports"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>

          {/* SISTEM */}
          <div className="px-6 mt-6 text-xs font-semibold text-blue-200">
            SISTEM
          </div>
          <nav className="mt-2 space-y-2 px-4">
            <SidebarItem
              icon={<Cog6ToothIcon className="w-5 h-5" />}
              label="Pengaturan"
              href="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
            />
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
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={
                  user.user_metadata?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${
                    user.user_metadata?.name || user.email
                  }&background=0D8ABC&color=fff`
                }
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.user_metadata?.name || user.email}
                </p>
                <p className="text-xs text-blue-200">Pengguna Keluarga</p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
          >
            <ArrowRightCircleIcon className="w-6 h-6 text-white hover:text-red-300 transition" />
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-2 text-sm hover:text-blue-200 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
