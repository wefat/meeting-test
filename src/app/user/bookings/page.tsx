"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Eye,
  Trash2,
  Search,
  Filter,
  BarChart2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import SidebarNav from "@/components/layout/NavbarUser";

interface Booking {
  id: string;
  roomName: string;
  roomImage: string;
  bookingTitle: string;
  date: string;
  time: string;
  participants: number;
  status: "upcoming" | "history" | "cancelled";
  statusLabel: string;
  organizer: string;
  cost: number;
}

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "1",
    roomName: "Skyline Boardroom",
    roomImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    bookingTitle: "Weekly Sync",
    date: "24 พฤศจิกายน 2568",
    time: "08:00 - 10:30",
    participants: 8,
    status: "upcoming",
    statusLabel: "ยืนยันแล้ว",
    organizer: "สมชาย ม...",
    cost: 5000,
  },
  {
    id: "2",
    roomName: "Innovation Hub",
    roomImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    bookingTitle: "Brainstorming Session",
    date: "25 พฤศจิกายน 2568",
    time: "13:00 - 15:00",
    participants: 12,
    status: "upcoming",
    statusLabel: "รอยืนยัน",
    organizer: "วิจัย ค...",
    cost: 5000,
  },
  {
    id: "3",
    roomName: "Quartz Meeting Hall",
    roomImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    bookingTitle: "Client Presentation",
    date: "23 พฤศจิกายน 2568",
    time: "10:30 - 12:00",
    participants: 6,
    status: "cancelled",
    statusLabel: "ยกเลิกแล้ว",
    organizer: "สมชาย ม...",
    cost: 3750,
  },
  {
    id: "4",
    roomName: "Skyline Boardroom",
    roomImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    bookingTitle: "Team Meeting",
    date: "20 พฤศจิกายน 2568",
    time: "09:00 - 10:30",
    participants: 5,
    status: "history",
    statusLabel: "เสร็จสิ้น",
    organizer: "สมชาย ม...",
    cost: 3750,
  },
  {
    id: "5",
    roomName: "Creative Hub",
    roomImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    bookingTitle: "Design Workshop",
    date: "18 พฤศจิกายน 2568",
    time: "14:00 - 16:00",
    participants: 10,
    status: "history",
    statusLabel: "เสร็จสิ้น",
    organizer: "วิจัย ค...",
    cost: 5000,
  },
  {
    id: "6",
    roomName: "Zen Garden Room",
    roomImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    bookingTitle: "One-on-One",
    date: "15 พฤศจิกายน 2568",
    time: "11:00 - 12:00",
    participants: 2,
    status: "history",
    statusLabel: "เสร็จสิ้น",
    organizer: "สมชาย ม...",
    cost: 2500,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-green-50 text-green-700 border border-green-100";
    case "cancelled":
      return "bg-red-50 text-red-700 border border-red-100";
    case "history":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
};

export default function MyBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // กรองข้อมูลตามคำค้นหา
  const searchedBookings = SAMPLE_BOOKINGS.filter(
    (booking) =>
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // แยกประเภทข้อมูลหลังค้นหา
  const upcomingBookings = searchedBookings.filter(
    (b) => b.status === "upcoming",
  );

  const historyBookings = searchedBookings.filter(
    (b) => b.status === "history" || b.status === "cancelled",
  );

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <SidebarNav sidebarOpen={sidebarOpen} />

      {/* Main Content Area - ปรับขนาดหลบแนว Sidebar ทั้งจอคอมและมือถือสลับตาม Responsive */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full">
        {/* Header แถบด้านบนและส่วน Search Filter */}
        <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-20 flex-shrink-0">
          <div className="pl-16 pr-4 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  การจองของฉัน
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  ดูและจัดการการจองห้องประชุมของคุณทั้งหมดในหน้าเดียว
                </p>
              </div>

              {/* Actions Box Group */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:w-72 relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ค้นหาห้อง หรือ ชื่อการประชุม..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-500 transition-all placeholder-slate-400"
                  />
                </div>
                <button
                  type="button"
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 bg-white shadow-2xs active:scale-95 transition-all"
                >
                  <Filter className="w-4 h-4" />
                </button>
                <Link href="/user/rooms/room-list" className="shrink-0">
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm shadow-blue-100 whitespace-nowrap"
                  >
                    + จองห้องใหม่
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Container ของข้อมูลรายงาน */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">
            {/* 1. ส่วนประวัติการจองห้องประชุม (History Bookings) แสดงผลในรูปแบบตารางโปร่งสะอาดตา */}
            <section className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <span>ประวัติการจอง</span>
              </h2>

              <div className="bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-sm text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-gray-500">
                      <tr>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">
                          ห้อง
                        </th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">
                          หัวข้อ
                        </th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">
                          วันที่
                        </th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">
                          เวลา
                        </th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">
                          ผู้เข้าร่วม
                        </th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">
                          สถานะ
                        </th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide text-center w-24">
                          การจัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {historyBookings.length > 0 ? (
                        historyBookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-slate-900">
                              {booking.roomName}
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {booking.bookingTitle}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {booking.date}
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                              {booking.time}
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {booking.participants} คน
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusColor(booking.status)}`}
                              >
                                {booking.statusLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                {/* แก้ไขครอบแท็ก Link ชี้มายังไฟล์รายละเอียดห้องย่อยตาม id */}
                                <Link
                                  href={`/user/bookings/${booking.id}`}
                                  title="ดูรายละเอียด"
                                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors inline-block"
                                >
                                  <Eye size={15} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-16 text-center text-slate-400 font-medium bg-white"
                          >
                            ไม่พบข้อมูลประวัติการจองห้องประชุม
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
