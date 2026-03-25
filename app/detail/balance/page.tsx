/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Navbar";
import Chart from "@/components/Chart";
import TransactionList from "@/components/TransactionList";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category?: string;
  created_at: string;
  description?: string;
}

export default function BalanceDetailPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: trxData, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: true });

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
          Loading Balance Details...
        </p>
      </div>
    );
  }

  // Calculate balance over time
  const balanceData: { date: string; balance: number }[] = [];
  let runningBalance = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      runningBalance += t.amount;
    } else if (t.type === "expense") {
      runningBalance -= t.amount;
    }

    const date = new Date(t.created_at).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    balanceData.push({
      date,
      balance: runningBalance,
    });
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Detail Saldo
            </h1>
            <p className="text-sm text-gray-600">
              Pantau perkembangan saldo Anda dari waktu ke waktu
            </p>
          </motion.div>

          {/* Current Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow p-4 text-center"
          >
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Saldo Saat Ini
            </h2>
            <p
              className={`text-2xl font-bold ${
                currentBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Rp {currentBalance.toLocaleString("id-ID")}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">Pemasukan</p>
                <p className="text-sm font-semibold text-green-600">
                  Rp {totalIncome.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Pengeluaran</p>
                <p className="text-sm font-semibold text-red-600">
                  Rp {totalExpense.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Balance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow p-4"
          >
            <h2 className="text-sm font-semibold text-blue-700 mb-3">
              Perkembangan Saldo
            </h2>
            <div className="h-80 sm:h-96 min-h-72 text-gray-600">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
                <LineChart
                  data={balanceData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip
                    formatter={(value: number | undefined) => value ? `Rp ${value.toLocaleString("id-ID")}` : ""}
                    labelStyle={{ fontWeight: "bold", fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Saldo"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 1, r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeOpacity={1}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly Summary Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow p-4"
          >
            <h2 className="text-sm font-semibold text-blue-700 mb-3">
              Ringkasan Bulanan
            </h2>
            <div className="h-80 text-gray-600">
              <Chart transactions={transactions} />
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-xl shadow p-4 text-black"
          >
            <h2 className="text-sm font-semibold mb-3 text-blue-700">
              Transaksi Terbaru
            </h2>
            <div className="max-h-40 overflow-y-auto">
              <TransactionList 
  transactions={transactions.slice(-10).reverse()} 
  onDelete={async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Failed to delete:", error.message);
        return;
      }

      // Update local state so UI reflects the change
      setTransactions(prev => prev.filter(trx => trx.id !== id));
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }} 
/>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
