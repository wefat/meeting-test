"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface Booking {
  id: string;
  roomName: string;
  organizer: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  participants: number;
  status: "confirmed" | "pending" | "cancelled";
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    roomName: "Andaman Suite",
    organizer: "สมชาย ทดสอบ",
    date: "2024-01-24",
    timeStart: "09:00",
    timeEnd: "10:30",
    participants: 25,
    status: "confirmed",
  },
  {
    id: "BK002",
    roomName: "Neon Hub",
    organizer: "ศรีนวล ทดสอบ",
    date: "2024-01-24",
    timeStart: "14:00",
    timeEnd: "15:30",
    participants: 12,
    status: "confirmed",
  },
  {
    id: "BK003",
    roomName: "Zen Garden",
    organizer: "สวรรค์ ทดสอบ",
    date: "2024-01-25",
    timeStart: "10:00",
    timeEnd: "11:00",
    participants: 8,
    status: "pending",
  },
  {
    id: "BK004",
    roomName: "Tech Cove",
    organizer: "อนุวัติ ทดสอบ",
    date: "2024-01-25",
    timeStart: "15:00",
    timeEnd: "16:00",
    participants: 30,
    status: "confirmed",
  },
  {
    id: "BK005",
    roomName: "Skyline Boardroom",
    organizer: "เสริมศรี ทดสอบ",
    date: "2024-01-23",
    timeStart: "13:00",
    timeEnd: "14:30",
    participants: 15,
    status: "cancelled",
  },
];

const getStatusBadge = (status: string) => {
  const badges: { [key: string]: string } = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };
  const labels: { [key: string]: string } = {
    confirmed: "ยืนยันแล้ว",
    pending: "รอการยืนยัน",
    cancelled: "ยกเลิก",
  };
  return { badge: badges[status], label: labels[status] };
};

const BookingManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      {/* Sidebar คงที่ด้านซ้าย */}
      <AdminSidebar />

      {/* Main Content Container: เพิ่ม ml-64 เพื่อหลบ sidebar และปรับ padding ให้สมดุล */}
      <div className="flex-1 ml-0 md:ml-64 min-w-0 transition-all duration-300 p-5">
        <div className="w-full">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                จัดการการจองห้องประชุม
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                จำนวนการจองทั้งหมด: <span className="font-semibold text-slate-700">{filteredBookings.length}</span> รายการ
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
                <Download size={16} />
                <span>ดาวน์โหลด</span>
              </button>
              <a
                href="/admin/booking/create"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
              >
                <Plus size={16} />
                <span>เพิ่มการจองใหม่</span>
              </a>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-lg border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="ค้นหาห้องหรือผู้จัดการ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent outline-none w-full text-sm text-slate-800 placeholder-gray-400"
                />
              </div>
              <div className="sm:w-48 shrink-0">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="pending">รอการยืนยัน</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-gray-500">
                  <tr>
                    <th className="px-6 py-3.5 text-left font-semibold tracking-wide">เลขที่การจอง</th>
                    <th className="px-6 py-3.5 text-left font-semibold tracking-wide">ห้องประชุม</th>
                    <th className="px-6 py-3.5 text-left font-semibold tracking-wide">ผู้จัดการ</th>
                    <th className="px-6 py-3.5 text-left font-semibold tracking-wide">วันที่ - เวลา</th>
                    <th className="px-6 py-3.5 text-left font-semibold tracking-wide">ผู้เข้าร่วม</th>
                    <th className="px-6 py-3.5 text-left font-semibold tracking-wide">สถานะ</th>
                    <th className="px-6 py-3.5 text-center font-semibold tracking-wide w-32">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedBookings.map((booking) => {
                    const { badge, label } = getStatusBadge(booking.status);
                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-blue-600 tracking-medium">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {booking.roomName}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {booking.organizer}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{booking.date}</div>
                          <div className="text-xs text-gray-400 font-medium mt-0.5">
                            {booking.timeStart} - {booking.timeEnd}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {booking.participants} คน
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${badge}`}
                          >
                            {label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-1.5">
                            <button title="ดูรายละเอียด" className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                            <a
                              href={`/admin/booking/${booking.id}`}
                              title="แก้ไข"
                              className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </a>
                            <button title="ลบ" className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {paginatedBookings.length === 0 && (
              <div className="text-center py-12 text-gray-400 font-medium bg-white">
                ไม่พบข้อมูลการจองที่ค้นหา
              </div>
            )}
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pb-8">
            <div className="text-sm text-gray-500 font-medium order-2 sm:order-1">
              แสดง <span className="text-slate-800 font-semibold">{startIndex + 1}</span> ถึง{" "}
              <span className="text-slate-800 font-semibold">
                {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
              </span> จาก{" "}
              <span className="text-slate-800 font-semibold">{filteredBookings.length}</span> รายการ
            </div>
            
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingManagementPage;