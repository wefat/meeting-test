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
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const roomTypes = [
    "all",
    "ห้องประชุมใหญ่",
    "ห้องประชุมย่อย",
    "Creative Space",
    "Executive Boardroom",
    "Training Room",
    "Focus Room",
  ];
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

    if (filterType !== "all") {
      filtered = filtered.filter((room) => room.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((room) => room.status === filterStatus);
    }

    return filtered;
  }, [rooms, searchTerm, filterType, filterStatus]);

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
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-lg border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="ค้นหาห้องประชุม..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm text-slate-800 placeholder-gray-400"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer min-w-[160px]"
                  >
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "ประเภททั้งหมด" : type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer min-w-[140px]"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="available">พร้อมใช้งาน</option>
                    <option value="maintenance">บำรุงรักษา</option>
                    <option value="inactive">ปิดใช้งาน</option>
                  </select>
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
                    <div className="w-full h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center shrink-0 relative overflow-hidden">
                      {room.image ? (
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ImageIcon size={36} className="text-slate-300" />
                      )}
                    </div>

                    {/* รายละเอียดเนื้อหาข้อมูลการจองห้อง */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                              {room.name}
                            </h3>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">ID: {room.id}</p>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 shadow-2xs ${
                            room.status === "available" ? "bg-green-500 text-white" : room.status === "maintenance" ? "bg-yellow-500 text-white" : "bg-slate-500 text-white"
                          }`}>
                            {room.status === "available" ? "พร้อมใช้งาน" : room.status === "maintenance" ? "บำรุงรักษา" : "ปิดใช้งาน"}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4 text-sm text-slate-600">
                          <div className="flex justify-between border-b border-slate-50 pb-1.5">
                            <span className="text-gray-400">ประเภท:</span>
                            <span className="font-semibold text-slate-800">{room.type}</span>
                          </div>

                          <div className="flex justify-between border-b border-slate-50 pb-1.5">
                            <span className="text-gray-400">พิกัด/ที่ตั้ง:</span>
                            <span className="font-semibold text-slate-800">ชั้น {room.floor}</span>
                          </div>

                          <div className="flex justify-between pb-1.5">
                            <span className="text-gray-400">ความจุ:</span>
                            <span className="font-medium text-slate-800">{room.capacity} คน</span>
                          </div>
                        </div>

                        {/* อุปกรณ์อำนวยความสะดวก Amenities */}
                        <div className="mb-5">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            สิ่งอำนวยความสะดวก:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {room.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ปุ่ม Action ท้ายการ์ดแต่ละใบ */}
                      <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 mt-auto shadow-sm">
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