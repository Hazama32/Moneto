"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Navbar";
import TransactionList from "@/components/TransactionList";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category?: string;
  created_at: string;
  description?: string;
}

export default function ExpenseDetailPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: trxData, error } = await supabase
        .from("transactions")
        .select("*")
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
          Loading Expense Details...
        </p>
      </div>
    );
  }

  const expenses = transactions.filter((t) => t.type === "expense");

  // Calculate expense by category
  const categoryData: Record<string, number> = {};
  expenses.forEach((expense) => {
    const category = expense.category || "Lainnya";
    categoryData[category] = (categoryData[category] || 0) + expense.amount;
  });

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Calculate expense by month
  const monthlyData: Record<string, number> = {};
  expenses.forEach((expense) => {
    const month = new Date(expense.created_at).toLocaleString("id-ID", {
      month: "short",
      year: "numeric",
    });
    monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
  });

  const barData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

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
              Detail Pengeluaran
            </h1>
            <p className="text-sm text-gray-600">
              Analisis pengeluaran Anda secara mendalam
            </p>
          </motion.div>

          {/* Expense Summary Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Total
              </h3>
              <p className="text-lg font-bold text-red-600">
                Rp {totalExpense.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Rata-rata
              </h3>
              <p className="text-lg font-bold text-orange-600">
                Rp {averageExpense.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Terbesar
              </h3>
              <p className="text-lg font-bold text-red-700">
                Rp {largestExpense.toLocaleString("id-ID")}
              </p>
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expense by Category */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow p-4"
            >
              <h2 className="text-sm font-semibold text-blue-700 mb-3">
                Per Kategori
              </h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
                      }
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) => value ? `Rp ${value.toLocaleString("id-ID")}` : ""}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Monthly Expense Trend */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow p-4"
            >
              <h2 className="text-sm font-semibold text-blue-700 mb-3">
                Tren Bulanan
              </h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: number | undefined) => value ? `Rp ${value.toLocaleString("id-ID")}` : ""}
                      labelStyle={{ fontWeight: "bold", fontSize: 12 }}
                    />
                    <Bar dataKey="amount" fill="#FF6B6B" name="Pengeluaran" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-xl shadow p-4 text-black"
          >
            <h2 className="text-sm font-semibold mb-3 text-blue-700">
              Terbaru
            </h2>
            <div className="max-h-48 overflow-y-auto">
             <TransactionList 
  transactions={expenses.slice(0, 10)} 
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
