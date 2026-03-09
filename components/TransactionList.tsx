"use client";
import { motion } from "framer-motion";

export default function TransactionList({ transactions }: { transactions: any[] }) {
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {transactions.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex justify-between p-3 rounded-lg shadow bg-white"
          >
            <span className="font-medium">{t.category}</span>
            <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
              {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}