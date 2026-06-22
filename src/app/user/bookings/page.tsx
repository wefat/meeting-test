"use client";

import { useEffect, useState } from "react";
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
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SidebarNav from "@/components/layout/NavbarUser";

const BookingCalendar = dynamic(() => import("@/components/ui/BookingCalendar"), { ssr: false });

function getStatusColor(status: string) {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "history":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function MyBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) setUser(authUser);

    if (authUser) {
      const fetchData = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const [roomsRes, bookingsRes, summaryRes] = await Promise.all([
            fetch(`${apiUrl}/api/admin/rooms`),
            fetch(`${apiUrl}/api/admin/bookings`),
            fetch(`${apiUrl}/api/admin/bookings/summary`)
          ]);
          
          if (roomsRes.ok) {
            const roomsData = await roomsRes.json();
            setRooms(roomsData);
          }
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            setBookings(bookingsData);
          }
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            setCalendarEvents(summaryData);
          }
        } catch (err) {
          console.error("Error fetching bookings page data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  function getAuthUser() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled"
        })
      });
      if (res.ok) {
        alert("ยกเลิกการจองสำเร็จ");
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
        );
      } else {
        alert("ไม่สามารถยกเลิกการจองได้");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // Filter for ONLY this user
  const userBookings = bookings.filter(b => b.organizer === user?.name || b.organizerId === user?.id);

  // Map user bookings to component expected format
  const mappedBookings = userBookings.map((b) => {
    let status = "upcoming";
    let statusLabel = "กำลังจะมาถึง";

    if (b.status === "cancelled") {
      status = "cancelled";
      statusLabel = "ยกเลิกแล้ว";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (b.date < today) {
        status = "history";
        statusLabel = "เสร็จสิ้น";
      }
    }

    return {
      id: b.id,
      roomName: b.roomName,
      bookingTitle: b.title,
      date: b.date,
      time: `${b.timeStart} - ${b.timeEnd}`,
      participants: b.participants,
      status,
      statusLabel,
    };
  });

  // Filter by search
  const searchedBookings = mappedBookings.filter(
    (booking) =>
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for table view
  const filteredBookings = searchedBookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans">
      <SidebarNav sidebarOpen={sidebarOpen} />

      <div className="flex-1 ml-0 md:ml-64 min-w-0 transition-all duration-300 p-5">
        <div className="w-full">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                จัดการการจองห้องประชุม
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                จำนวนการจองทั้งหมด: <span className="font-semibold text-slate-700">{searchedBookings.length}</span> รายการ
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
                <Download size={16} />
                <span>ดาวน์โหลด</span>
              </button>
              <Link
                href="/user/rooms/room-list"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
              >
                <Plus size={16} />
                <span>เพิ่มการจองใหม่</span>
              </Link>
            </div>
          </div>

          {/* View Mode Toggle Tabs */}
          <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-lg border border-slate-200 w-fit shadow-3xs">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              รายการจองทั้งหมด (ตาราง)
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              ปฏิทินสรุปตารางการจอง
            </button>
          </div>

          {viewMode === "table" && (
            <>
              {/* Filters and Search Bar */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-lg border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <Search size={18} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="ค้นหาห้องหรือหัวข้อ..."
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
                      <option value="upcoming">กำลังจะมาถึง / รอยืนยัน</option>
                      <option value="history">ประวัติ / เสร็จสิ้น</option>
                      <option value="cancelled">ยกเลิกแล้ว</option>
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
                        <th className="px-6 py-3.5 text-left font-semibold tracking-wide">ห้อง</th>
                        <th className="px-6 py-3.5 text-left font-semibold tracking-wide">หัวข้อ</th>
                        <th className="px-6 py-3.5 text-left font-semibold tracking-wide">วันที่</th>
                        <th className="px-6 py-3.5 text-left font-semibold tracking-wide">เวลา</th>
                        <th className="px-6 py-3.5 text-left font-semibold tracking-wide">ผู้เข้าร่วม</th>
                        <th className="px-6 py-3.5 text-left font-semibold tracking-wide">สถานะ</th>
                        <th className="px-6 py-3.5 text-center font-semibold tracking-wide w-32">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedBookings.length > 0 ? (
                        paginatedBookings.map((booking) => {
                          return (
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
                              <td className="px-6 py-4 text-slate-600">
                                {booking.participants} คน
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusColor(booking.status)}`}>
                                  {booking.statusLabel}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  <Link
                                    href={`/user/bookings/${booking.id}`}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors inline-block"
                                    title="ดูรายละเอียด"
                                  >
                                    <Eye size={15} />
                                  </Link>
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                    title="ยกเลิกการจอง"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium bg-white">
                            ไม่พบรายการจอง
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      แสดง <span className="font-medium text-slate-700">{startIndex + 1}</span> ถึง <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, searchedBookings.length)}</span> จากทั้งหมด <span className="font-medium text-slate-700">{searchedBookings.length}</span> รายการ
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-sm font-medium text-slate-700 px-2">
                        หน้า {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {viewMode === "calendar" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[600px]">
              <BookingCalendar events={calendarEvents} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
