"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Navbar";
import Chart from "@/components/Chart";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"];

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category?: string;
  created_at: string;
  description?: string;
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: trxData, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);

      setTransactions(trxData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-linear-to-r from-gray-600 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        <p className="mt-6 text-white font-semibold text-lg animate-pulse">
          Loading Reports...
        </p>
      </div>
    );
  }

  // Calculate monthly data for the last 6 months
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  transactions
    .filter(t => new Date(t.created_at) >= sixMonthsAgo)
    .forEach((t) => {
      const month = new Date(t.created_at).toLocaleString("id-ID", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else if (t.type === "expense") {
        monthlyData[month].expense += t.amount;
      }
    });

  const chartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }));

  // Calculate category breakdown
  const categoryData: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const category = t.category || "Lainnya";
    if (!categoryData[category]) {
      categoryData[category] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      categoryData[category].income += t.amount;
    } else if (t.type === "expense") {
      categoryData[category].expense += t.amount;
    }
  });

  const topCategories = Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      total: data.income + data.expense,
      income: data.income,
      expense: data.expense,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Calculate financial metrics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Laporan Keuangan
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Analisis mendalam performa keuangan Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Pemasukan</h3>
                <p className="text-xl font-bold text-green-600">Rp {totalIncome.toLocaleString("id-ID")}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Pengeluaran</h3>
                <p className="text-xl font-bold text-red-600">Rp {totalExpense.toLocaleString("id-ID")}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Laba Bersih</h3>
                <p className={`text-xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                  Rp {netIncome.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Tingkat Tabungan</h3>
                <p className="text-xl font-bold text-blue-600">{savingsRate.toFixed(1)}%</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-5"
            >
              <h2 className="text-lg font-semibold text-blue-700 mb-3">Ringkasan Bulanan</h2>
              <div className="h-80 text-gray-600">
                <Chart transactions={transactions} />
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-5"
              >
                <h2 className="text-lg font-semibold text-blue-700 mb-3">Tren 6 Bulan Terakhir</h2>
                <div className="h-64 sm:h-72 min-h-64 text-gray-600">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value: number | undefined) => value ? `Rp ${value.toLocaleString("id-ID")}` : ""}
                        labelStyle={{ fontWeight: "bold" }}
                      />
                      <Bar dataKey="income" name="Pemasukan" fill="#10B981" />
                      <Bar dataKey="expense" name="Pengeluaran" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-5"
              >
                <h2 className="text-lg font-semibold text-blue-700 mb-3">Kategori Teratas</h2>
                <div className="space-y-3">
                  {topCategories.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.category}</p>
                          <p className="text-xs text-gray-500">Pemasukan Rp {item.income.toLocaleString("id-ID")}, Pengeluaran Rp {item.expense.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">Rp {item.total.toLocaleString("id-ID")}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
