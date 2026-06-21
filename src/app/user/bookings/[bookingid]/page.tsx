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
  FileText,
  Wifi,
  Monitor,
  Wind,
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
  status: "confirmed" | "pending" | "cancelled";
  statusLabel: string;
  amenities: string[];
}

// ข้อมูลจำลองอ้างอิงตามดีไซน์รูปภาพ image_4ebc9d.png
const mockBookingData: Record<string, BookingDetail> = {
  "1": {
    id: "RS-8829-2024",
    roomId: "RM001",
    roomName: "Cyber Nexus A",
    roomImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop",
    floor: 24,
    building: "South Tower",
    capacityDescription: "ประมาณ 12 - 15 ท่าน",
    title: "Quarterly Business Review (Q3 Strategy)",
    organizerName: "สมชาย มั่นใจ",
    organizerRole: "Marketing Director",
    description: "การประชุมสรุปผลประกอบการไตรมาสที่ 3 และวางแผนกลยุทธ์สำหรับไตรมาสที่ 4 ร่วมกับทีมบริหารและตัวแทนจากฝ่ายต่าง ๆ โปรดเตรียมเอกสารรายงาน KPI รายละเอียดมาด้วย",
    tags: ["Strategy", "Quarterly", "Executive"],
    dateLabel: "24 พฤศจิกายน 2568",
    timeStart: "09:00",
    timeEnd: "10:30",
    durationLabel: "1 ชั่วโมง 30 นาที",
    status: "confirmed",
    statusLabel: "ยืนยันแล้ว",
    amenities: ["High-speed Wi-Fi (6E)", "4K Video Conferencing System", "85\" Interactive Display", "Free Coffee & Refreshments"],
  }
};

const amenityIcons: Record<string, React.ReactNode> = {
  "High-speed Wi-Fi (6E)": <Wifi size={16} />,
  "4K Video Conferencing System": <Monitor size={16} />,
  "85\" Interactive Display": <Monitor size={16} />,
  "Free Coffee & Refreshments": <Coffee size={16} />,
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.bookingId as string;
  
  // เรียกข้อมูล (หากไม่พบให้ใช้ ID "1" เป็นค่าเริ่มต้นของ Mock เพื่อให้แสดงผลลัพธ์ตามภาพ)
  const data = mockBookingData[bookingId] || mockBookingData["1"];
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-[#f4f6fa] min-h-screen font-sans antialiased text-slate-800">
      {/* ส่วนควบคุม Sidebar นำเข้าและใช้งานตัวแปรระบบเดิม */}
      <SidebarNav sidebarOpen={sidebarOpen} />

      {/* Main Content Area - ปรับความกว้างหลบแถบข้าง md:ml-64 บนคอม และเต็มจอเต็มขอบบนโมบายล์ */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full pb-12">
        
        {/* Header ส่วนบนพร้อมปุ่มย้อนกลับ */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-20 flex-shrink-0">
          <div className="pl-16 pr-4 py-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex items-center justify-between">
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

        {/* Layout บอร์ดหลักถอดแบบจากโครงสร้างรูปภาพ */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">
            
            {/* Title Section พร้อมสถานะของเอกสารคำสั่งจอง */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">ข้อมูลการจองห้องประชุม</h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Booking Reference: <span className="font-mono text-slate-600">{data.id}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-150 shadow-3xs">
                  <CheckCircle2 size={13} />
                  {data.statusLabel}
                </span>
                <button 
                  type="button" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                >
                  แก้ไขการจอง
                </button>
              </div>
            </div>

            {/* โครงสร้าง Grid แบ่งกลุ่มซ้าย-ขวา */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* คอลัมน์ฝั่งซ้าย (กว้าง 2 ส่วน): ข้อมูลรูปห้อง แผนภูมิ และเนื้อหาการประชุม */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* บล็อกรูปภาพและรายละเอียดพิกัดของห้อง */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="h-56 w-full relative bg-slate-100 shrink-0">
                    <img src={data.roomImage} alt={data.roomName} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide shadow-xs">
                      Premium Suite
                    </span>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-4 text-center border-t border-slate-50 bg-slate-50/20">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ห้องประชุม</p>
                      <p className="text-sm font-bold text-blue-600 mt-0.5">{data.roomName}</p>
                    </div>
                    <div className="border-x border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ความจุ</p>
                      <p className="text-xs font-bold text-slate-700 mt-1">{data.capacityDescription}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ชั้น / อาคาร</p>
                      <p className="text-xs font-semibold text-slate-600 mt-1">
                        <MapPin size={12} className="inline mr-1 text-slate-400" />
                        ชั้น {data.floor}, {data.building}
                      </p>
                    </div>
                  </div>
                </div>

                {/* บล็อกหัวข้อระเบียบและวาระการประชุม */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                  <h2 className="flex items-center gap-2 text-base font-bold text-[#0f2963] border-b border-slate-100 pb-3 tracking-wide">
                    <FileText size={18} className="text-blue-600" />
                    <span>รายละเอียดการประชุม</span>
                  </h2>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">หัวข้อการประชุม</p>
                        <p className="text-sm font-bold text-slate-900 leading-snug">{data.title}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50/60 p-2.5 rounded-xl border border-slate-150">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 text-sm">
                          {data.organizerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ผู้จอง / แผนก</p>
                          <p className="text-xs font-bold text-slate-800 truncate">{data.organizerName} <span className="text-slate-400 font-medium">({data.organizerRole})</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">คำอธิบาย</p>
                      <p className="text-slate-600 font-medium leading-relaxed text-xs">{data.description}</p>
                    </div>

                    {/* รายการแฮชแท็กกลุ่มงาน */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {data.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* คอลัมน์ฝั่งขวา (กว้าง 1 ส่วน): บอร์ดเวลา แผนภูมิวงกลม และสิ่งอำนวยความสะดวก */}
              <div className="space-y-6">
                
                {/* การ์ดรายงานกำหนดการ Time Timeline */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 text-center space-y-4 relative">
                  <div className="absolute top-4 right-4 text-slate-300">
                    <Calendar size={18} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">กำหนดการ</p>
                  
                  {/* แผนภูมิจำลองรูปนาฬิกาวงกลมตรงกลาง */}
                  <div className="flex justify-center py-2">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center relative border-t-blue-600 border-r-blue-600/40">
                      <Clock size={28} className="text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      {data.timeStart} - {data.timeEnd}
                    </p>
                    <p className="text-xs font-bold text-blue-500">{data.durationLabel}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-xs font-semibold text-slate-500">
                    <span>วันที่การจอง</span>
                    <span className="text-slate-800 font-bold">{data.dateLabel}</span>
                  </div>
                </div>

                {/* ข้อกำหนดการใช้งานระบบองค์กร */}
                <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 text-xs text-blue-900 leading-relaxed font-medium">
                  <p className="font-bold mb-1 flex items-center gap-1.5 text-blue-950">
                    <AlertCircle size={14} className="text-blue-600" />
                    <span>ข้อกำหนดการใช้งาน</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    โปรดทราบว่าท่านสามารถยกเลิกการจองนี้ได้ล่วงหน้าอย่างน้อย <strong className="text-red-600 font-bold">**24 ชั่วโมง**</strong> หากยกเลิกช้ากว่านั้น ระบบจะบันทึกเป็นสถิติการใช้งานค้าง
                  </p>
                </div>

                {/* รายการอุปกรณ์อำนวยความสะดวก */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">อุปกรณ์อำนวยความสะดวก</p>
                  <div className="space-y-2">
                    {data.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                        <span className="text-blue-600 bg-blue-50 p-1 rounded-md">{amenityIcons[item] || <Zap size={14} />}</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* บาร์ปุ่มดาวน์โหลดรายงานตั๋วด้านล่างสุด */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-2">
                  <button 
                    type="button" 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
                  >
                    <Download size={14} />
                    <span>ดาวน์โหลดปฏิทิน (.ics)</span>
                  </button>
                  <button 
                    type="button" 
                    className="w-full px-4 py-2 border border-red-100 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100/50 active:scale-95 transition-all"
                  >
                    ยกเลิกการจอง
                  </button>
                </div>

              </div>

            </div>
          </div>
        </main>

      </div>
    </div>
  );
}