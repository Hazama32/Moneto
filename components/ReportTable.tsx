/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function ReportTable({ reports }: { reports: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Periode</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Pemasukan</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Pengeluaran</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-2 text-sm text-gray-600 capitalize">{r.period}</td>
              <td className="px-4 py-2 text-sm text-green-600">
                Rp {r.total_income.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-2 text-sm text-red-600">
                Rp {r.total_expense.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-2 text-sm text-blue-600">
                Rp {(r.total_income - r.total_expense).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}