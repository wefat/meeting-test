"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { useParams, useRouter } from "next/navigation";
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
  status: "confirmed" | "pending" | "cancelled";
}

const CreateEditBookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const bookingid = params?.bookingid as string;
  const isCreate = bookingid === "create";

  const today = new Date();

  // Safely get an initial date that isn't Sunday
  const getInitialDate = () => {
    const d = new Date();
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1); // Skip Sunday, default to Monday
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const initialDateStr = getInitialDate();
  const initialDateObj = new Date(initialDateStr);

  const [calendarYear, setCalendarYear] = useState<number>(initialDateObj.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(initialDateObj.getMonth()); // 0-indexed

  const [rooms, setRooms] = useState<any[]>([]);
  const [formData, setFormData] = useState<BookingForm>({
    bookingId: "",
    roomId: "",
    organizerName: "",
    title: "",
    department: "General",
    date: initialDateStr,
    timeStart: "",
    timeEnd: "",
    participantCount: 5,
    description: "",
    status: "confirmed",
  });

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const lastLoadedRef = useRef<{ roomId: string; date: string } | null>(null);
  const originalBookingRef = useRef<{ roomId: string; date: string; slots: string[] } | null>(null);

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const getSelectedDateInfo = () => {
    if (!formData.date) return { year: -1, month: -1, day: -1 };
    const parts = formData.date.split("-");
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10) - 1,
      day: parseInt(parts[2], 10)
    };
  };

  const selectedDateInfo = getSelectedDateInfo();

  // Helper to generate calendar days for the current calendar month and year dynamically
  const getCalendarDays = () => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay(); // Sunday=0, Monday=1...
    
    const days = [];
    
    // Add prev month trailing days (placeholders)
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Add next month leading days to complete week columns
    const remaining = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/admin/rooms`);
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
          if (data.length > 0 && isCreate) {
            setFormData(prev => ({ 
              ...prev, 
              roomId: data[0].id,
              date: initialDateStr
            }));
            lastLoadedRef.current = { roomId: data[0].id, date: initialDateStr };
          }
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, [isCreate, initialDateStr]);

  // Fetch Booking details if editing
  useEffect(() => {
    if (!isCreate && bookingid) {
      const fetchBooking = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const res = await fetch(`${apiUrl}/api/admin/bookings/${bookingid}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              bookingId: data.id,
              roomId: data.roomId,
              organizerName: data.organizer,
              title: data.title || "",
              department: "General",
              date: data.date,
              timeStart: data.timeStart,
              timeEnd: data.timeEnd,
              participantCount: data.participants,
              description: data.description || "",
              status: data.status as "confirmed" | "pending" | "cancelled",
            });
            const bDate = new Date(data.date);
            setCalendarYear(bDate.getFullYear());
            setCalendarMonth(bDate.getMonth());
            
            const allTimes = [
              "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
              "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
              "16:00", "16:30", "17:00", "17:30", "18:00"
            ];
            const slots = allTimes.filter(t => t >= data.timeStart && t < data.timeEnd);
            setSelectedSlots(slots);
            lastLoadedRef.current = { roomId: data.roomId, date: data.date };
            originalBookingRef.current = { roomId: data.roomId, date: data.date, slots: slots };
          }
        } catch (err) {
          console.error("Error fetching booking details:", err);
        }
      };
      fetchBooking();
    }
  }, [bookingid, isCreate]);

  // Reset selected slots when room or date is changed by user manually
  useEffect(() => {
    if (!lastLoadedRef.current) return;
    
    if (
      formData.roomId !== lastLoadedRef.current.roomId ||
      formData.date !== lastLoadedRef.current.date
    ) {
      // Check if we are switching back to the original booking room & date
      if (
        originalBookingRef.current &&
        formData.roomId === originalBookingRef.current.roomId &&
        formData.date === originalBookingRef.current.date
      ) {
        // Restore original slots
        setSelectedSlots(originalBookingRef.current.slots);
        
        // Restore start and end times in formData
        const slots = originalBookingRef.current.slots;
        if (slots.length > 0) {
          const allTimes = [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
            "16:00", "16:30", "17:00", "17:30", "18:00"
          ];
          const lastSlot = slots[slots.length - 1];
          const lastSlotIdx = allTimes.indexOf(lastSlot);
          let endTime = "";
          if (lastSlotIdx !== -1) {
            if (lastSlot === "18:00") {
              endTime = "18:30";
            } else {
              endTime = allTimes[lastSlotIdx + 1];
            }
          }
          setFormData(prev => ({
            ...prev,
            timeStart: slots[0],
            timeEnd: endTime
          }));
        } else {
          setFormData(prev => ({ ...prev, timeStart: "", timeEnd: "" }));
        }
      } else {
        // Otherwise, clear selection
        setSelectedSlots([]);
        setFormData(prev => ({ ...prev, timeStart: "", timeEnd: "" }));
      }
      
      lastLoadedRef.current = { roomId: formData.roomId, date: formData.date };
    }
  }, [formData.roomId, formData.date]);

  // Fetch Occupied Slots based on selected room and date
  useEffect(() => {
    if (!formData.roomId || !formData.date) return;
    
    const fetchOccupiedSlots = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/admin/bookings?roomId=${formData.roomId}&date=${formData.date}`);
        if (res.ok) {
          const data = await res.json();
          // Exclude the current editing booking and cancelled bookings
          const activeBookings = data.filter((b: any) => b.id.toLowerCase() !== bookingid.toLowerCase() && b.status !== "cancelled");
          
          const occupied: string[] = [];
          const allTimes = [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
            "16:00", "16:30", "17:00", "17:30", "18:00"
          ];
          
          for (const b of activeBookings) {
            for (const t of allTimes) {
              if (t >= b.timeStart && t < b.timeEnd) {
                if (!occupied.includes(t)) {
                  occupied.push(t);
                }
              }
            }
          }
          setOccupiedSlots(occupied);
        }
      } catch (err) {
        console.error("Error fetching occupied slots:", err);
      }
    };
    
    fetchOccupiedSlots();
  }, [formData.roomId, formData.date, bookingid]);

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 0) {
        setCalendarYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 11) {
        setCalendarYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleSlotClick = (time: string, isOccupied: boolean) => {
    if (isOccupied) return;

    setSelectedSlots((prevSlots) => {
      let updatedSlots;
      if (prevSlots.includes(time)) {
        updatedSlots = prevSlots.filter((slot) => slot !== time);
      } else {
        updatedSlots = [...prevSlots, time];
      }

      updatedSlots.sort();

      if (updatedSlots.length > 0) {
        const allTimes = [
          "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
          "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
          "16:00", "16:30", "17:00", "17:30", "18:00"
        ];
        const lastSlot = updatedSlots[updatedSlots.length - 1];
        const lastSlotIdx = allTimes.indexOf(lastSlot);
        let endTime = "";
        if (lastSlotIdx !== -1) {
          if (lastSlot === "18:00") {
            endTime = "18:30";
          } else {
            endTime = allTimes[lastSlotIdx + 1];
          }
        }

        setFormData((prev) => ({
          ...prev,
          timeStart: updatedSlots[0],
          timeEnd: endTime,
        }));
      } else {
        setFormData((prev) => ({ ...prev, timeStart: "", timeEnd: "" }));
      }

      return updatedSlots;
    });
  };

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    
    const dateObj = new Date(calendarYear, calendarMonth, day);
    if (dateObj.getDay() === 0) return; // Sunday cannot be selected
    
    const formattedMonth = String(calendarMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    setFormData((prev) => ({
      ...prev,
      date: `${calendarYear}-${formattedMonth}-${formattedDay}`
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId) {
      alert("กรุณาเลือกห้องประชุม");
      return;
    }
    if (!formData.timeStart || !formData.timeEnd) {
      alert("กรุณาเลือกช่วงเวลาการจอง");
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = isCreate 
        ? `${apiUrl}/api/admin/bookings` 
        : `${apiUrl}/api/admin/bookings/${bookingid}`;
      const method = isCreate ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: formData.roomId,
          organizer: formData.organizerName,
          title: formData.title,
          date: formData.date,
          timeStart: formData.timeStart,
          timeEnd: formData.timeEnd,
          participants: Number(formData.participantCount),
          status: formData.status, // already lowercase: confirmed, pending, cancelled
        }),
      });

      if (res.ok) {
        if (formData.organizerName && formData.organizerName !== "Admin User") {
          try {
            const userNotifs = JSON.parse(localStorage.getItem("userNotifications") || "[]");
            const roomName = rooms.find(r => r.id === formData.roomId)?.name || "Unknown Room";
            userNotifs.unshift({
              id: Date.now().toString(),
              targetUser: formData.organizerName,
              message: `แอดมินได้ทำการจองห้อง ${roomName} ให้คุณในวันที่ ${formData.date} (${formData.timeStart} - ${formData.timeEnd})`,
              read: false,
              createdAt: new Date().toISOString()
            });
            localStorage.setItem("userNotifications", JSON.stringify(userNotifs));
          } catch (err) {
            console.error("Failed to write user notification:", err);
          }
        }
        router.push("/admin/booking");
      } else {
        let errorMessage = "ไม่สามารถจองห้องประชุมได้";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const text = await res.text();
            console.error("Non-JSON error response:", text);
            errorMessage = `เซิร์ฟเวอร์ตอบกลับรหัส: ${res.status} (Server Error)`;
          }
        } catch (err) {
          console.error("Failed to parse error response:", err);
        }
        alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
      }
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  const baseSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];
  
  const timeSlots = baseSlots.map(time => ({
    time,
    isOccupied: occupiedSlots.includes(time)
  }));

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
        <form id="bookingForm" onSubmit={handleSubmit} className="px-8 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start flex-1">
          
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
                    {rooms.length === 0 ? (
                      <option value="">กำลังโหลดห้องประชุม...</option>
                    ) : (
                      rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} (ชั้น {room.floor})
                        </option>
                      ))
                    )}
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
                    <option value="confirmed">ยืนยันแล้ว</option>
                    <option value="pending">รอการยืนยัน</option>
                    <option value="cancelled">ยกเลิก</option>
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
                  <span>{thaiMonths[calendarMonth]} {calendarYear}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-white/20 rounded-md transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-white/20 rounded-md transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white grid grid-cols-7 gap-y-2 text-center text-xs font-medium">
                  {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                    <span key={d} className="text-slate-400 pb-1">{d}</span>
                  ))}
                  
                  {calendarDays.map((item, idx) => {
                    const isSelected = item.isCurrentMonth && 
                      selectedDateInfo.year === calendarYear && 
                      selectedDateInfo.month === calendarMonth && 
                      selectedDateInfo.day === item.day;
                    
                    let isSunday = false;
                    if (item.isCurrentMonth) {
                      const dateObj = new Date(calendarYear, calendarMonth, item.day);
                      isSunday = dateObj.getDay() === 0;
                    }
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!item.isCurrentMonth || isSunday}
                        onClick={() => handleDayClick(item.day, item.isCurrentMonth)}
                        className={`py-1.5 flex items-center justify-center rounded-lg transition-all ${
                          !item.isCurrentMonth 
                            ? "text-slate-300 cursor-not-allowed" 
                            : isSunday
                            ? "text-slate-300 bg-slate-50 cursor-not-allowed opacity-50"
                            : isSelected
                            ? "bg-[#0b57d0] text-white font-bold cursor-pointer shadow-xs"
                            : "text-slate-700 hover:bg-slate-100 cursor-pointer"
                        }`}
                      >
                        {item.day}
                      </button>
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
                  
                  let badgeClass = "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100/70";
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
            form="bookingForm"
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