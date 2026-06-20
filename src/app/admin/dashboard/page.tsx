"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  FileDown,
  LayoutGrid,
  LogOut,
  Plus,
  Search,
  Settings,
  Calendar,
  Building,
} from "lucide-react";

// Mock Data based on the screenshot
const roomStatusData = [
  { floor: 12, name: "Andaman Suite", type: "ห้องประชุมใหญ่", capacity: 50, status: "พร้อมใช้งาน" },
  { floor: 12, name: "Similan Room", type: "ห้องประชุมย่อย", capacity: 12, status: "มีการใช้งาน" },
  { floor: 10, name: "Lanna Hub", type: "Creative Space", capacity: 30, status: "รอทำความสะอาด" },
  { floor: 9, name: "Chao Phraya Boardroom", type: "Executive Boardroom", capacity: 20, status: "บำรุงรักษา" },
  { floor: 8, name: "Phuket Lab", type: "Training Room", capacity: 40, status: "พร้อมใช้งาน" },
  { floor: 9, name: "Phuket Lab", type: "Training Room", capacity: 40, status: "พร้อมใช้งาน" },
  { floor: 10, name: "Phuket Lab", type: "Training Room", capacity: 40, status: "พร้อมใช้งาน" },
  { floor: 11, name: "Phuket Lab", type: "Training Room", capacity: 40, status: "พร้อมใช้งาน" },
];

const popularRoomsData = [
  { rank: 1, name: "Andaman Suite", bookings: 124 },
  { rank: 2, name: "Lanna Hub", bookings: 98 },
  { rank: 3, name: "Phuket Lab", bookings: 85 },
  { rank: 4, name: "Chao Phraya", bookings: 72 },
];

const recentActivitiesData = [
  { icon: "check", user: "Andaman Suite", action: "จองสำเร็จ", details: "ดำเนินการจองสำเร็จ - 22 นาทีที่แล้ว" },
  { icon: "cancel", user: "Similan Room", action: "ยกเลิก", details: "ยกเลิกการจอง - 1 ชั่วโมงที่แล้ว" },
  { icon: "new", user: "Lanna Hub", action: "สร้างการจองใหม่", details: "สร้างการจองใหม่ - 1 ชั่วโมงที่แล้ว" }
];

const monthlyUsageData = [50, 65, 70, 75, 80, 85, 90, 85, 80, 75, 70, 65];

// Helper to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "พร้อมใช้งาน": return "bg-green-100 text-green-800";
    case "มีการใช้งาน": return "bg-yellow-100 text-yellow-800";
    case "รอทำความสะอาด": return "bg-blue-100 text-blue-800";
    case "บำรุงรักษา": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const StatCard = ({ title, value, change, progressBar, children }: any) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {children}
    </div>
    {change && <p className="text-sm text-green-500 mt-2">{change}</p>}
    {progressBar && (
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: progressBar }}></div>
      </div>
    )}
  </div>
);

const AdminDashboardPage = () => {
  const pathname = usePathname();

  // กำหนดรายการเมนูหลัก
  const menuItems = [
    { 
      name: "Dashboard", 
      href: "/admin/dashboard", 
      icon: LayoutGrid 
    },
    { 
      name: "Booking Management", 
      href: "/admin/booking", 
      icon: Calendar 
    },
    { 
      name: "Room Management", 
      href: "/admin/rooms", 
      icon: Building 
    },
    { 
      name: "Settings", 
      href: "/admin/settings", 
      icon: Settings 
    },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed h-full flex flex-col z-20">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-blue-600">MeetingSpace</h1>
          <p className="text-xs font-medium text-gray-400">ENTERPRISE ADMIN</p>
        </div>

        {/* เมนูหลักด้านบน */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? "text-blue-600" : "text-gray-500"} 
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* เมนูล่าง (Support & Logout) */}
        <div className="p-3 border-t space-y-1">
          <Link
            href="/admin/support"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <CircleHelp size={20} className="text-gray-500" />
            <span>Support</span>
          </Link>
          <button
            onClick={() => console.log("Logout triggered")}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} className="text-gray-500 hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Topbar */}
        <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg w-96">
            <Search size={20} className="text-gray-500" />
            <input type="text" placeholder="ค้นหาห้องหรือการจอง..." className="bg-transparent outline-none w-full text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-600" />
            <CircleHelp size={20} className="text-gray-600" />
            <div className="flex items-center gap-2 border-l pl-4">
              <img src="https://i.pravatar.cc/40?img=12" alt="Admin" className="w-8 h-8 rounded-full border" />
              <div>
                <p className="font-semibold text-sm">แอดมิน ทดสอบ</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">แดชบอร์ดผู้ดูแลระบบ</h2>
              <p className="text-sm text-gray-500">สรุปข้อมูลภาพรวมทั้งหมดของระบบจองห้องประชุม RoomSync Pro</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow-sm text-sm font-medium hover:bg-slate-50 transition-colors">
                <FileDown size={16} /> Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={16} /> เพิ่มการจองใหม่
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="อัตราการใช้งานรวม" value="82.4%" change="+3.2%" progressBar="82.4%" />
            <StatCard title="การจองวันนี้" value="151" change="+12 bookings" />
            <StatCard title="สถานะการบำรุงรักษา" value="3">
              <div className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-medium">3 rooms</div>
            </StatCard>
            <StatCard title="รายได้เดือนนี้ (THB)" value="฿12.4k" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Room Status Table */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">สถานะห้องทั้งหมดวันนี้ (Floor Status)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 bg-slate-50">
                      <tr>
                        <th className="p-3 rounded-l-lg">ชั้น</th>
                        <th className="p-3">ชื่อห้อง</th>
                        <th className="p-3">ประเภท</th>
                        <th className="p-3">ความจุ</th>
                        <th className="p-3">สถานะ</th>
                        <th className="p-3 rounded-r-lg text-center">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {roomStatusData.map((room, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 text-gray-600">{room.floor}</td>
                          <td className="p-3 font-semibold text-slate-700">{room.name}</td>
                          <td className="p-3 text-gray-500">{room.type}</td>
                          <td className="p-3 text-gray-600">{room.capacity} คน</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                              {room.status}
                            </span>
                          </td>
                          <td className="p-3 text-center text-gray-400 cursor-pointer hover:text-gray-600">...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Urgent Alert */}
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500 border border-slate-100">
                <h3 className="font-bold text-red-600 flex items-center gap-2">การแจ้งเตือนด่วน</h3>
                <ul className="mt-3 text-sm space-y-3 text-slate-600">
                  <li className="border-b border-slate-100 pb-2">ระบบปรับอากาศห้อง Chao Phraya Boardroom ไม่ทำงาน</li>
                  <li>Andaman Suite (15:00 - 16:00) มีการจองซ้อน</li>
                </ul>
              </div>

              {/* Occupancy Rate */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 text-center">
                <h3 className="font-bold text-slate-800 mb-4">อัตราการใช้งานเทียบความจุ</h3>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64" />
                    <circle className="text-blue-600 transition-all duration-500" strokeWidth="10" strokeLinecap="round" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64" strokeDasharray={314.16} strokeDashoffset={314.16 - (314.16 * 78) / 100} />
                  </svg>
                  <span className="absolute text-2xl font-bold text-slate-800">78%</span>
                </div>
                <p className="text-xs font-semibold text-gray-400 mt-3 tracking-wider">OCCUPIED</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">กิจกรรมล่าสุดในระบบ</h3>
              <ul className="space-y-4 text-sm">
                {recentActivitiesData.map((act, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border flex items-center justify-center text-xs font-bold text-slate-400">
                      {act.icon === "check" ? "✓" : act.icon === "cancel" ? "✕" : "+"}
                    </div>
                    <div>
                      <p className="text-slate-700"><span className="font-semibold text-slate-900">{act.user}</span>: {act.action}</p>
                      <p className="text-xs text-gray-400">{act.details}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Rooms */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">ห้องยอดนิยมสูงสุด (Top Popular Rooms)</h3>
              <ul className="space-y-3.5 text-sm">
                {popularRoomsData.map((room) => (
                  <li key={room.rank} className="flex justify-between items-center">
                    <span className="text-slate-700">
                      <span className="inline-flex items-center justify-center text-xs font-semibold w-5 h-5 bg-slate-100 text-slate-600 rounded-full mr-2.5">
                        {room.rank}
                      </span>
                      {room.name}
                    </span>
                    <span className="font-semibold text-slate-900">{room.bookings} ครั้ง</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monthly Usage */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">แนวโน้มการใช้งานรายเดือน</h3>
              <div className="flex items-end justify-between h-32 pt-2 px-2">
                {monthlyUsageData.map((val, i) => (
                  <div 
                    key={i} 
                    className="w-3.5 bg-blue-500/20 hover:bg-blue-600 rounded-t transition-all group relative cursor-pointer" 
                    style={{ height: `${val}%` }}
                  >
                    {/* Tooltip แสดงตัวเลขตอน hover */}
                    <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {val}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-30">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AdminDashboardPage;