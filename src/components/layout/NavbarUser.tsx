"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/mockAuth";
import {
  Home,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  CircleHelp,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarNavProps {
  sidebarOpen: boolean; // คงการรับตัวแปรตามเงื่อนไขเดิมไว้
}

export default function SidebarNav({ sidebarOpen }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  // เพิ่ม State สำหรับการเปิด-ปิดเมนูบนหน้าจอสมาร์ทโฟน/แท็บเล็ต ให้เหมือนเวอร์ชัน Admin
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "หน้าแรก", href: "/user/dashboard" },
    { icon: Calendar, label: "จัดการการจองห้องประชุม", href: "/user/bookings" },
    { icon: MapPin, label: "รายการห้องประชุม", href: "/user/rooms/room-list" },
  ];

  return (
    <>
      {/* 1. ปุ่ม Hamburger สำหรับหน้าจอ Mobile/Tablet (ซ่อนเมื่ออยู่บนจอคอม md:hidden) */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. Backdrop ผ้าม่านดำโปร่งแสงเมื่อเปิดเมนูบน Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 z-30 transition-opacity"
        />
      )}

      {/* 3. Aside Sidebar ตัวหลัก ปรับดีไซน์ตามรูปแบบของเดิมให้เป๊ะ */}
      <aside
        className={`bg-white border-r border-slate-200 fixed h-full flex flex-col z-30 shadow-sm transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "w-64" : "w-20" // ประยุกต์ใช้ตัวแปรเดิมในการควบคุมความกว้างของแถบบนหน้าจอคอม
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          {sidebarOpen ? (
            <div>
              <h1 className="text-xl font-bold text-blue-600 tracking-tight">RoomSync Pro</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                User Console
              </p>
            </div>
          ) : (
            <div className="mx-auto">
              <h1 className="text-xl font-bold text-blue-600 tracking-tight">RS</h1>
            </div>
          )}
          {/* ปุ่มปิดด่วนเมื่อเปิดบนโมบายล์ */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)} // กดแล้วให้ปิดแถบเมนูอัตโนมัติบนจอเล็ก
                className={`flex items-center gap-3 rounded-lg py-2.5 text-sm transition-colors ${
                  sidebarOpen ? "px-3" : "justify-center px-0"
                } ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-500"} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation & Profile */}
        <div className="p-4 border-t border-slate-100 space-y-4 bg-slate-50/50">
          <div className="space-y-0.5">
            <Link
              href="/user/support"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-100/80 transition-colors ${
                sidebarOpen ? "px-3" : "justify-center px-0"
              }`}
            >
              <CircleHelp size={18} className="text-slate-500" />
              {sidebarOpen && <span>Support</span>}
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className={`w-full flex items-center gap-3 rounded-lg py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors ${
                sidebarOpen ? "px-3" : "justify-center px-0"
              }`}
            >
              <LogOut size={18} className="text-slate-500" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>

          {/* User Profile Card ส่วนล่างสุดของ Sidebar */}
          <div className={`flex items-center border border-slate-200/60 rounded-xl bg-white shadow-3xs ${
            sidebarOpen ? "p-2 gap-3" : "p-1 justify-center"
          }`}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Profile"
              className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
            />
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900 truncate">User Test</p>
                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">Corporate Member</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}