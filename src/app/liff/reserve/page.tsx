"use client";

import { useEffect, useState } from "react";
import { initLiff } from "@/lib/liff";

export default function LiffReservePage() {
  const [profile, setProfile] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    roomId: "",
    title: "",
    date: "",
    timeStart: "09:00",
    timeEnd: "10:00",
    participants: 2,
  });

  useEffect(() => {
    const initialize = async () => {
      const liffObj = await initLiff();
      if (liffObj && liffObj.isLoggedIn()) {
        try {
            const userProfile = await liffObj.getProfile();
            setProfile(userProfile);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    try {
      const res = await fetch("https://backend-tan-ten-22.vercel.app/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          participants: Number(formData.participants),
          organizer: profile.displayName,
          lineUserId: profile.userId,
          status: "confirmed"
        }),
      });
      
      if (res.ok) {
        const liffObj = (window as any).liff;
        if (liffObj) {
          await liffObj.sendMessages([{
            type: "text",
            text: `ฉันได้จองห้องประชุมเรียบร้อยแล้ว!\nห้อง: ${rooms.find(r => r.id === formData.roomId)?.name}\nวันที่: ${formData.date}\nเวลา: ${formData.timeStart} - ${formData.timeEnd}`
          }]);
          liffObj.closeWindow();
        }
      } else {
        alert("จองห้องไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
    setLoading(false);
  };

  if (loading && !profile) return <div className="p-8 text-center text-slate-500">กำลังโหลดข้อมูล LINE...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#00B900] p-5 text-white text-center">
          <h1 className="text-xl font-bold">จองห้องประชุม</h1>
          <p className="text-sm opacity-90 mt-1">Room Sync</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {profile && (
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <img src={profile.pictureUrl} alt="profile" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
              <div>
                <p className="text-xs text-slate-500 font-medium">จองในชื่อ</p>
                <p className="text-sm font-bold text-slate-900">{profile.displayName}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">เลือกห้องประชุม</label>
            <select 
              required
              value={formData.roomId}
              onChange={(e) => setFormData({...formData, roomId: e.target.value})}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
            >
              <option value="">-- กรุณาเลือกห้อง --</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name} (จุได้ {room.capacity} คน)</option>
              ))}
            </select>
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
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">เวลาเริ่ม</label>
              <input 
                required
                type="time" 
                value={formData.timeStart}
                onChange={(e) => setFormData({...formData, timeStart: e.target.value})}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">เวลาสิ้นสุด</label>
              <input 
                required
                type="time" 
                value={formData.timeEnd}
                onChange={(e) => setFormData({...formData, timeEnd: e.target.value})}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00B900] focus:border-transparent outline-none"
              />
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
            disabled={loading}
            className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 mt-6 shadow-sm shadow-[#00B900]/30"
          >
            {loading ? "กำลังดำเนินการ..." : "ยืนยันการจองห้อง"}
          </button>
        </form>
      </div>
    </div>
  );
}
