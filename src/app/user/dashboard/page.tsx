"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Users,
  MapPin,
  LogOut,
  Bell,
  Search,
  Settings,
  BarChart3,
  Calendar,
  AlertCircle,
  ChevronRight,
  Plus,
  BarChart2,
  Trash2,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { getAuthUser, User } from "../../../lib/mockAuth";
import SidebarNav from "@/components/layout/NavbarUser";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNotification, setActiveNotification] = useState(0);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadLocalNotifs = () => {
      try {
        const stored = localStorage.getItem("userNotifications");
        if (stored) {
          const all = JSON.parse(stored);
          const filtered = all.filter((n: any) => n.targetUser === user.name);
          setLocalNotifications(filtered);
        }
      } catch (err) {
        console.error("Error loading user notifications:", err);
      }
    };
    loadLocalNotifs();
    window.addEventListener("storage", loadLocalNotifs);
    return () => window.removeEventListener("storage", loadLocalNotifs);
  }, [user]);

  const handleClearUserNotifications = () => {
    if (!user) return;
    try {
      const stored = localStorage.getItem("userNotifications");
      if (stored) {
        const all = JSON.parse(stored);
        const remaining = all.filter((n: any) => n.targetUser !== user.name);
        localStorage.setItem("userNotifications", JSON.stringify(remaining));
        setLocalNotifications([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser || authUser.type !== "user") {
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
          console.error("Error fetching dashboard data:", err);
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
      <div className="flex items-center justify-center h-screen bg-slate-50 text-sm font-medium text-slate-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  const userBookings = bookings.filter(
    (booking) => booking.organizer === user?.name,
  );

  const userNotifications = [
    ...localNotifications,
    ...userBookings
      .filter((b) => b.status === "cancelled")
      .map((b) => ({
        id: b.id,
        message: `การจองห้อง ${b.roomName} ในวันที่ ${b.date} (${b.timeStart} - ${b.timeEnd}) ถูกยกเลิกแล้ว`,
        read: false,
      }))
  ];

  const getRoomData = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room : { name: "Unknown Room", image: "" };
  };

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentTimeStr = now.toTimeString().split(" ")[0].substring(0, 5);

  const upcomingBookings = userBookings
    .filter((b) => {
      if (b.status === "cancelled") return false;
      return b.date > todayStr || (b.date === todayStr && b.timeEnd > currentTimeStr);
    })
    .slice(0, 3)
    .map((booking: any) => {
      const roomData = getRoomData(booking.roomId);
      const time = `${booking.timeStart} - ${booking.timeEnd}`;
      const startHour = parseInt(booking.timeStart.split(":")[0]);
      const period = startHour >= 12 ? "PM" : "AM";
      
      return {
        id: booking.id,
        time,
        period,
        title: booking.title,
        description: `ผู้จัด: ${booking.organizer}`,
        roomName: roomData.name || booking.roomName,
        roomImage: roomData.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
        participants: booking.participants || 1,
        date: booking.date,
        status: booking.status,
      };
    });

  const totalCount = userBookings.length;
  const completedCount = userBookings.filter(
    (b) => b.status === "confirmed" && (b.date < todayStr || (b.date === todayStr && b.timeEnd <= currentTimeStr))
  ).length;
  const cancelledCount = userBookings.filter((b) => b.status === "cancelled").length;

  const suggestions = [
    { icon: MapPin, label: "หาห้องประชุม", color: "bg-red-50 text-red-600 border border-red-100" },
    { icon: Calendar, label: "จองห้องใหม่", color: "bg-blue-50 text-blue-600 border border-blue-100" },
    { icon: AlertCircle, label: "ปรึกษาหารือ", color: "bg-yellow-50 text-yellow-600 border border-yellow-100" },
    { icon: BarChart3, label: "สรุปสถิติ", color: "bg-slate-50 text-slate-600 border border-slate-100" },
  ];

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans antialiased text-slate-800">
      {/* Sidebar เมนูด้านซ้าย */}
      <SidebarNav sidebarOpen={sidebarOpen} />

      {/* Main Content Area - จัดระยะขอบเว้นหลบ Sidebar บนจอคอมพิวเตอร์และมือถืออัตโนมัติ */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full">
        
        {/* Header แถบด้านบน */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div className="pl-16 pr-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md hidden sm:block">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="ค้นหาห้องประชุม..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative text-slate-500"
                >
                  <Bell size={18} />
                  {userNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-30">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <span className="font-bold text-xs text-slate-700">การแจ้งเตือน</span>
                      {userNotifications.length > 0 && (
                        <button 
                          onClick={handleClearUserNotifications}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          ล้างทั้งหมด
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 text-left">
                      {userNotifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-slate-400 text-xs font-medium">
                          ไม่มีข้อความแจ้งเตือนใหม่
                        </div>
                      ) : (
                        userNotifications.map((n, idx) => (
                          <div key={n.id || idx} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hidden sm:block">
                <Settings size={18} />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs select-none">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">
            
            {/* Welcome Banner Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-extrabold mb-1.5 tracking-tight">
                  ยินดีต้อนรับกลับมา, {user?.name}!
                </h1>
                <p className="text-blue-100 text-sm mb-6 font-medium max-w-md leading-relaxed">
                  ต้องการจองห้องประชุม หรือตรวจสอบประวัติและสถานะข้อมูลการจองของคุณอย่างรวดเร็วได้ทันที
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/user/bookings"
                    className="bg-white text-blue-600 px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2 active:scale-95"
                  >
                    <Calendar size={14} />
                    <span>ข้อมูลการจอง</span>
                  </Link>
                  <Link
                    href="/user/rooms/room-list"
                    className="bg-white/20 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-white/30 border border-white/20 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <MapPin size={14} />
                    <span>หาห้องประชุม</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── ส่วนที่ 1: ภาพรวมสถานะการจอง (เรียง 3 บล็อกแบบมีแถบสีดึงสายตาด้านซ้าย) ── */}
            <section className="space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 tracking-wide">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <span>ภาพรวมสถานะ</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white rounded-xl p-5 border border-slate-200 border-l-4 border-l-blue-600 shadow-2xs">
                  <div className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">
                    การจองทั้งหมด
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{totalCount}</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200 border-l-4 border-l-emerald-500 shadow-2xs">
                  <div className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">
                    เสร็จสิ้น
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{completedCount}</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200 border-l-4 border-l-red-500 shadow-2xs">
                  <div className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">
                    ยกเลิกแล้ว
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{cancelledCount}</div>
                </div>
              </div>
            </section>

            {/* Content Dashboard Grid System */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* คอลัมน์ฝั่งซ้าย: รายการการจองที่จะมาถึงวันนี้ (กว้าง 2 ส่วน) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 tracking-wide">
                    ห้องที่กำลังจะมาถึง (Upcoming Bookings)
                  </h2>
                  <Link
                    href="/user/bookings"
                    className="text-blue-600 text-xs font-semibold hover:underline"
                  >
                    ดูทั้งหมด
                  </Link>
                </div>

                {/* ── ปรับปรุงดีไซน์การ์ดและเพิ่มรูปภาพห้องประชุมในบล็อกไทม์ไลน์ ── */}
                <div className="space-y-4">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row overflow-hidden group"
                      >
                        {/* รูปภาพห้องพรีวิวด้านข้าง */}
                        <div className="h-32 sm:h-auto sm:w-44 relative bg-slate-100 shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-100 flex items-center justify-center">
                          {booking.roomImage ? (
                            <img 
                              src={booking.roomImage} 
                              alt={booking.roomName} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <ImageIcon size={32} className="text-slate-300" />
                          )}
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/70 backdrop-blur-2xs text-white text-[10px] font-bold">
                            {booking.time} {booking.period}
                          </span>
                        </div>

                        {/* รายละเอียดข้อมูล */}
                        <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                                {booking.roomName}
                              </h3>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                booking.status === "confirmed" 
                                  ? "bg-green-50 text-green-700 border border-green-100" 
                                  : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                              }`}>
                                {booking.status === "confirmed" ? "ยืนยันแล้ว" : "รอยืนยัน"}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 truncate">{booking.title}</p>
                            <p className="text-[11px] text-slate-400 font-medium truncate">{booking.description}</p>
                          </div>
                          
                          {/* แทบไอคอนรายละเอียดพิกัดล่างการ์ด */}
                          <div className="flex items-center justify-between gap-4 pt-3 mt-3 border-t border-slate-50 text-xs font-semibold text-slate-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock size={14} className="text-slate-400" />
                                <span className="text-slate-600 font-medium">{booking.time} น.</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={14} className="text-slate-400" />
                                <span className="text-slate-600 font-medium">{booking.participants} คน</span>
                              </span>
                            </div>
                            
                            {/* บล็อกควบคุมจัดการข้อมูล (ดูรายละเอียด / ลบรายการ) */}
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => router.push(`/user/bookings/${booking.id}`)}
                                title="ดูรายละเอียด" 
                                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-md transition-colors"
                              >
                                <Eye size={15} />
                              </button>
                              <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                title="ยกเลิกการจอง" 
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-medium text-slate-400">
                      วันนี้คุณไม่มีกำหนดการจองห้องประชุม
                    </div>
                  )}
                </div>
              </div>

              {/* คอลัมน์ฝั่งขวา: การจัดการแจ้งเตือน และ ปุ่มเครื่องมือช่วยเหลือด่วน */}
              <div className="space-y-6 lg:pt-8">
                
                {/* 1. Notifications Board */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col ">
                  <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex items-center justify-between shrink-0">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                      แจ้งเตือนการจัดการจอง
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
                      {userNotifications.length > 0 ? activeNotification + 1 : 0}/{userNotifications.length}
                    </span>
                  </div>

                  {userNotifications.length > 0 ? (
                    <>
                      {userNotifications.map((notif, index) => (
                        <div
                          key={notif.id}
                          className={`p-4 flex-1 ${
                            index === activeNotification ? "block" : "hidden"
                          }`}
                        >
                          <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-red-50 text-red-600 border border-red-100 shadow-2xs">
                              <AlertCircle size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-2">
                                เมื่อไม่นานมานี้
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* จุดควบคุมเลื่อนแจ้งเตือน */}
                      <div className="pb-3 pt-1 bg-white flex gap-1.5 justify-center shrink-0">
                        {userNotifications.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveNotification(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              index === activeNotification
                                ? "bg-blue-600 w-3"
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs font-medium bg-white">
                      ไม่มีข้อความแจ้งเตือนใหม่
                    </div>
                  )}
                </div>

                {/* 2. Quick Suggestions Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-4">
                    เรื่องอื่นที่น่าสนใจในระบบ
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {suggestions.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`p-3.5 rounded-xl text-center transition-all border shadow-2xs hover:shadow-sm active:scale-95 ${item.color}`}
                      >
                        <item.icon size={20} className="mx-auto mb-1.5" />
                        <p className="text-xs font-bold tracking-tight">{item.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-30">
        <Link
          href="/user/rooms/room-list"
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-100 hover:shadow-lg hover:scale-105"
        >
          <Plus size={24} className="stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}