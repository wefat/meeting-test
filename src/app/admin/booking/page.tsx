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
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              จัดการการจองห้องประชุม
            </h1>
            <p className="text-gray-500 mt-1">
              จำนวนการจองทั้งหมด: {filteredBookings.length} รายการ
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition">
              <Download size={18} />
              <span className="text-sm font-medium">ดาวน์โหลด</span>
            </button>
            <a
              href="/admin/booking/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">เพิ่มการจองใหม่</span>
            </a>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาห้องหรือผู้จัดการ..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="pending">รอการยืนยัน</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    เลขที่การจอง
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    ห้องประชุม
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    ผู้จัดการ
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    วันที่ - เวลา
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    ผู้เข้าร่วม
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedBookings.map((booking) => {
                  const { badge, label } = getStatusBadge(booking.status);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {booking.roomName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {booking.organizer}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div>{booking.date}</div>
                        <div className="text-xs text-gray-500">
                          {booking.timeStart} - {booking.timeEnd}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {booking.participants} คน
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${badge}`}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button className="p-1.5 hover:bg-blue-50 rounded-lg transition">
                            <Eye size={16} className="text-blue-600" />
                          </button>
                          <a
                            href={`/admin/booking/${booking.id}`}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </a>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {paginatedBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ไม่พบข้อมูลการจอง
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            แสดง {startIndex + 1} ถึง{" "}
            {Math.min(startIndex + itemsPerPage, filteredBookings.length)} จาก{" "}
            {filteredBookings.length} รายการ
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-medium transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagementPage;
