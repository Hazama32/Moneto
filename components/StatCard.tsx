"use client";
import { useRouter } from "next/navigation";

export default function StatCard({
  title,
  value,
  color,
  link,
}: {
  title: string;
  value: string;
  color: "green" | "red" | "blue";
  link: string;
}) {
  const router = useRouter();
  const colorClass =
    color === "green"
      ? "text-green-600"
      : color === "red"
      ? "text-red-600"
      : "text-blue-600";

  return (
    <div
      onClick={() => router.push(link)}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
    >
      <h3 className="text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs text-indigo-500 mt-2">Lihat detail</p>
    </div>
  );
}