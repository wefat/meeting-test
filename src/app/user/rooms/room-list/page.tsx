"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  Wifi,
  Monitor,
  Wind,
  Coffee,
  Zap,
  Tv,
  Laptop,
  Video,
  Volume2,
  Image as ImageIcon,
} from "lucide-react";
import SidebarNav from "@/components/layout/NavbarUser";

interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  type: string;
  description: string;
  status: "available" | "maintenance" | "inactive";
  image?: string;
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={16} />,
  projector: <Monitor size={16} />,
  ac: <Wind size={16} />,
  tv: <Tv size={16} />,
  whiteboard: <Zap size={16} />,
  computer: <Laptop size={16} />,
  "coffee station": <Coffee size={16} />,
  "video conference": <Video size={16} />,
  "sound system": <Volume2 size={16} />,
  "interactive board": <Zap size={16} />,
};

export default function UserRoomListPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("11/24/2025");
  const [selectedTime, setSelectedTime] = useState("08:00 - 08:30");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/admin/rooms`);
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (capacityFilter !== "all") {
      const [min, max] = capacityFilter.split("-").map(Number);
      filtered = filtered.filter((room) =>
        max
          ? room.capacity >= min && room.capacity <= max
          : room.capacity >= min
      );
    }

    return filtered;
  }, [rooms, searchTerm, capacityFilter]);

  const handleRoomClick = (roomId: string) => {
    router.push(`/user/rooms/${roomId}`);
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans antialiased">
      {/* Sidebar Navigation */}
      <SidebarNav sidebarOpen={sidebarOpen} />

      {/* Main Container ฝั่งขวา: ปรับแต่ง Sizing หลบ Sidebar ทั้งบนจอคอมและมือถือ */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full">
        
        {/* Topbar Header: ยึดติดขอบบน เพิ่มพื้นที่ขยับซ้ายบนโมบายล์เพื่อเลี่ยงปุ่ม Hamburger */}
        <header className="border-b border-slate-200 bg-white shadow-xs sticky top-0 z-20">
          <div className="pl-16 pr-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  RoomSync Pro
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Enterprise Management</p>
              </div>
              <button
                onClick={() => router.push("/user/bookings")}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
              >
                My Bookings
              </button>
            </div>
          </div>
        </header>

        {/* Main Content พื้นที่แสดงฟิลเตอร์กรองและรายการห้องประชุม */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">
            
            {/* Search & Filter Section Panel */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 mb-8">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* Date Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-2.5 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                </div>

                {/* Time Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Time
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-2.5 text-slate-400"
                      size={16}
                    />
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option>08:00 - 08:30</option>
                      <option>08:30 - 09:00</option>
                      <option>09:00 - 09:30</option>
                      <option>09:30 - 10:00</option>
                      <option>10:00 - 10:30</option>
                    </select>
                  </div>
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Capacity
                  </label>
                  <select
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="all">All Sizes</option>
                    <option value="1-5">1-5 People</option>
                    <option value="6-15">6-15 People</option>
                    <option value="16-50">16+ People</option>
                  </select>
                </div>

                {/* Search Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-2.5 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Room name..."
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Room Grid Display Card */}
            {loading ? (
              <div className="text-center py-16 text-slate-400 font-medium bg-white rounded-xl border border-slate-200 shadow-sm col-span-full">
                กำลังโหลดข้อมูลห้องประชุม...
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleRoomClick(room.id)}
                    className="group cursor-pointer overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs transition-all hover:shadow-md hover:border-slate-300 flex flex-col"
                  >
                    {/* Container รูปห้อง */}
                    <div className="relative overflow-hidden bg-slate-100 h-48 border-b border-slate-100 shrink-0 flex items-center justify-center">
                      {room.image ? (
                        <img
                          src={room.image}
                          alt={room.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ImageIcon size={36} className="text-slate-300" />
                      )}
                      <div className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs uppercase tracking-wide ${
                        room.status === "available" ? "bg-green-600" : room.status === "maintenance" ? "bg-yellow-600" : "bg-slate-500"
                      }`}>
                        {room.status === "available" ? "พร้อมใช้งาน" : room.status === "maintenance" ? "บำรุงรักษา" : "ปิดใช้งาน"}
                      </div>
                    </div>

                    {/* รายละเอียดเนื้อหาข้อมูลการจองห้อง */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="mb-2 text-xs font-semibold text-blue-600 uppercase tracking-wide">
                          {room.type}
                        </div>
                        <h3 className="mb-3 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {room.name}
                        </h3>

                        {/* รายละเอียดชั้นและความจุ */}
                        <div className="mb-4 space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={15} className="text-slate-400 shrink-0" />
                            <span className="font-medium">Floor {room.floor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={15} className="text-slate-400 shrink-0" />
                            <span className="font-medium">{room.capacity} People Capacity</span>
                          </div>
                        </div>

                        {/* อุปกรณ์อำนวยความสะดวก Amenities Icons */}
                        <div className="mb-5">
                          <div className="flex flex-wrap gap-1.5">
                            {room.amenities.slice(0, 3).map((amenity) => {
                              const lowerAmenity = amenity.toLowerCase();
                              return (
                                <div
                                  key={amenity}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 border border-transparent transition-colors hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                                  title={amenity}
                                >
                                  {amenityIcons[lowerAmenity] || <Zap size={14} />}
                                </div>
                              );
                            })}
                            {room.amenities.length > 3 && (
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-150 text-[10px] font-bold text-slate-500">
                                +{room.amenities.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ปุ่ม Action ท้ายการ์ดแต่ละใบ */}
                      <button className="w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-98 mt-auto shadow-2xs">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty Search Fallback State */}
            {filteredRooms.length === 0 && (
              <div className="py-16 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
                <p className="text-sm text-slate-400 font-medium">
                  No rooms found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}