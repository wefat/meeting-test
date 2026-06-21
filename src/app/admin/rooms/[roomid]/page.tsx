"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Upload, Plus, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

const CreateEditRoomPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomid = params?.roomid as string;
  const isCreate = roomid === "create";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    floor: "1", // Default floor to 1 behind the scenes
    capacity: "",
    type: "ห้องประชุมใหญ่",
    description: "",
    amenities: [] as string[],
    status: "available",
    image: "",
  });

  const [newAmenity, setNewAmenity] = useState("");

  const roomTypes = [
    "ห้องประชุมใหญ่",
    "ห้องประชุมย่อย",
    "Creative Space",
    "Executive Boardroom",
    "Training Room",
    "Focus Room",
  ];

  const amenityOptions = [
    "WiFi",
    "Projector",
    "AC",
    "TV",
    "Whiteboard",
    "Computer",
    "Coffee Station",
    "Video Conference",
    "Sound System",
    "Interactive Board",
  ];

  useEffect(() => {
    if (!isCreate && roomid) {
      const fetchRoom = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const res = await fetch(`${apiUrl}/api/admin/rooms/${roomid}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              name: data.name,
              floor: String(data.floor || 1),
              capacity: String(data.capacity),
              type: data.type,
              description: data.description || "",
              amenities: data.amenities || [],
              status: data.status,
              image: data.image || "",
            });
          }
        } catch (err) {
          console.error("Error fetching room:", err);
        }
      };
      fetchRoom();
    }
  }, [roomid, isCreate]);

  const handleAddAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = isCreate 
        ? `${apiUrl}/api/admin/rooms` 
        : `${apiUrl}/api/admin/rooms/${roomid}`;
      const method = isCreate ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          floor: 1, // Defaulting floor to 1 so backend database doesn't complain
          capacity: Number(formData.capacity),
          type: formData.type,
          description: formData.description,
          amenities: formData.amenities,
          status: formData.status,
          image: formData.image,
        }),
      });

      if (res.ok) {
        router.push("/admin/rooms");
      } else {
        let errorMessage = "ไม่สามารถบันทึกข้อมูล";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const text = await res.text();
            console.error("Non-JSON error response:", text);
            errorMessage = `เซิร์ฟเวอร์ตอบกลับรหัส: ${res.status} (Payload Too Large or Server Error)`;
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

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      {/* Sidebar คงที่ด้านซ้าย */}
      <AdminSidebar />

      {/* Main Content Container - ขยายพื้นที่หลบแนว Sidebar และปรับ padding ด้านข้าง */}
      <div className="flex-1 ml-0 md:ml-64 min-w-0 transition-all duration-300 p-5">
        <div className="w-full">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin/rooms"
              className="p-2.5 hover:bg-slate-200/70 rounded-xl text-slate-600 transition-all active:scale-95 border border-slate-200 bg-white shadow-2xs"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isCreate ? "เพิ่มห้องใหม่" : "แก้ไขห้องประชุม"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                หมายเลขห้อง: <span className="font-semibold text-slate-700">{isCreate ? "ระบบสุ่มสร้างอัตโนมัติ" : roomid}</span>
              </p>
            </div>
          </div>

          {/* Form wrapper ปรับโครงสร้างแบบ Grid 2 คอลัมน์ เพื่อกระจายความกว้างซ้ายขวาให้สมดุล */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* คอลัมน์ฝั่งซ้าย: กล่องกรอกข้อมูลพื้นฐานและสิ่งอำนวยความสะดวก (กว้าง 2 ส่วน) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Information Block */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4 tracking-wide">
                  1. ข้อมูลพื้นฐาน
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ชื่อห้องประชุม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="เช่น Andaman Suite"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ความจุ (คน) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      placeholder="เช่น 50"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ประเภทห้อง <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer bg-white"
                    >
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      คำอธิบาย
                    </label>
                    <textarea
                      name="description"
                      placeholder="รายละเอียดเกี่ยวกับห้องประชุม..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Block */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4 tracking-wide">
                  2. สิ่งอำนวยความสะดวก
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-3">
                      เลือกสิ่งอำนวยความสะดวก:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {amenityOptions.map((amenity) => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAddAmenity(amenity)}
                          disabled={formData.amenities.includes(amenity)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                            formData.amenities.includes(amenity)
                              ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.amenities.length > 0 && (
                    <div className="bg-blue-50/40 rounded-xl border border-blue-100 p-4">
                      <p className="text-xs font-bold text-blue-800 mb-3 uppercase tracking-wider">
                        สิ่งอำนวยความสะดวกที่เลือก ({formData.amenities.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map((amenity) => (
                          <div
                            key={amenity}
                            className="bg-white px-3 py-1 rounded-full border border-blue-200 flex items-center gap-2 shadow-2xs"
                          >
                            <span className="text-xs font-semibold text-slate-600">{amenity}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAmenity(amenity)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* คอลัมน์ฝั่งขวา: กล่องรูปภาพ, สถานะห้อง, และปุ่ม Action บันทึก (กว้าง 1 ส่วน) */}
            <div className="space-y-6">
              
              {/* Image Upload Block */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4 tracking-wide">
                  3. รูปภาพห้องประชุม
                </h2>
                
                {formData.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img 
                      src={formData.image} 
                      alt="Room preview" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-750 text-white rounded-full shadow-md transition-all active:scale-90 cursor-pointer"
                      title="ลบรูปภาพ"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center transition-all cursor-pointer bg-slate-50/50"
                  >
                    <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-700 text-sm font-semibold">คลิกเพื่ออัปโหลดรูปภาพ</p>
                    <p className="text-xs text-slate-400 mt-0.5">หรือลากรูปมาวางที่นี่</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Status Block */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-3 tracking-wide">
                    4. สถานะการใช้งาน
                  </h2>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer bg-white"
                  >
                    <option value="available">พร้อมใช้งาน</option>
                    <option value="maintenance">บำรุงรักษา</option>
                    <option value="inactive">ปิดใช้งาน</option>
                  </select>
                </div>

                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs leading-relaxed text-blue-900 font-medium">
                    💡 <strong>เคล็ดลับ:</strong> คุณสามารถเปลี่ยนสถานะหรือเข้ามาอัปเดตข้อมูลของห้องประชุมนี้ได้ตลอดเวลาผ่านทางระบบหน้าจัดการหลัก
                  </p>
                </div>

                {/* ปุ่ม Action รวมการใช้งานควบคุมระบบไว้ที่คอลัมน์ขวา เพื่อให้ Layout ซ้ายขวาเรียงตัวระนาบเดียวกัน */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg text-center transition-all active:scale-98 shadow-sm shadow-blue-100"
                  >
                    บันทึกห้องประชุม
                  </button>
                  <Link
                    href="/admin/rooms"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 text-center transition-all active:scale-98"
                  >
                    ยกเลิก
                  </Link>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditRoomPage;