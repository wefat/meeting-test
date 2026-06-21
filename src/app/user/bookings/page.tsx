"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/mockAuth";
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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser) {
      router.push("/login");
    } else {
      setUser(authUser);
      
      const fetchData = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const [roomsRes, bookingsRes] = await Promise.all([
            fetch(`${apiUrl}/api/admin/rooms`),
            fetch(`${apiUrl}/api/admin/bookings`)
          ]);
          
          if (roomsRes.ok) {
            const roomsData = await roomsRes.json();
            setRooms(roomsData);
          }
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            setBookings(bookingsData);
          }
        } catch (err) {
          console.error("Error fetching bookings page data:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [router]);

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
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-600 font-medium">กำลังโหลดข้อมูลการจอง...</p>
      </div>
    );
  }

  // Filter bookings for logged-in user
  const userBookings = bookings.filter((b) => b.organizer === user?.name);

  // Map database bookings to page format
  const mappedBookings = userBookings.map((b) => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentTimeStr = now.toTimeString().split(" ")[0].substring(0, 5);

    let status = "history";
    let statusLabel = "เสร็จสิ้น";

    if (b.status === "cancelled") {
      status = "cancelled";
      statusLabel = "ยกเลิกแล้ว";
    } else {
      const isPast = b.date < todayStr || (b.date === todayStr && b.timeEnd <= currentTimeStr);
      if (!isPast) {
        status = "upcoming";
        statusLabel = b.status === "confirmed" ? "ยืนยันแล้ว" : "รอยืนยัน";
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

  const upcomingBookings = searchedBookings.filter(
    (b) => b.status === "upcoming"
  );

  const historyBookings = searchedBookings.filter(
    (b) => b.status === "history" || b.status === "cancelled"
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
          <div className="w-full space-y-8">
            {/* 1. การจองที่กำลังจะมาถึง (Upcoming Bookings) */}
            <section className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>การจองที่กำลังจะมาถึง</span>
              </h2>

              <div className="bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-sm text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-gray-500">
                      <tr>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">ห้อง</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">หัวข้อ</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">วันที่</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">เวลา</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">ผู้เข้าร่วม</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">สถานะ</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide text-center w-24">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {upcomingBookings.length > 0 ? (
                        upcomingBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{booking.roomName}</td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{booking.bookingTitle}</td>
                            <td className="px-6 py-4 text-slate-600">{booking.date}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{booking.time}</td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{booking.participants} คน</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusColor(booking.status)}`}>
                                {booking.statusLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <Link href={`/user/bookings/${booking.id}`} title="ดูรายละเอียด" className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors inline-block">
                                  <Eye size={15} />
                                </Link>
                                <button 
                                  onClick={() => handleCancelBooking(booking.id)}
                                  title="ยกเลิกการจอง" 
                                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium bg-white">
                            ไม่มีรายการจองที่กำลังจะมาถึง
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 2. ส่วนประวัติการจองห้องประชุม (History Bookings) */}
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
                        <th className="px-6 py-3.5 font-semibold tracking-wide">ห้อง</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">หัวข้อ</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">วันที่</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">เวลา</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">ผู้เข้าร่วม</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide">สถานะ</th>
                        <th className="px-6 py-3.5 font-semibold tracking-wide text-center w-24">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {historyBookings.length > 0 ? (
                        historyBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{booking.roomName}</td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{booking.bookingTitle}</td>
                            <td className="px-6 py-4 text-slate-600">{booking.date}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{booking.time}</td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{booking.participants} คน</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusColor(booking.status)}`}>
                                {booking.statusLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <Link href={`/user/bookings/${booking.id}`} title="ดูรายละเอียด" className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors inline-block">
                                  <Eye size={15} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-16 text-center text-slate-400 font-medium bg-white">
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
