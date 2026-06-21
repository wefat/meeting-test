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

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
    {change && (
      <p className="text-sm font-medium">
        <span className="text-green-600">{change}</span>
      </p>
    )}
  </div>
);

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
    { name: "กำลังใช้งาน", value: stats.utilizationRate },
    { name: "ว่าง", value: 100 - stats.utilizationRate },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <AdminSidebar />

      {/* แก้ไข: เปลี่ยนจาก ml-64 เป็น ml-0 สำหรับโมบายล์ และใช้ md:ml-64 เมื่อเป็นจอคอมพิวเตอร์ */}
      <div className="flex-1 ml-0 md:ml-64 min-w-0 transition-all duration-300">
        {/* Topbar */}
        {/* แก้ไข: ปรับ padding จาก p-4 เป็น px-4 py-4 md:px-6 เพื่อให้เว้นระยะขอบหลบปุ่ม Hamburger บนมือถือ */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 md:px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm gap-4">
          {/* ส่วนกล่องค้นหา: เพิ่ม pl-12 บนหน้าจอเล็ก เพื่อไม่ให้ทับกับปุ่มเบอร์เกอร์ของ Sidebar */}
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

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                แดชบอร์ดผู้ดูแลระบบ
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                การวิเคราะห์ข้อมูลอย่างรวมและจัดการระบบจองห้องประชุม RoomSync
                Pro
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-2xs">
                <FileDown size={16} />
                เพิ่มห้องประชุม
              </button>
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Plus size={16} />
                <a
                  href="/admin/booking/create"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                ></a>
                จองห้องประชุม
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:grid-cols-2 lg:gap-6 mb-8">
            <StatCard
              title="อัตราการใช้งานรวม"
              value={`${stats.utilizationRate}%`}
              change="วันนี้"
              icon={TrendingUp}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              title="การจองวันนี้"
              value={String(stats.todayBookingsCount)}
              change="รายการจองวันนี้"
              icon={Calendar}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="สถานะการบำรุงรักษา"
              value={String(stats.maintenanceRooms)}
              change="ห้องบำรุงรักษา"
              icon={AlertTriangle}
              color="bg-red-100 text-red-600"
            />
            <StatCard
              title="รายได้เดือนนี้ (ประมาณการ)"
              value={`฿${(stats.todayBookingsCount * 500).toLocaleString()}`}
              change="ประเมินจากยอดจอง"
              icon={DollarSign}
              color="bg-purple-100 text-purple-600"
            />
          </div>

          {/* กลุ่มกิจกรรม, ห้องยอดนิยม, และกราฟรายเดือน */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">
                กิจกรรมล่าสุดในระบบ
              </h3>
              <div className="space-y-4">
                {stats.recentActivities.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">
                    ไม่มีกิจกรรมล่าสุด
                  </p>
                ) : (
                  stats.recentActivities.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold">{item.label}</span>:{" "}
                          {item.action}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          น.
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Popular Rooms */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">
                ห้องยอดนิยมสูงสุด (Top Popular Rooms)
              </h3>
              <div className="space-y-3">
                {stats.popularRoomsData.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">
                    ยังไม่มีข้อมูลสถิติ
                  </p>
                ) : (
                  stats.popularRoomsData.map((room) => (
                    <div
                      key={room.rank}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          {room.rank}
                        </span>
                        <span className="text-sm text-slate-700">
                          {room.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {room.bookings} ครั้ง
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Usage Trend */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">
                แนวโน้มการใช้งานรายเดือน (Monthly Usage Trend)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={stats.monthlyUsageData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "6px",
                    }}
                    formatter={(value) => [`${value}%`, "Usage"]}
                  />
                  <Bar dataKey="usage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* กลุ่มสถานะห้อง (Floor Status), แจ้งเตือนด่วน, และกราฟวงกลมเทียบความจุ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Status Table */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-6">
                  สถานะห้องทั้งหมดวันนี้ (Floor Status)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-gray-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          ชั้น
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          ชื่อห้อง
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          ประเภท
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          ความจุ
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          สถานะ
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          การจัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.roomStatusData.map((room, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-600">
                            {room.floor}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
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

            {/* Alerts & Occupancy Section */}
            <div className="space-y-6">
              {/* Urgent Alerts */}
              <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} />
                  การแจ้งเตือนด่วน
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    ระบบปรับอากาศห้อง Chao Phraya Boardroom ไม่ทำงาน
                  </li>
                  <li>Andaman Suite (15:00 - 16:00) มีการจองซ้อน</li>
                </ul>
              </div>

              {/* Occupancy Rate Chart */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
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
                        <Cell fill="#E5E7EB" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.utilizationRate}%
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

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-30">
        <Plus size={24} />
      </button>
    </div>
  );
}
