"use client";

import { useEffect, useState } from "react";
import { initLiff } from "@/lib/liff";

export default function LiffReservePage() {
  const [profile, setProfile] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const getInitialDate = () => {
    const d = new Date();
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Skip Sunday
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const [date, setDate] = useState(getInitialDate());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    roomId: "",
    title: "",
    participants: 2,
    organizerName: "",
  });

  useEffect(() => {
    const initialize = async () => {
      const liffObj = await initLiff();
      if (liffObj && liffObj.isLoggedIn()) {
        try {
            const userProfile = await liffObj.getProfile();
            setProfile(userProfile);
            setFormData(prev => ({ ...prev, organizerName: userProfile.displayName }));
        } catch (e) {
            console.error("LIFF GetProfile failed", e);
        }
      }
      
      // Fetch rooms
      try {
        const res = await fetch("https://backend-tan-ten-22.vercel.app/api/admin/rooms");
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, roomId: data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
      
      setLoading(false);
    };
    
    initialize();
  }, []);

  // Fetch Occupied Slots
  useEffect(() => {
    if (!formData.roomId || !date) return;
    const fetchOccupiedSlots = async () => {
      try {
        const res = await fetch(`https://backend-tan-ten-22.vercel.app/api/admin/bookings?roomId=${formData.roomId}&date=${date}`);
        if (res.ok) {
          const data = await res.json();
          const activeBookings = data.filter((b: any) => b.status !== "cancelled");
          const occupied: string[] = [];
          const allTimes = [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
            "16:00", "16:30", "17:00", "17:30", "18:00"
          ];
          for (const b of activeBookings) {
            for (const t of allTimes) {
              if (t >= b.timeStart && t < b.timeEnd) {
                if (!occupied.includes(t)) occupied.push(t);
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
  }, [formData.roomId, date]);

  const handleSlotClick = (time: string, isOccupied: boolean) => {
    if (isOccupied) return;
    setSelectedSlots((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time].sort()
    );
  };

  const baseSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];
  
  const timeSlotsData = baseSlots.map(time => ({
    time,
    status: occupiedSlots.includes(time) ? "occupied" : "clear"
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizerName) {
      alert("กรุณากรอกชื่อผู้จอง");
      return;
    }
    
    if (selectedSlots.length === 0) {
      alert("กรุณาเลือกช่วงเวลาที่ต้องการจอง");
      return;
    }

    setLoading(true);
    
    const timeStart = selectedSlots[0];
    const lastSlot = selectedSlots[selectedSlots.length - 1];
    const lastSlotIdx = baseSlots.indexOf(lastSlot);
    let timeEnd = "";
    if (lastSlotIdx !== -1) {
      timeEnd = lastSlot === "18:00" ? "18:30" : baseSlots[lastSlotIdx + 1];
    }

    try {
      const res = await fetch("https://backend-tan-ten-22.vercel.app/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: formData.roomId,
          title: formData.title,
          participants: Number(formData.participants),
          date: date,
          timeStart: timeStart,
          timeEnd: timeEnd,
          organizer: formData.organizerName,
          lineUserId: profile?.userId || null,
          status: "confirmed"
        }),
      });
      
      if (res.ok) {
        const liffObj = (window as any).liff;
        if (liffObj && liffObj.isInClient()) {
          try {
            await liffObj.sendMessages([{
              type: "text",
              text: `ฉันได้จองห้องประชุมเรียบร้อยแล้ว!\nชื่อผู้จอง: ${formData.organizerName}\nห้อง: ${rooms.find(r => r.id === formData.roomId)?.name}\nวันที่: ${date}\nเวลา: ${timeStart} - ${timeEnd}`
            }]);
          } catch (e) {
            console.error("sendMessages failed", e);
          }
          liffObj.closeWindow();
        } else {
          alert("จองห้องสำเร็จ!");
          if (liffObj) liffObj.closeWindow();
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`จองห้องไม่สำเร็จ: ${errorData.error || "กรุณาลองใหม่"}`);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
    setLoading(false);
  };

  if (loading && rooms.length === 0) return <div className="p-8 text-center text-slate-500">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans pb-10">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#00B900] p-5 text-white text-center">
          <h1 className="text-xl font-bold">จองห้องประชุม</h1>
          <p className="text-sm opacity-90 mt-1">Room Sync</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {profile && (
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <img src={profile.pictureUrl} alt="profile" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
              <div>
                <p className="text-xs text-slate-500 font-medium">เข้าสู่ระบบด้วย LINE</p>
                <p className="text-sm font-bold text-slate-900">{profile.displayName}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
              ชื่อ-นามสกุล (ผู้จอง) <span className="text-red-500">*</span>
            </label>
            <input 
              required
              type="text" 
              placeholder="กรุณากรอกชื่อของคุณ"
              value={formData.organizerName}
              onChange={(e) => setFormData({...formData, organizerName: e.target.value})}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none bg-yellow-50"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">เลือกห้องประชุม</label>
            <select 
              required
              value={formData.roomId}
              onChange={(e) => {
                setFormData({...formData, roomId: e.target.value});
                setSelectedSlots([]);
              }}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
            >
              <option value="">-- กรุณาเลือกห้อง --</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name} (จุได้ {room.capacity} คน)</option>
              ))}
            </select>
            
            {/* Show selected room details */}
            {formData.roomId && rooms.find(r => r.id === formData.roomId) && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                {rooms.find(r => r.id === formData.roomId).image && (
                  <img 
                    src={rooms.find(r => r.id === formData.roomId).image} 
                    alt={rooms.find(r => r.id === formData.roomId).name} 
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-3">
                  <h3 className="font-bold text-slate-800 text-sm">{rooms.find(r => r.id === formData.roomId).name}</h3>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">👥 จุได้ {rooms.find(r => r.id === formData.roomId).capacity} คน</span>
                    <span className="flex items-center gap-1">📍 ชั้น {rooms.find(r => r.id === formData.roomId).floor}</span>
                  </div>
                  {rooms.find(r => r.id === formData.roomId).amenities && (
                    <div className="mt-2 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">อุปกรณ์:</span> {rooms.find(r => r.id === formData.roomId).amenities.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">หัวข้อการประชุม</label>
            <input 
              required
              type="text" 
              placeholder="เช่น ประชุมทีมประจำสัปดาห์"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">วันที่</label>
            <input 
              required
              type="date" 
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlots([]);
              }}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
            />
          </div>

          {/* Time Slots Selection */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
              ช่วงเวลา (Time Slots)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {timeSlotsData.map((slot, index) => {
                const isUserSelected = selectedSlots.includes(slot.time);
                let styleClass = "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100";

                if (slot.status === "occupied") {
                  styleClass = "bg-red-50 text-red-400 border border-red-100 line-through opacity-60 cursor-not-allowed";
                } else if (isUserSelected) {
                  styleClass = "bg-[#00B900] text-white border border-[#00B900] font-semibold shadow-sm";
                }

                return (
                  <div
                    key={index}
                    onClick={() => handleSlotClick(slot.time, slot.status === "occupied")}
                    className={`py-2 text-center text-xs rounded-lg transition-all select-none cursor-pointer ${styleClass}`}
                  >
                    {slot.time}
                  </div>
                );
              })}
            </div>
            
            {/* Legends */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-500 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-green-50 border border-green-200 inline-block"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-50 border border-red-200 inline-block"></span>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#00B900] inline-block"></span>
                <span>Your Selection</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">จำนวนผู้เข้าร่วม (คน)</label>
            <input 
              required
              type="number" 
              min="1"
              value={formData.participants}
              onChange={(e) => setFormData({...formData, participants: parseInt(e.target.value)})}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || selectedSlots.length === 0 || !formData.organizerName}
            className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 mt-6 shadow-sm shadow-[#00B900]/30"
          >
            {loading ? "กำลังดำเนินการ..." : "ยืนยันการจองห้อง"}
          </button>
        </form>
      </div>
    </div>
  );
}
