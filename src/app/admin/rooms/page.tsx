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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              จัดการห้องประชุม
            </h1>
            <p className="text-gray-500 mt-1">
              จำนวนห้องทั้งหมด: {filteredRooms.length} ห้อง
            </p>
          </div>
          <a
            href="/admin/rooms/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">เพิ่มห้องใหม่</span>
          </a>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาห้องประชุม..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="available">พร้อมใช้งาน</option>
              <option value="maintenance">บำรุงรักษา</option>
              <option value="inactive">ปิดใช้งาน</option>
            </select>
          </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {paginatedRooms.map((room) => {
            const { badge, label } = getStatusBadge(room.status);
            return (
              <div
                key={room.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                {/* Room Image */}
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>

                {/* Room Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{room.name}</h3>
                      <p className="text-xs text-gray-500">ID: {room.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge}`}>
                      {label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>ประเภท:</span>
                      <span className="font-medium">{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ชั้น:</span>
                      <span className="font-medium">ชั้น {room.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ความจุ:</span>
                      <span className="font-medium">{room.capacity} คน</span>
                    </div>
                    <div className="flex justify-between">
                      <span>การจอง:</span>
                      <span className="font-medium text-blue-600">
                        {room.bookings} ครั้ง
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      สิ่งอำนวยความสะดวก:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                      <Eye size={16} />
                      ดู
                    </button>
                    <a
                      href={`/admin/rooms/${room.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <Edit size={16} />
                      แก้ไข
                    </a>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm">
                      <Trash2 size={16} />
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {paginatedRooms.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            ไม่พบข้อมูลห้องประชุม
          </div>
        )}

        {/* Pagination */}
        {filteredRooms.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              แสดง {startIndex + 1} ถึง{" "}
              {Math.min(startIndex + itemsPerPage, filteredRooms.length)} จาก{" "}
              {filteredRooms.length} ห้อง
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
        )}
      </div>
    </div>
  );
};

export default RoomManagementPage;
