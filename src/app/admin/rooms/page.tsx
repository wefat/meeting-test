"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  type: string;
  amenities: string[];
  status: "available" | "maintenance" | "inactive";
  bookings: number;
  image?: string;
}

const mockRooms: Room[] = [
  {
    id: "RM001",
    name: "Andaman Suite",
    floor: 12,
    capacity: 50,
    type: "ห้องประชุมใหญ่",
    amenities: ["WiFi", "Projector", "AC"],
    status: "available",
    bookings: 24,
  },
  {
    id: "RM002",
    name: "Similan Room",
    floor: 12,
    capacity: 12,
    type: "ห้องประชุมย่อย",
    amenities: ["WiFi", "TV"],
    status: "available",
    bookings: 18,
  },
  {
    id: "RM003",
    name: "Lanna Hub",
    floor: 10,
    capacity: 30,
    type: "Creative Space",
    amenities: ["WiFi", "Whiteboard", "AC"],
    status: "available",
    bookings: 15,
  },
  {
    id: "RM004",
    name: "Chao Phraya Boardroom",
    floor: 9,
    capacity: 20,
    type: "Executive Boardroom",
    amenities: ["WiFi", "Projector", "AC", "Coffee Station"],
    status: "maintenance",
    bookings: 12,
  },
  {
    id: "RM005",
    name: "Phuket Lab",
    floor: 8,
    capacity: 40,
    type: "Training Room",
    amenities: ["WiFi", "Computer", "AC"],
    status: "available",
    bookings: 20,
  },
  {
    id: "RM006",
    name: "Tao Meeting Pod",
    floor: 11,
    capacity: 8,
    type: "Focus Room",
    amenities: ["WiFi", "Whiteboard"],
    status: "inactive",
    bookings: 5,
  },
];

const getStatusBadge = (status: string) => {
  const badges: { [key: string]: string } = {
    available: "bg-green-100 text-green-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  const labels: { [key: string]: string } = {
    available: "พร้อมใช้งาน",
    maintenance: "บำรุงรักษา",
    inactive: "ปิดใช้งาน",
  };
  return { badge: badges[status], label: labels[status] };
};

const RoomManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const roomTypes = [
    "all",
    "ห้องประชุมใหญ่",
    "ห้องประชุมย่อย",
    "Creative Space",
    "Executive Boardroom",
    "Training Room",
    "Focus Room",
  ];

  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    const matchesStatus =
      filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      {/* Sidebar คงที่ด้านซ้าย */}
      <AdminSidebar />

      {/* Main Content Container: จัดขนาดหลบแนว Sidebar และปรับ Margin/Padding ขอบซ้ายขวา */}
      <div className="flex-1 ml-0 md:ml-64 min-w-0 transition-all duration-300 p-5">
        <div className="w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                จัดการห้องประชุม
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                จำนวนห้องทั้งหมด: <span className="font-semibold text-slate-700">{filteredRooms.length}</span> ห้อง
              </p>
            </div>
            <a
              href="/admin/rooms/create"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm shrink-0"
            >
              <Plus size={16} />
              <span>เพิ่มห้องใหม่</span>
            </a>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-lg border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="ค้นหาห้องประชุม..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent outline-none w-full text-sm text-slate-800 placeholder-gray-400"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
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

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedRooms.map((room) => {
              const { badge, label } = getStatusBadge(room.status);
              return (
                <div
                  key={room.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300/70 transition-all flex flex-col"
                >
                  {/* Room Image */}
                  <div className="w-full h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center shrink-0">
                    <ImageIcon size={36} className="text-slate-300" />
                  </div>

                  {/* Room Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-snug">{room.name}</h3>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">ID: {room.id}</p>
                        </div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shrink-0 ${badge}`}>
                          {label}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm text-slate-600">
                        <div className="flex justify-between border-b border-slate-50 pb-1.5">
                          <span className="text-gray-400">ประเภท:</span>
                          <span className="font-semibold text-slate-800">{room.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-1.5">
                          <span className="text-gray-400">ชั้น:</span>
                          <span className="font-medium text-slate-800">ชั้น {room.floor}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-1.5">
                          <span className="text-gray-400">ความจุ:</span>
                          <span className="font-medium text-slate-800">{room.capacity} คน</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-gray-400">การจองทั้งหมด:</span>
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                            {room.bookings} ครั้ง
                          </span>
                        </div>
                      </div>

                      {/* Amenities */}
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

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all active:scale-95 shadow-2xs">
                        <Eye size={14} />
                        <span>ดู</span>
                      </button>
                      <a
                        href={`/admin/rooms/${room.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
                      >
                        <Edit size={14} />
                        <span>แก้ไข</span>
                      </a>
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-semibold transition-all active:scale-95 shadow-2xs">
                        <Trash2 size={14} />
                        <span>ลบ</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {paginatedRooms.length === 0 && (
            <div className="text-center py-16 text-slate-400 font-medium bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
              ไม่พบข้อมูลห้องประชุมที่ต้องการค้นหา
            </div>
          )}

          {/* Pagination */}
          {filteredRooms.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pb-8">
              <div className="text-sm text-gray-500 font-medium order-2 sm:order-1">
                แสดง <span className="text-slate-800 font-semibold">{startIndex + 1}</span> ถึง{" "}
                <span className="text-slate-800 font-semibold">
                  {Math.min(startIndex + itemsPerPage, filteredRooms.length)}
                </span> จาก{" "}
                <span className="text-slate-800 font-semibold">{filteredRooms.length}</span> ห้อง
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagementPage;