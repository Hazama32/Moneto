"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Navbar";
import { motion } from "framer-motion";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";


interface Budget {
  id: string;
  category: string;
  limit_amount: number;
  created_at: string;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({ category: "", limit_amount: ""});

  useEffect(() => {
    fetchBudgets();
  }, []);

  async function fetchBudgets() {
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select("id, category, limit_amount, created_at") // ambil kolom sesuai tabel
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching budgets:", JSON.stringify(error, null, 2));
      } else {
        setBudgets(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching budgets:", err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const budgetData = {
      category: formData.category,
      limit_amount: parseFloat(formData.limit_amount),
    };

    try {
      if (editingBudget) {
        const { error } = await supabase
          .from("budgets")
          .update(budgetData)
          .eq("id", editingBudget.id);

        if (error) {
          console.error("Error updating budget:", error);
          alert("Gagal mengupdate budget.");
          return;
        }
      } else {
        const { error } = await supabase
          .from("budgets")
          .insert([budgetData]);

        if (error) {
          console.error("Error creating budget:", error);
          alert("Gagal membuat budget.");
          return;
        }
      }

      setFormData({ category: "", limit_amount: ""});
      setShowForm(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan yang tidak terduga.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Apakah Anda yakin ingin menghapus budget ini?")) {
      try {
        const { error } = await supabase
          .from("budgets")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting budget:", error);
          alert("Gagal menghapus budget.");
        } else {
          fetchBudgets();
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Terjadi kesalahan yang tidak terduga.");
      }
    }
  }

  function handleEdit(budget: Budget) {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limit_amount: budget.limit_amount.toString(),
    });
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-linear-to-r from-gray-600 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        <p className="mt-6 text-white font-semibold text-lg animate-pulse">
          Loading Budgets...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Budget Management</h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingBudget(null);
                setFormData({ category: "", limit_amount: ""});
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Budget
            </button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl text-black font-semibold mb-4">
                {editingBudget ? "Edit Budget" : "Tambah Budget Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batas Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.limit_amount}
                    onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    required
                    min="0"
                  />
                </div>
              
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingBudget ? "Ubah" : "Tambah"} Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBudget(null);
                      setFormData({ category: "", limit_amount: ""});
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Budget Anda</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {budgets.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Tidak ada budget yang ditemukan. Buat budget pertama Anda untuk memulai.
                </div>
              ) : (
                budgets.map((budget) => (
                  <div key={budget.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-500">
                        Limit: Rp {budget.limit_amount.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-400">
                        Dibuat: {new Date(budget.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}