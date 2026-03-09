"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Moneto</h1>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
          Selamat Datang 👋
        </h2>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-gray-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-gray-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
          >
            Login
          </motion.button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <a href="/auth/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
}