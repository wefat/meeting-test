"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  ChevronRight,
  Wifi,
  Monitor,
  Wind,
  Coffee,
  Zap,
} from "lucide-react";
import SidebarNav from "@/components/layout/NavbarUser";

interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  pricePerHour: number;
  image: string;
  description: string;
  amenities: string[];
}

const mockRooms: Record<string, Room> = {
  "1": {
    id: "1",
    name: "Skyline Boardroom",
    floor: 12,
    capacity: 12,
    pricePerHour: 1500,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    description:
      "Premium boardroom with stunning city views. Perfect for executive meetings and presentations.",
    amenities: ["wifi", "projector", "ac"],
  },
  "2": {
    id: "2",
    name: "Creative Hub",
    floor: 8,
    capacity: 8,
    pricePerHour: 800,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    description:
      "Collaborative space designed for creative teams and brainstorming sessions.",
    amenities: ["wifi", "whiteboard", "ac"],
  },
  "3": {
    id: "3",
    name: "Grand Hall",
    floor: 5,
    capacity: 50,
    pricePerHour: 3500,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    description:
      "Large-scale event space with professional setup. Ideal for conferences and major meetings.",
    amenities: ["wifi", "projector", "ac", "catering"],
  },
  "4": {
    id: "4",
    name: "Focus Pod 04",
    floor: 2,
    capacity: 2,
    pricePerHour: 300,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    description:
      "Private quiet space perfect for one-on-one meetings or focused work.",
    amenities: ["wifi", "ac"],
  },
  "5": {
    id: "5",
    name: "North Wing B",
    floor: 3,
    capacity: 6,
    pricePerHour: 600,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    description:
      "Modern meeting room with advanced technology and comfortable seating.",
    amenities: ["wifi", "projector"],
  },
  "6": {
    id: "6",
    name: "Summit Suite",
    floor: 15,
    capacity: 15,
    pricePerHour: 2000,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    description:
      "Executive suite with premium amenities and dedicated support staff.",
    amenities: ["wifi", "projector", "ac", "coffee"],
  },
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  projector: <Monitor size={14} />,
  ac: <Wind size={14} />,
  catering: <Coffee size={14} />,
  whiteboard: <Zap size={14} />,
  coffee: <Coffee size={14} />,
};

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId as string;
  const room = mockRooms[roomId];

  const [date, setDate] = useState("2025-10-07");
  const [participants, setParticipants] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedDay, setSelectedDay] = useState<number>(7);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([
    "10:00",
    "10:30",
    "11:00",
  ]);

  const timeSlotsData = [
    { time: "08:00", status: "occupied" },
    { time: "08:30", status: "occupied" },
    { time: "09:00", status: "occupied" },
    { time: "09:30", status: "occupied" },
    { time: "10:00", status: "clear" },
    { time: "10:30", status: "clear" },
    { time: "11:00", status: "clear" },
    { time: "11:30", status: "clear" },
    { time: "12:00", status: "clear" },
    { time: "12:30", status: "clear" },
    { time: "13:00", status: "clear" },
    { time: "13:30", status: "clear" },
    { time: "14:00", status: "clear" },
    { time: "14:30", status: "clear" },
    { time: "15:00", status: "clear" },
    { time: "15:30", status: "clear" },
    { time: "16:00", status: "clear" },
    { time: "16:30", status: "clear" },
    { time: "17:00", status: "clear" },
    { time: "17:30", status: "clear" },
    { time: "18:00", status: "clear" },
  ];

  const calendarDays = [
    { day: 29, isCurrent: false },
    { day: 30, isCurrent: false },
    { day: 1, isCurrent: true },
    { day: 2, isCurrent: true },
    { day: 3, isCurrent: true },
    { day: 4, isCurrent: true },
    { day: 5, isCurrent: true },
    { day: 6, isCurrent: true },
    { day: 7, isCurrent: true },
    { day: 8, isCurrent: true },
    { day: 9, isCurrent: true },
    { day: 10, isCurrent: true },
    { day: 11, isCurrent: true },
    { day: 12, isCurrent: true },
    { day: 13, isCurrent: true },
    { day: 14, isCurrent: true },
    { day: 15, isCurrent: true },
    { day: 16, isCurrent: true },
    { day: 17, isCurrent: true },
    { day: 18, isCurrent: true },
    { day: 19, isCurrent: true },
    { day: 20, isCurrent: true },
    { day: 21, isCurrent: true },
    { day: 22, isCurrent: true },
    { day: 23, isCurrent: true },
    { day: 24, isCurrent: true },
    { day: 25, isCurrent: true },
    { day: 26, isCurrent: true },
    { day: 27, isCurrent: true },
    { day: 28, isCurrent: true },
    { day: 29, isCurrent: true },
    { day: 30, isCurrent: true },
    { day: 31, isCurrent: true },
    { day: 1, isCurrent: false },
    { day: 2, isCurrent: false },
  ];

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-600 font-medium">Room not found</p>
      </div>
    );
  }

  const handleSlotClick = (time: string, isOccupied: boolean) => {
    if (isOccupied) return;
    setSelectedSlots((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time].sort(),
    );
  };

  const handleDayClick = (day: number, isCurrent: boolean) => {
    if (!isCurrent) return;
    setSelectedDay(day);
    const formattedDay = day < 10 ? `0${day}` : day;
    setDate(`2024-10-${formattedDay}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlots.length === 0) {
      alert("กรุณาเลือกช่วงเวลาที่ต้องการจอง");
      return;
    }
    alert(
      `Booking confirmed for ${room.name} on ${date}\nSelected Slots: ${selectedSlots.join(", ")}`,
    );
    router.push("/user/rooms/room-list");
  };

  return (
    <div className="flex bg-[#f4f6fa] min-h-screen font-sans antialiased text-slate-800">
      <SidebarNav sidebarOpen={sidebarOpen} />

      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="pl-16 pr-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex w-fit items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all active:scale-95"
            >
              <ChevronLeft size={18} className="stroke-[2.5]" />
              <span>Back</span>
            </button>
          </div>
        </header>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Book {room.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 font-medium">
                Complete all details to confirm your reservation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── แถวที่ 1: แบ่งพื้นที่ 2 การ์ด (พรีวิวห้อง & ปฏิทิน) ให้มีความสูงเท่ากันเสมอกัน ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* 1.1 การ์ดแสดงรายละเอียดและรูปภาพของห้องประชุม */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
                  <div className="h-44 w-full relative bg-slate-100 shrink-0">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
                      Floor {room.floor}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 text-base">
                        {room.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {room.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-slate-400" />
                          <span>สูงสุด {room.capacity} คน</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          <span>ชั้น {room.floor}</span>
                        </div>
                      </div>

                      {/* สิ่งอำนวยความสะดวกย่อย */}
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold capitalize"
                          >
                            {amenityIcons[amenity]}
                            <span>{amenity}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.2 การ์ดปฏิทินเลือกวัน (ตัดสล็อตเวลาออกตามสั่ง) */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#0f2963] font-bold text-sm border-b border-slate-100 pb-2 mb-3">
                      <Calendar size={16} className="text-blue-600" />
                      <h2>ปฏิทินระบุวัน (Room & Schedule)</h2>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <div className="bg-[#0b57d0] text-white px-3 py-2 flex justify-between items-center text-xs font-semibold">
                        <span>ตุลาคม 2024</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="p-0.5 hover:bg-white/20 rounded transition-colors"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button
                            type="button"
                            className="p-0.5 hover:bg-white/20 rounded transition-colors"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="p-2.5 grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold">
                        {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                          <span key={d} className="text-slate-400 pb-1">
                            {d}
                          </span>
                        ))}
                        {calendarDays.map((item, idx) => {
                          const isSelected =
                            item.isCurrent && selectedDay === item.day;
                          return (
                            <span
                              key={idx}
                              onClick={() =>
                                handleDayClick(item.day, item.isCurrent)
                              }
                              className={`py-1 flex items-center justify-center rounded-md transition-all text-xs ${
                                !item.isCurrent
                                  ? "text-slate-300 cursor-not-allowed"
                                  : isSelected
                                    ? "bg-[#0b57d0] text-white font-bold cursor-pointer shadow-2xs"
                                    : "text-slate-700 hover:bg-slate-100 cursor-pointer"
                              }`}
                            >
                              {item.day}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* แสดงวันที่กำลังเลือกอยู่ ณ ปัจจุบัน */}
                  <div className="text-[11px] bg-slate-50 border border-slate-150 rounded-lg p-2 flex items-center gap-2 text-slate-500 font-semibold mt-3 md:mt-0">
                    <Clock size={14} className="text-slate-400" />
                    <span>Selected Date: {date}</span>
                  </div>
                </div>
              </div>

              {/* ── แถวที่ 2: ฟอร์มรายละเอียดข้อมูลการประชุม (ขยายกว้างเต็มพื้นที่) ── */}
              <div className="space-y-4 rounded-2xl bg-white p-6 border border-slate-200 shadow-xs w-full">
                <div className="flex items-center gap-2 text-[#0f2963] font-bold text-base border-b border-slate-100 pb-3">
                  <Clock size={18} className="text-blue-600" />
                  <h2>ช่วงเวลา (Time Slots)</h2>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
                  {timeSlotsData.map((slot, index) => {
                    const isUserSelected = selectedSlots.includes(slot.time);
                    let styleClass =
                      "bg-green-50 text-green-700 border border-green-150 hover:bg-green-100/70";

                    if (slot.status === "occupied") {
                      styleClass =
                        "bg-red-50 text-red-400 border border-red-100/50 line-through opacity-60 cursor-not-allowed";
                    } else if (isUserSelected) {
                      styleClass =
                        "bg-[#0b57d0] text-white border border-[#0b57d0] font-semibold shadow-xs";
                    }

                    return (
                      <div
                        key={index}
                        onClick={() =>
                          handleSlotClick(slot.time, slot.status === "occupied")
                        }
                        className={`py-2.5 text-center text-xs rounded-lg transition-all select-none cursor-pointer ${styleClass}`}
                      >
                        {slot.time}
                      </div>
                    );
                  })}
                </div>

                {/* แถบคำอธิบายสัญลักษณ์สี */}
                <div className="flex flex-wrap items-center gap-5 text-[11px] font-bold text-slate-500 border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-green-50 border border-green-200 inline-block"></span>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-red-50 border border-red-200 inline-block"></span>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-[#0b57d0] inline-block"></span>
                    <span>Your Selection</span>
                  </div>
                </div>

                {/* แถบแจ้งเตือนข้อมูล */}
                <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 text-xs text-blue-900 leading-relaxed font-medium">
                  <p className="font-bold mb-1 flex items-center gap-1.5 text-blue-950">
                    <AlertCircle size={14} className="text-blue-600" />
                    <span>ข้อมูลระเบียบองค์กร</span>
                  </p>
                  <p>
                    ห้องประชุมนี้เปิดสำหรับใช้งานภายในองค์กร
                    ไม่มีการเรียกเก็บค่าใช้จ่ายใด ๆ
                    เพิ่มเติมหลังเสร็จสิ้นกระบวนการยืนยัน
                  </p>
                </div>
              </div>

              {/* ── แถวที่ 3: ตารางเลือกช่วงเวลา (Time Slots) และปุ่มคอนเฟิร์ม (ขยายกว้างเต็มพื้นที่) ── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 w-full">
                <h2 className="flex items-center gap-2 text-base font-bold text-[#0f2963] border-b border-slate-100 pb-3 tracking-wide">
                  <Users size={18} className="text-blue-600" />
                  <span>Meeting Details</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Meeting Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Q4 Planning Session"
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Number of Participants{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={participants}
                      onChange={(e) => setParticipants(e.target.value)}
                      placeholder="e.g., 8"
                      min="1"
                      max={room.capacity}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      required
                    />
                    <p className="mt-1 text-[11px] font-medium text-slate-400">
                      Max capacity for this room is {room.capacity} people.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any special requests or notes..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* ปุ่ม Action ควบคุมการส่งข้อมูลหลักยึดเต็มพื้นที่ท้ายสุด */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={
                      !title || !participants || selectedSlots.length === 0
                    }
                    className="w-full sm:flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-98 shadow-sm shadow-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-48 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 bg-white transition-all hover:bg-slate-50 active:scale-98"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
