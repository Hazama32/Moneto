"use client";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category?: string;
  created_at: string;
  description?: string;
}

export default function TransactionList({ transactions, onDelete }: { transactions: Transaction[], onDelete?: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {transactions.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex justify-between items-center p-3 rounded-lg shadow bg-white"
          >
            <div className="flex-1">
              <div className="font-medium">{t.category || 'No Category'}</div>
              <div className="text-sm text-gray-500">{t.description || ''}</div>
              <div className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString('id-ID')}</div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
              </span>
              {onDelete && (
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}