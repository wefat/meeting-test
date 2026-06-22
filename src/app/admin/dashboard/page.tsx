"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  FileDown,
  LogOut,
  Plus,
  Search,
  Settings,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Activity,
  Award
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AdminSidebar from "@/components/layout/AdminSidebar";

const getStatusColor = (status: string) => {
  switch (status) {
    case "พร้อมใช้งาน":
      return "bg-green-100 text-green-800";
    case "มีการใช้งาน":
      return "bg-yellow-100 text-yellow-800";
    case "รอทำความสะอาด":
      return "bg-blue-100 text-blue-800";
    case "บำรุงรักษา":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


export default function AdminDashboard() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadNotifs = () => {
      try {
        const stored = localStorage.getItem("adminNotifications");
        if (stored) {
          setAdminNotifications(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error loading admin notifications:", err);
      }
    };
    loadNotifs();
    window.addEventListener("storage", loadNotifs);
    return () => window.removeEventListener("storage", loadNotifs);
  }, []);

  const handleClearAdminNotifications = () => {
    localStorage.setItem("adminNotifications", "[]");
    setAdminNotifications([]);
  };

  const [stats, setStats] = useState({
    utilizationRate: 0,
    todayBookingsCount: 0,
    maintenanceRooms: 0,
    popularRoomsData: [] as any[],
    monthlyUsageData: [] as any[],
    roomStatusData: [] as any[],
    recentActivities: [] as any[],
    capacityUtilizationRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/admin/dashboard`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const occupancyChartData = [
    { name: "มีการใช้งาน", value: stats.capacityUtilizationRate || 0 },
    { name: "ว่าง", value: Math.max(0, 100 - (stats.capacityUtilizationRate || 0)) },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <AdminSidebar />

      <div className="flex-1 ml-0 md:ml-64 min-w-0 transition-all duration-300">
        <header className="bg-white border-b border-slate-200 px-4 py-4 md:px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm gap-4">
          <div className="flex items-center gap-2 bg-gray-100 pl-12 pr-4 md:px-4 py-2.5 rounded-lg flex-1 max-w-md">
            <Search size={18} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="ค้นหาห้องหรือการจอง..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <Bell size={20} />
                {adminNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-30">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <span className="font-bold text-xs text-slate-700">
                      การแจ้งเตือนจองห้อง
                    </span>
                    {adminNotifications.length > 0 && (
                      <button
                        onClick={handleClearAdminNotifications}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        ล้างทั้งหมด
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {adminNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-400 text-xs font-medium">
                        ไม่มีการแจ้งเตือนใหม่
                      </div>
                    ) : (
                      adminNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {n.message}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            น.
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition hidden sm:block">
              <CircleHelp size={20} />
            </button>
            <div className="border-l border-slate-200 pl-2 md:pl-4 flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden lg:block">
                <p className="font-semibold text-sm text-slate-900">
                  แอดมิน ทดสอบ
                </p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <ChevronDown size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                แดชบอร์ดผู้ดูแลระบบ
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                การวิเคราะห์ข้อมูลอย่างรวมและจัดการระบบจองห้องประชุม RoomSync Pro
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <a href="/admin/rooms" className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <FileDown size={16} />
                เพิ่มห้องประชุม
              </a>
              <a href="/admin/booking/create" className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Plus size={16} />
                จองห้องประชุม
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* อัตราการใช้งานรวม */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-blue-200 transition-all">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-slate-500 font-bold">อัตราการใช้งานรวม</p>
                  <div className="flex items-end gap-2 mt-1.5">
                    <p className="text-4xl font-black text-slate-800 tracking-tight">{stats.utilizationRate}%</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
                  <TrendingUp size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-slate-500 font-medium">สัดส่วนเวลาที่มีการจองเทียบกับเวลาว่าง</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.utilizationRate}%` }}></div>
                </div>
              </div>
            </div>

            {/* การจองวันนี้ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-slate-500 font-bold">รายการจองวันนี้</p>
                  <div className="flex items-end gap-2 mt-1.5">
                    <p className="text-4xl font-black text-slate-800 tracking-tight">{stats.todayBookingsCount}</p>
                    <span className="text-xs font-bold text-slate-400 mb-1.5">รายการ</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm">
                  <Calendar size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  กำลังจะเกิดขึ้นในวันนี้ทั้งหมด
                </p>
              </div>
            </div>

            {/* ห้องพร้อมใช้งาน */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-green-200 transition-all">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-slate-500 font-bold">ห้องพร้อมใช้งาน</p>
                  <div className="flex items-end gap-2 mt-1.5">
                    <p className="text-4xl font-black text-green-600 tracking-tight">
                      {stats.roomStatusData ? stats.roomStatusData.filter((r: any) => r.status === "พร้อมใช้งาน").length : 0}
                    </p>
                    <span className="text-xs font-bold text-slate-400 mb-1.5">ห้อง</span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-xl shadow-sm">
                  <Activity size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md">AVAILABLE</span>
                <span className="text-[11px] text-slate-500 font-medium">พร้อมสำหรับการจองทันที</span>
              </div>
            </div>

            {/* ห้องปิดบำรุงรักษา */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-red-200 transition-all">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              <div className="relative z-10 flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-slate-500 font-bold">ห้องปิดบำรุงรักษา</p>
                  <div className="flex items-end gap-2 mt-1.5">
                    <p className="text-4xl font-black text-red-500 tracking-tight">
                      {stats.roomStatusData ? stats.roomStatusData.filter((r: any) => r.status === "บำรุงรักษา" || r.status === "ปิดใช้งาน").length : 0}
                    </p>
                    <span className="text-xs font-bold text-slate-400 mb-1.5">ห้อง</span>
                  </div>
                </div>
                <div className="p-3 bg-red-50 text-red-500 rounded-xl shadow-sm">
                  <AlertTriangle size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-md">MAINTENANCE</span>
                <span className="text-[11px] text-slate-500 font-medium">งดให้บริการชั่วคราว</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                    <Bell size={16} />
                  </div>
                  กิจกรรมล่าสุด
                </h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Live</span>
              </div>
              
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                {stats.recentActivities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Activity size={32} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">ยังไม่มีความเคลื่อนไหว</p>
                  </div>
                ) : (
                  stats.recentActivities.slice(0, 10).map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                      <div className={`w-10 h-10 rounded-full ${item.color || "bg-blue-100 text-blue-600"} flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0`}>
                        {item.icon || <Bell size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 leading-snug">
                          <span className="font-bold text-slate-900">{item.label}</span> {item.action}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1.5">
                          <Calendar size={11} />
                          {new Date(item.time).toLocaleDateString("th-TH")} • {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} น.
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
                    <Award size={16} />
                  </div>
                  ห้องยอดนิยม
                </h3>
              </div>
              <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                {stats.popularRoomsData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Award size={32} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">ยังไม่มีข้อมูลสถิติ</p>
                  </div>
                ) : (
                  stats.popularRoomsData.slice(0, 10).map((room, index) => (
                    <div key={room.rank} className="group flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all cursor-default">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-white shadow-sm transform group-hover:scale-110 transition-transform
                        ${index === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-200" : 
                          index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-200" : 
                          index === 2 ? "bg-gradient-to-br from-orange-500 to-orange-700 shadow-orange-200" : "bg-slate-100 text-slate-500"}`}>
                        #{room.rank}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{room.name}</p>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (room.bookings / stats.popularRoomsData[0].bookings) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-indigo-600">{room.bookings}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">ครั้ง</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <h3 className="font-bold text-slate-900 mb-2">
                แนวโน้มการใช้งานรายเดือน
              </h3>
              <p className="text-xs text-slate-500 mb-6">จำนวนการจองห้องประชุมแบ่งตามเดือนในปีนี้</p>
              <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.monthlyUsageData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => v.toString()}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                      itemStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                      cursor={{fill: '#f8fafc'}}
                      formatter={(value) => [`${value} รายการ`, "จำนวนการจอง"]}
                    />
                    <Bar 
                      dataKey="usage" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-6">
                  สถานะห้องทั้งหมดวันนี้ (Floor Status)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-gray-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">ชื่อห้อง</th>
                        <th className="px-4 py-3 text-left font-semibold">ประเภท</th>
                        <th className="px-4 py-3 text-left font-semibold">ความจุ</th>
                        <th className="px-4 py-3 text-left font-semibold">สถานะ</th>
                        <th className="px-4 py-3 text-center font-semibold">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.roomStatusData.map((room, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {room.name.substring(0, 1)}
                            </div>
                            {room.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {room.type}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {room.capacity} คน
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                room.status,
                              )}`}
                            >
                              {room.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-400 cursor-pointer hover:text-gray-600">
                            •••
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-red-50 opacity-50">
                  <AlertTriangle size={100} />
                </div>
                <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4 relative z-10">
                  <div className="p-1.5 bg-red-100 rounded-md">
                    <AlertTriangle size={16} />
                  </div>
                  การแจ้งเตือนด่วน
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 relative z-10">
                  {stats.roomStatusData && stats.roomStatusData.filter((r: any) => r.status === "บำรุงรักษา" || r.status === "ปิดใช้งาน").length > 0 ? (
                    stats.roomStatusData.filter((r: any) => r.status === "บำรุงรักษา" || r.status === "ปิดใช้งาน").map((room: any, i: number) => (
                      <li key={i} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                        <span>ห้อง <strong className="text-slate-800">{room.name}</strong> อยู่ในสถานะ{room.status}</span>
                      </li>
                    ))
                  ) : (
                    <li className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      ไม่มีการแจ้งเตือนด่วน ระบบทำงานปกติ
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">
                  อัตราการใช้งานเทียบความจุ
                </h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={occupancyChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#3B82F6" />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.capacityUtilizationRate || 0}%
                  </p>
                  <p className="text-xs font-semibold text-gray-400 tracking-wider mt-2">
                    OCCUPIED
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
