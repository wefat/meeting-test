"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, users } from "@/lib/mockAuth";
import { KeyRound, Mail, UserCheck, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const user = login(email, password);

    if (user) {
      if (user.type === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } else {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleQuickLogin = (user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    if (user.type === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/user/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased">
      {/* ฝั่งซ้าย: Welcome Banner โทนสีน้ำเงินหรูหราพร้อมกลาสมอร์ฟิซึม */}
      <div className="w-1/2 bg-gradient-to-br from-[#0b57d0] to-[#0842a0] text-white hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight uppercase">RoomSync Pro</h1>
          <p className="text-blue-200 text-xs font-bold tracking-wider uppercase mt-1">Enterprise Console</p>
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            จัดการการจองห้องประชุมอย่างเป็นระบบ
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed font-medium">
            จองเวลาห้องประชุมอย่างชาญฉลาด ค้นหาห้องว่างตามคุณสมบัติ และเช็คการจองของคุณแบบเรียลไทม์ได้ในคลิกเดียว
          </p>
        </div>

        <div className="relative z-10 text-xs font-semibold text-blue-200">
          © {new Date().getFullYear()} RoomSync Pro. All rights reserved.
        </div>
      </div>

      {/* ฝั่งขวา: กล่องกรอกข้อมูลเข้าระบบแบบ Standard และบัญชีจองด่วน */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">เข้าสู่ระบบ</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
              ล็อกอินเข้าสู่บัญชีจองห้องประชุมของคุณ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                อีเมลผู้ใช้งาน (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 text-slate-700"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 text-slate-700"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-xs font-semibold">
                <ShieldAlert size={15} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-98 shadow-sm shadow-blue-100 text-xs uppercase tracking-wider"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {/* บัญชีเข้าระบบด่วน (ไม่ต้องพิมพ์รหัส) */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 justify-center">
              <UserCheck size={14} className="text-slate-400" />
              <span>Quick Login / เข้าระบบด่วน (ไม่ต้องพิมพ์)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className={`p-3 rounded-xl border text-left transition-all hover:shadow-xs active:scale-95 flex flex-col justify-between ${
                    u.type === "admin"
                      ? "bg-red-50/40 hover:bg-red-50/70 border-red-100/60 text-red-700"
                      : "bg-blue-50/40 hover:bg-blue-50/70 border-blue-100/60 text-blue-700"
                  }`}
                >
                  <span className="font-bold text-xs truncate w-full">{u.name}</span>
                  <div className="flex items-center justify-between w-full mt-2.5 text-[10px] font-semibold opacity-70">
                    <span className="truncate max-w-[120px]">{u.email}</span>
                    <span className="uppercase text-[8px] bg-white border px-1 rounded-sm">
                      {u.type === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

