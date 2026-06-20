"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/mockAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const user = await login(email, password);

    if (user) {
      if (user.type === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-800 text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold mb-4">
            ระบบการจองห้องประชุม
        </h1>
        <p className="text-xl">
          จัดการการจองห้องประชุมได้อย่างง่ายดาย ชัดเจน และมีประสิทธิภาพ
        </p>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100 p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
