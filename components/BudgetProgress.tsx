"use client";

export default function BudgetProgress({
  category,
  limit,
  spent,
}: {
  category: string;
  limit: number;
  spent: number;
}) {
  const percent = Math.min((spent / limit) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{category}</span>
        <span className="text-gray-500">{percent.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Rp {spent.toLocaleString("id-ID")} / Rp {limit.toLocaleString("id-ID")}
      </p>
    </div>
  );
}