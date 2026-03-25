/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

export default function Chart({ transactions }: { transactions: any[] }) {
  const dataMap: Record<string, { pemasukan: number; pengeluaran: number }> = {};

  transactions.forEach((t) => {
    const bulan = new Date(t.created_at).toLocaleString("id-ID", {
      month: "short",
      year: "numeric",
    });
    if (!dataMap[bulan]) {
      dataMap[bulan] = { pemasukan: 0, pengeluaran: 0 };
    }
    if (t.type === "income") dataMap[bulan].pemasukan += t.amount;
    if (t.type === "expense") dataMap[bulan].pengeluaran += t.amount;
  });

  const chartData = Object.entries(dataMap).map(([bulan, values]) => ({
    bulan,
    ...values,
  }));

  return (
    <div className="w-full h-full min-h-65 sm:min-h-80">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
        <BarChart
          data={chartData}
          margin={{ top: 50, right: 20, left: 0, bottom: 25 }}
          barGap={8}
          barCategoryGap="20%"
          maxBarSize={60}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | undefined) => value ? `Rp ${value.toLocaleString("id-ID")}` : ""}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="pemasukan" name="Pemasukan" fill="#3B82F6">
            <LabelList
              dataKey="pemasukan"
              position="top"
              offset={12}
              style={{ fontSize: 10 }}
              formatter={(v) => v != null ? `Rp ${v.toLocaleString("id-ID")}` : ""}
            />
          </Bar>
          <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#F97316">
            <LabelList
              dataKey="pengeluaran"
              position="top"
              offset={12}
              style={{ fontSize: 10 }}
              formatter={(v) => v != null ? `Rp ${v.toLocaleString("id-ID")}` : ""}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}