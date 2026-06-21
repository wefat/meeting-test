"use client";
import React, { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  CircleHelp, 
  Info, 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Save
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface BookingForm {
  bookingId: string;
  roomId: string;
  organizerName: string;
  title: string;
  department: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  participantCount: number;
  description: string;
  status: "Confirmed" | "Pending" | "Cancelled";
}

const CreateEditBookingPage = () => {
  const [formData, setFormData] = useState<BookingForm>({
    bookingId: "BK006",
    roomId: "Meeting Room A04",
    organizerName: "",
    title: "",
    department: "",
    date: "2024-10-07", // วันเริ่มต้นที่เลือกไว้
    timeStart: "10:00",
    timeEnd: "12:00",
    participantCount: 5,
    description: "",
    status: "Confirmed",
  });

  // State สำหรับเก็บวันในปฏิทินที่คลิกเลือกอยู่
  const [selectedDay, setSelectedDay] = useState<number>(7);

  // State สำหรับการเลือก Time Slots หลายๆ ช่องพร้อมกัน
  const [selectedSlots, setSelectedSlots] = useState<string[]>([
    "10:00", "10:30", "11:00", "11:35" // ค่า Default ตามภาพ Your Selection
  ]);

  // ลิสต์รายการสล็อตเวลาทั้งหมด และกำหนดฟิกซ์สถานะไม่ว่าง (Occupied) ไว้บางช่องเพื่อจำลองข้อมูล
  const timeSlots = [
    { time: "08:00", isOccupied: true },
    { time: "08:30", isOccupied: true },
    { time: "09:00", isOccupied: true },
    { time: "09:30", isOccupied: true },
    { time: "10:00", isOccupied: false },
    { time: "10:30", isOccupied: false },
    { time: "11:00", isOccupied: false },
    { time: "11:30", isOccupied: false },
    { time: "12:00", isOccupied: false },
    { time: "12:30", isOccupied: false },
    { time: "13:00", isOccupied: false },
    { time: "13:30", isOccupied: false },
    { time: "14:00", isOccupied: false },
    { time: "14:30", isOccupied: false },
    { time: "15:00", isOccupied: false },
    { time: "15:30", isOccupied: false },
    { time: "16:00", isOccupied: false },
    { time: "16:30", isOccupied: false },
    { time: "17:00", isOccupied: false },
    { time: "17:30", isOccupied: false },
    { time: "18:00", isOccupied: false },
  ];

  // จำลองรายการวันที่ในปฏิทินของเดือน ตุลาคม 2024
  const calendarDays = [
    { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true }, { day: 2, isCurrentMonth: true }, { day: 3, isCurrentMonth: true }, { day: 4, isCurrentMonth: true }, { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true }, { day: 7, isCurrentMonth: true }, { day: 8, isCurrentMonth: true }, { day: 9, isCurrentMonth: true }, { day: 10, isCurrentMonth: true }, { day: 11, isCurrentMonth: true }, { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true }, { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true }, { day: 16, isCurrentMonth: true }, { day: 17, isCurrentMonth: true }, { day: 18, isCurrentMonth: true }, { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true }, { day: 23, isCurrentMonth: true }, { day: 24, isCurrentMonth: true }, { day: 25, isCurrentMonth: true }, { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true }, { day: 28, isCurrentMonth: true }, { day: 29, isCurrentMonth: true }, { day: 30, isCurrentMonth: true }, { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false }, { day: 2, isCurrentMonth: false }
  ];

  // ฟังก์ชันการจัดการเมื่อกดเลือกเวลา (Time Slot)
  const handleSlotClick = (time: string, isOccupied: boolean) => {
    if (isOccupied) return; // ถ้าห้องไม่ว่าง จะกดเลือกไม่ได้

    setSelectedSlots((prevSlots) => {
      let updatedSlots;
      if (prevSlots.includes(time)) {
        // หากเคยกดเลือกไว้แล้ว -> ให้เอาออก
        updatedSlots = prevSlots.filter((slot) => slot !== time);
      } else {
        // หากยังไม่ได้เลือก -> ให้เพิ่มลงลิสต์
        updatedSlots = [...prevSlots, time];
      }

      // เรียงลำดับเวลาจากน้อยไปมาก เพื่อหาจุดเริ่มต้นและจุดสิ้นสุดของ Booking ตัวนั้นๆ
      updatedSlots.sort();

      if (updatedSlots.length > 0) {
        setFormData((prev) => ({
          ...prev,
          timeStart: updatedSlots[0],
          timeEnd: updatedSlots[updatedSlots.length - 1],
        }));
      } else {
        setFormData((prev) => ({ ...prev, timeStart: "", timeEnd: "" }));
      }

      return updatedSlots;
    });
  };

  // ฟังก์ชันเปลี่ยนวันที่เมื่อกดบนปฏิทิน
  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return; // ล็อกให้กดเลือกได้เฉพาะวันในเดือนปัจจุบัน
    setSelectedDay(day);
    
    // แปลง Format เป็น YYYY-MM-DD ลงใน formData
    const formattedDay = day < 10 ? `0${day}` : day;
    setFormData((prev) => ({
      ...prev,
      date: `2024-10-${formattedDay}`
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Booking Data:", { ...formData, selectedSlots });
  };

  return (
    <div className="flex bg-[#f4f6fa] min-h-screen font-sans antialiased text-slate-800">
      <AdminSidebar />

      <div className="flex-1 ml-0 md:ml-64 min-w-0 transition-all duration-300 ">
        
        {/* Topbar Header */}
        <header className="bg-transparent px-8 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/booking"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} className="stroke-[2.5]" />
            </Link>
            <h1 className="text-xl font-bold text-[#0f2963]">
              เพิ่ม/แก้ไขการจองห้องประชุม
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#e8ecf4] px-3 py-2 rounded-xl w-60 border border-slate-200/50">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-xs w-full text-slate-700 placeholder-slate-400"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-200/60 rounded-lg transition-colors">
              <Bell size={18} />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-200/60 rounded-lg transition-colors">
              <CircleHelp size={18} />
            </button>
          </div>
        </header>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="px-8 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start flex-1">
          
          {/* ฝั่งซ้าย (กว้าง 3 ใน 5 ส่วน) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* ข้อมูลการจอง (Booking Information) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center gap-2.5 text-[#0f2963] font-bold text-base mb-6 border-b border-slate-100 pb-3">
                <Info size={18} className="text-blue-600 fill-blue-100" />
                <h2>ข้อมูลการจอง (Booking Information)</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    ห้องประชุม (Room Selection)
                  </label>
                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Meeting Room A04">Meeting Room A04</option>
                    <option value="Andaman Suite">Andaman Suite</option>
                    <option value="Similan Room">Similan Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    ผู้จอง (User Selection)
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white focus-within:border-blue-500 transition-all">
                    <input
                      type="text"
                      name="organizerName"
                      placeholder="ค้นหาหรือเลือกผู้จอง..."
                      value={formData.organizerName}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
                    />
                    <Search size={16} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    หัวข้อการประชุม (Topic)
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="ระบุหัวข้อการประชุม"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    แผนกที่รับผิดชอบ
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="">เลือกแผนก</option>
                    <option value="Sales">ฝ่ายขาย (Sales)</option>
                    <option value="Marketing">ฝ่ายการตลาด (Marketing)</option>
                    <option value="IT">ฝ่ายไอที (IT Support)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* รายละเอียดเพิ่มเติม (Participants & Details) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center gap-2.5 text-[#0f2963] font-bold text-base mb-6 border-b border-slate-100 pb-3">
                <Users size={18} className="text-blue-600" />
                <h2>รายละเอียดเพิ่มเติม (Participants & Details)</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    จำนวนผู้เข้าร่วม
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white">
                    <input
                      type="number"
                      name="participantCount"
                      value={formData.participantCount}
                      onChange={handleInputChange}
                      className="w-full text-sm bg-transparent outline-none text-slate-700 font-medium"
                    />
                    <span className="text-xs font-semibold text-slate-400 shrink-0">คน</span>
                  </div>
                  <span className="text-[11px] font-medium text-blue-500 mt-1 block">ความจุห้องสูงสุด 12 คน</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    สถานะการจอง
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-blue-50/50 text-blue-800 font-semibold focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  รายละเอียดการประชุม
                </label>
                <textarea
                  name="description"
                  placeholder="ระบุรายละเอียดเพิ่มเติม..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>

          </div>

          {/* ฝั่งขวา - ห้องและเวลา (Room & Schedule) - แก้ไขเพิ่ม Action คลิกเลือกได้ */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-[#0f2963] font-bold text-base border-b border-slate-100 pb-3">
              <Calendar size={18} className="text-blue-600" />
              <h2>ห้องและเวลา (Room & Schedule)</h2>
            </div>

            {/* ปฏิทินเลือกวัน */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">
                วันที่จอง (Date)
              </label>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-[#0b57d0] text-white px-4 py-2.5 flex justify-between items-center text-sm font-semibold">
                  <span>ตุลาคม 2024</span>
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-1 hover:bg-white/20 rounded-md transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button type="button" className="p-1 hover:bg-white/20 rounded-md transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white grid grid-cols-7 gap-y-2 text-center text-xs font-medium">
                  {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                    <span key={d} className="text-slate-400 pb-1">{d}</span>
                  ))}
                  
                  {calendarDays.map((item, idx) => {
                    const isSelected = item.isCurrentMonth && selectedDay === item.day;
                    
                    return (
                      <span
                        key={idx}
                        onClick={() => handleDayClick(item.day, item.isCurrentMonth)}
                        className={`py-1.5 flex items-center justify-center rounded-lg transition-all ${
                          !item.isCurrentMonth 
                            ? "text-slate-300 cursor-not-allowed" 
                            : isSelected
                            ? "bg-[#0b57d0] text-white font-bold cursor-pointer shadow-xs"
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

            {/* ช่วงเวลา (Time Slots) - คลิกเลือกได้ */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-3">
                ช่วงเวลา (Time Slots)
              </label>

              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot, index) => {
                  const isUserSelected = selectedSlots.includes(slot.time);
                  
                  let badgeClass = "bg-green-50 text-green-700 border border-green-150 hover:bg-green-100/70";
                  if (slot.isOccupied) {
                    badgeClass = "bg-red-50 text-red-400 border border-red-100/50 line-through opacity-60 cursor-not-allowed";
                  } else if (isUserSelected) {
                    badgeClass = "bg-[#0b57d0] text-white border border-[#0b57d0] font-semibold shadow-xs";
                  }

                  return (
                    <div
                      key={index}
                      onClick={() => handleSlotClick(slot.time, slot.isOccupied)}
                      className={`py-2 text-center text-[11px] rounded-md transition-all select-none cursor-pointer ${badgeClass}`}
                    >
                      {slot.time}
                    </div>
                  );
                })}
              </div>

              {/* คำอธิบายสัญลักษณ์สี */}
              <div className="flex items-center gap-4 mt-4 text-[11px] font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-green-50 border border-green-200 inline-block"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-50 border border-red-200 inline-block"></span>
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#0b57d0] inline-block"></span>
                  <span>Your Selection</span>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Bottom Action Footer Bar */}
        <div className="absolute bottom-0 right-0 left-64 bg-white border-t border-slate-200 px-8 py-4 flex justify-end items-center gap-3 shadow-lg z-20">
          <Link
            href="/admin/booking"
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 bg-white text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-[#0b57d0] text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
          >
            <Save size={14} />
            <span>บันทึกการจอง</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateEditBookingPage;