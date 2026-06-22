"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  FileText,
  Wifi,
  Monitor,
  Coffee,
  Zap,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import SidebarNav from "@/components/layout/NavbarUser";

interface BookingDetail {
  id: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  floor: number;
  building: string;
  capacityDescription: string;
  title: string;
  organizerName: string;
  organizerRole: string;
  description: string;
  tags: string[];
  dateLabel: string;
  timeStart: string;
  timeEnd: string;
  durationLabel: string;
  status: "confirmed" | "pending" | "cancelled" | "upcoming" | "history";
  statusLabel: string;
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  "High-speed Wi-Fi (6E)": <Wifi size={16} />,
  "4K Video Conferencing System": <Monitor size={16} />,
  "85\" Interactive Display": <Monitor size={16} />,
  "Free Coffee & Refreshments": <Coffee size={16} />,
};

// ฟังก์ชันแปลงเดือนเป็นภาษาไทย
function getThaiDateLabel(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10) + 543; // แปลง ค.ศ. เป็น พ.ศ.
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const thaiMonths = [
    "", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  return `${day} ${thaiMonths[month]} ${year}`;
}

// คำนวณระยะเวลา
function getDurationLabel(start: string, end: string) {
  if (!start || !end) return "";
  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);
  
  let diffMins = (eH * 60 + eM) - (sH * 60 + sM);
  if (diffMins <= 0) return "ไม่ระบุ";
  
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hrs > 0 && mins > 0) return `${hrs} ชั่วโมง ${mins} นาที`;
  if (hrs > 0) return `${hrs} ชั่วโมง`;
  return `${mins} นาที`;
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.bookingid as string;
  
  const [data, setData] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // 1. Fetch Booking
        const bookingRes = await fetch(`${apiUrl}/api/admin/bookings/${bookingId}`);
        if (!bookingRes.ok) {
          throw new Error("Booking not found");
        }
        const bookingData = await bookingRes.json();
        
        // 2. Fetch Room
        let roomData = null;
        if (bookingData.roomId) {
          const roomRes = await fetch(`${apiUrl}/api/admin/rooms/${bookingData.roomId}`);
          if (roomRes.ok) {
            roomData = await roomRes.json();
          }
        }

        // Map status
        let currentStatus = bookingData.status || "upcoming";
        let label = "กำลังจะมาถึง";
        
        if (currentStatus === "cancelled") {
          label = "ยกเลิกแล้ว";
        } else if (currentStatus === "history") {
          label = "เสร็จสิ้น";
        } else if (currentStatus === "confirmed") {
          label = "ยืนยันแล้ว";
        } else if (currentStatus === "pending") {
          label = "รอการยืนยัน";
        } else {
          // Check date if it's upcoming
          const today = new Date().toISOString().split("T")[0];
          if (bookingData.date < today && currentStatus !== "cancelled") {
            currentStatus = "history";
            label = "เสร็จสิ้น";
          }
        }

        // Map to standard detail structure
        const detail: BookingDetail = {
          id: bookingData.id,
          roomId: bookingData.roomId,
          roomName: roomData?.name || bookingData.roomName || "ไม่ทราบชื่อห้อง",
          roomImage: roomData?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop",
          floor: roomData?.location ? parseInt(roomData.location.replace(/\D/g, "")) || 1 : 1,
          building: "อาคารหลัก",
          capacityDescription: `รองรับ ${roomData?.capacity || bookingData.participants || 10} ท่าน`,
          title: bookingData.title,
          organizerName: bookingData.organizer || "ไม่ระบุ",
          organizerRole: bookingData.department || "General",
          description: bookingData.description || "ไม่มีคำอธิบายเพิ่มเติม",
          tags: [bookingData.department || "General"],
          dateLabel: getThaiDateLabel(bookingData.date),
          timeStart: bookingData.timeStart,
          timeEnd: bookingData.timeEnd,
          durationLabel: getDurationLabel(bookingData.timeStart, bookingData.timeEnd),
          status: currentStatus,
          statusLabel: label,
          amenities: roomData?.facilities || ["High-speed Wi-Fi (6E)", "4K Video Conferencing System"],
        };

        setData(detail);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const handleEditBooking = () => {
    alert("ระบบแก้ไขการจองโดย User อยู่ระหว่างการพัฒนา หากต้องการเปลี่ยนแปลงข้อมูลด่วน กรุณาติดต่อ Admin");
  };

  const handleCancelBooking = async () => {
    if (!data) return;
    if (data.status === "cancelled") {
      alert("การจองนี้ถูกยกเลิกไปแล้ว");
      return;
    }

    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/admin/bookings/${data.id}`, {
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
        setData({ ...data, status: "cancelled", statusLabel: "ยกเลิกแล้ว" });
      } else {
        alert("ไม่สามารถยกเลิกการจองได้");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
    }
  };

  if (loading) {
    return <div className="flex bg-[#f4f6fa] min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="flex bg-[#f4f6fa] min-h-screen">
        <SidebarNav sidebarOpen={sidebarOpen} />
        <div className="flex-1 ml-0 md:ml-64 flex flex-col items-center justify-center p-8">
          <div className="text-center text-slate-500">
            <XCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold mb-2 text-slate-700">ไม่พบข้อมูลการจอง</h2>
            <p>อาจถูกลบไปแล้วหรือรหัสการจองไม่ถูกต้อง</p>
            <button 
              onClick={() => router.back()}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-all font-semibold"
            >
              กลับไปหน้าก่อนหน้า
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = data.status === "cancelled";

  return (
    <div className="flex bg-[#f4f6fa] min-h-screen font-sans antialiased text-slate-800">
      {/* ส่วนควบคุม Sidebar นำเข้าและใช้งานตัวแปรระบบเดิม */}
      <SidebarNav sidebarOpen={sidebarOpen} />

      {/* Main Content Area - ปรับความกว้างหลบแถบข้าง md:ml-64 บนคอม และเต็มจอเต็มขอบบนโมบายล์ */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full pb-12">
        
        {/* Header ส่วนบนพร้อมปุ่มย้อนกลับ (ใช้ max-w-7xl เพื่อให้ชิดซ้ายตรงกับหน้าอื่น) */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-20 flex-shrink-0">
          <div className="pl-16 pr-4 py-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex w-fit items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-base transition-all active:scale-95"
            >
              <ChevronLeft size={18} className="stroke-[2.5]" />
              <span>Back</span>
            </button>
          </div>
        </header>

        {/* Layout บอร์ดหลัก (ใช้ max-w-7xl เพื่อขยายพื้นที่ให้สมดุล) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">
            
            {/* Title Section พร้อมสถานะของเอกสารคำสั่งจอง */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">ข้อมูลการจองห้องประชุม</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  Booking Reference: <span className="font-mono text-slate-600">{data.id}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-3xs ${
                  isCancelled 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {isCancelled ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                  {data.statusLabel}
                </span>
                
                {!isCancelled && (
                  <button 
                    type="button" 
                    onClick={handleEditBooking}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                  >
                    แก้ไขการจอง
                  </button>
                )}
              </div>
            </div>

            {/* โครงสร้าง Grid แบ่งกลุ่มซ้าย-ขวา */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-6 ${isCancelled ? 'opacity-70 grayscale-[20%]' : ''}`}>
              
              {/* คอลัมน์ฝั่งซ้าย (กว้าง 2 ส่วน): ข้อมูลรูปห้อง แผนภูมิ และเนื้อหาการประชุม */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* บล็อกรูปภาพและรายละเอียดพิกัดของห้อง */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="h-56 w-full relative bg-slate-100 shrink-0">
                    <img src={data.roomImage} alt={data.roomName} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 grid grid-cols-3 gap-4 text-center border-t border-slate-50 bg-slate-50/20">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">ห้องประชุม</p>
                      <p className="text-base font-bold text-blue-600 mt-1">{data.roomName}</p>
                    </div>
                    <div className="border-x border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">ความจุ</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">{data.capacityDescription}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">ที่ตั้ง</p>
                      <p className="text-sm font-semibold text-slate-600 mt-1">
                        <MapPin size={14} className="inline mr-1 text-slate-400" />
                        ชั้น {data.floor}, {data.building}
                      </p>
                    </div>
                  </div>
                </div>

                {/* บล็อกหัวข้อระเบียบและวาระการประชุม */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-[#0f2963] border-b border-slate-100 pb-3 tracking-wide">
                    <FileText size={20} className="text-blue-600" />
                    <span>รายละเอียดการประชุม</span>
                  </h2>

                  <div className="space-y-5 text-sm">
                    {/* 1. ผู้จอง / แผนก */}
                    <div className="flex items-center gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-150 w-full sm:max-w-md">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 text-base">
                        {data.organizerName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">ผู้จอง / แผนก</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{data.organizerName} <span className="text-slate-400 font-medium">({data.organizerRole})</span></p>
                      </div>
                    </div>

                    {/* 2. หัวข้อการประชุม */}
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">หัวข้อการประชุม</p>
                      <p className="text-base font-bold text-slate-900 leading-snug">{data.title}</p>
                    </div>

                    {/* 3. คำอธิบาย */}
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">คำอธิบาย</p>
                      <p className="text-slate-600 font-medium leading-relaxed text-sm">{data.description}</p>
                    </div>

                    {/* รายการแฮชแท็กกลุ่มงาน */}
                    {data.tags && data.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {data.tags.map((tag) => (
                          <span key={tag} className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* คอลัมน์ฝั่งขวา (กว้าง 1 ส่วน): บอร์ดเวลา แผนภูมิวงกลม และสิ่งอำนวยความสะดวก */}
              <div className="space-y-6">
                
                {/* การ์ดรายงานกำหนดการ Time Timeline */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 text-center space-y-4 relative">
                  <div className="absolute top-4 right-4 text-slate-300">
                    <Calendar size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">กำหนดการ</p>
                  
                  {/* แผนภูมิจำลองรูปนาฬิกาวงกลมตรงกลาง */}
                  <div className="flex justify-center py-2">
                    <div className={`w-28 h-28 rounded-full border-4 border-slate-100 flex items-center justify-center relative ${isCancelled ? 'border-t-red-500 border-r-red-500/40' : 'border-t-blue-600 border-r-blue-600/40'}`}>
                      <Clock size={32} className={isCancelled ? 'text-red-500' : 'text-blue-600'} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-3xl font-black text-slate-900 tracking-tight">
                      {data.timeStart} - {data.timeEnd}
                    </p>
                    <p className={`text-sm font-bold ${isCancelled ? 'text-red-500' : 'text-blue-500'}`}>{data.durationLabel}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between text-sm font-semibold text-slate-500">
                    <span>วันที่การจอง</span>
                    <span className="text-slate-800 font-bold">{data.dateLabel}</span>
                  </div>
                </div>

                {/* ข้อกำหนดการใช้งานระบบองค์กร */}
                {!isCancelled && (
                  <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 text-sm text-blue-900 leading-relaxed font-medium">
                    <p className="font-bold mb-1 flex items-center gap-1.5 text-blue-950">
                      <AlertCircle size={16} className="text-blue-600" />
                      <span>ข้อกำหนดการใช้งาน</span>
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      โปรดทราบว่าท่านสามารถยกเลิกการจองนี้ได้ล่วงหน้าอย่างน้อย <strong className="text-red-600 font-bold">**24 ชั่วโมง**</strong> หากยกเลิกช้ากว่านั้น ระบบจะบันทึกเป็นสถิติการใช้งานค้าง
                    </p>
                  </div>
                )}

                {/* รายการอุปกรณ์อำนวยความสะดวก */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">อุปกรณ์อำนวยความสะดวก</p>
                  <div className="space-y-3">
                    {data.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <span className="text-blue-600 bg-blue-50 p-1.5 rounded-md">{amenityIcons[item] || <Zap size={16} />}</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* บาร์ปุ่มดาวน์โหลดรายงานตั๋วด้านล่างสุด */}
                {!isCancelled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2">
                    <button 
                      type="button" 
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
                    >
                      <Download size={16} />
                      <span>ดาวน์โหลดปฏิทิน (.ics)</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancelBooking}
                      className="w-full px-5 py-2.5 border border-red-100 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100/50 active:scale-95 transition-all"
                    >
                      ยกเลิกการจอง
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        </main>

      </div>
    </div>
  );
}