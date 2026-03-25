/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Navbar";
import TransactionList from "@/components/TransactionList";
import { motion } from "framer-motion";
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category?: string;
  created_at: string;
  description?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    category: "",
    description: ""
  });

  async function fetchData() {
    const { data: trxData, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);

    setTransactions(trxData || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newTransaction = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description
    };

    const { error } = await supabase.from("transactions").insert([newTransaction]);

    if (error) {
      console.error("Error creating transaction:", error);
      alert("Gagal membuat transaksi.");
    } else {
      setFormData({ type: "income", amount: "", category: "", description: "" });
      setShowForm(false);
      fetchData();
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      const { error } = await supabase.from("transactions").delete().eq("id", id);

      if (error) {
        console.error("Error deleting transaction:", error);
        alert("Gagal menghapus transaksi.");
      } else {
        fetchData();
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-linear-to-r from-gray-600 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        <p className="mt-6 text-white font-semibold text-lg animate-pulse">
          Loading Transactions...
        </p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Transaksi</h1>
          <p className="text-gray-600">Kelola semua transaksi keuangan Anda</p>
        </motion.div>

        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
              <div className="flex items-center justify-center mb-1">
                <ArrowUpIcon className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">Total Pemasukan</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString("id-ID")}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
              <div className="flex items-center justify-center mb-1">
                <ArrowDownIcon className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">Total Pengeluaran</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString("id-ID")}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Saldo</h3>
              <p className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                Rp {balance.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {[["all", "Semua", transactions.length], ["income", "Pemasukan", transactions.filter(t => t.type === "income").length], ["expense", "Pengeluaran", transactions.filter(t => t.type === "expense").length]].map(([value, label, count]) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value as "all" | "income" | "expense")}
                    className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                      filter === value
                        ? value === "all"
                          ? "bg-blue-600 text-white"
                          : value === "income"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
              <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto">
                <PlusIcon className="w-5 h-5 mr-2 inline" /> Tambah Transaksi
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 text-black">
            <h2 className="text-xl font-semibold text-blue-700 mb-3">Daftar Transaksi</h2>
            <TransactionList transactions={filteredTransactions} onDelete={handleDelete} />
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">Tambah Transaksi</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    required
                  >
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                  <input
                    type="number"
                    step="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    placeholder="Masukkan kategori"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    placeholder="Masukkan deskripsi"
                    rows={3}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Simpan
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
