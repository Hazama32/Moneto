"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Navbar";
import Chart from "@/components/Chart";
import TransactionList from "@/components/TransactionList";
import StatCard from "@/components/StatCard";
import BudgetCard from "@/components/BudgetProgress";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category?: string;
  created_at: string;
  description?: string;
}

interface Budget {
  id: string;
  category: string;
  limit_amount: number;
  created_at: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: trxData, error: trxError } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: budgetData, error: budgetError } = await supabase
        .from("budgets")
        .select("*");

      if (trxError) console.error(trxError);
      if (budgetError) console.error(budgetError);

      setTransactions(trxData || []);
      setBudgets(budgetData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-linear-to-r from-gray-600 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        <p className="mt-6 text-white font-semibold text-lg animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalIncome - totalExpense;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Statistik Ringkas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <StatCard
            title="Pemasukan"
            value={`Rp ${totalIncome.toLocaleString("id-ID")}`}
            color="green"
            link="/detail/income"
          />
          <StatCard
            title="Pengeluaran"
            value={`Rp ${totalExpense.toLocaleString("id-ID")}`}
            color="red"
            link="/detail/expense"
          />
          <StatCard
            title="Saldo"
            value={`Rp ${saldo.toLocaleString("id-ID")}`}
            color="blue"
            link="/detail/balance"
          />
        </motion.div>

        {/* Grafik + Budget + Transaksi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Grafik di kiri */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:col-span-2"
          >
            <h2 className="text-base sm:text-lg font-semibold text-blue-700">
              Grafik Keuangan Bulanan
            </h2>
            <div className="h-64 sm:h-80 text-gray-600">
              <Chart transactions={transactions} />
            </div>
          </motion.div>

          {/* Budget + Transaksi di kanan */}
          <div className="space-y-6">
            {/* Budget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-blue-700">
                Budget
              </h2>
              <div className="space-y-4">
                {budgets.map((b) => (
                  <BudgetCard
                    key={b.id}
                    category={b.category}
                    limit={b.limit_amount}
                    spent={transactions
                      .filter(
                        (t) => t.type === "expense" && t.category === b.category
                      )
                      .reduce((sum, t) => sum + t.amount, 0)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Transaksi Terbaru */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-black"
            >
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-blue-700">
                Transaksi Terbaru
              </h2>
              <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                <TransactionList transactions={transactions.slice(0, 5)} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
