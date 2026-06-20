"use client";
import React, { useState } from "react";
import { ArrowLeft, Upload, Plus, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const CreateEditRoomPage = () => {
  const [formData, setFormData] = useState({
    roomId: "RM007",
    name: "",
    floor: "",
    capacity: "",
    type: "ห้องประชุมใหญ่",
    description: "",
    amenities: [] as string[],
    status: "available",
    imageUrl: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/rooms"
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">เพิ่มห้องใหม่</h1>
            <p className="text-gray-500 mt-1">หมายเลขห้อง: {formData.roomId}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Image Upload */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              1. รูปภาพห้องประชุม
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
              <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">คลิกเพื่ออัปโหลดรูปภาพ</p>
              <p className="text-sm text-gray-500">หรือลากรูปมาวางที่นี่</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              2. ข้อมูลพื้นฐาน
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อห้องประชุม <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="เช่น Andaman Suite"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชั้น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="floor"
                    placeholder="เช่น 12"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ความจุ (คน) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="เช่น 50"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทห้อง <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  name="description"
                  placeholder="รายละเอียดเกี่ยวกับห้องประชุม..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              3. สิ่งอำนวยความสะดวก
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  เลือกสิ่งอำนวยความสะดวก:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenityOptions.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAddAmenity(amenity)}
                      disabled={formData.amenities.includes(amenity)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        formData.amenities.includes(amenity)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {formData.amenities.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    สิ่งอำนวยความสะดวกที่เลือก ({formData.amenities.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="bg-white px-3 py-1 rounded-full border border-blue-300 flex items-center gap-2"
                      >
                        <span className="text-sm">{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="hover:text-red-600 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status and Settings */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              4. สถานะและการตั้งค่า
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สถานะห้อง
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">พร้อมใช้งาน</option>
                  <option value="maintenance">บำรุงรักษา</option>
                  <option value="inactive">ปิดใช้งาน</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>เคล็ดลับ:</strong> คุณสามารถเปลี่ยนสถานะห้องได้ตลอดเวลา
                  โดยเข้าไปแก้ไขข้อมูลห้องนี้อีกครั้ง
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Link
              href="/admin/rooms"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-center"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              บันทึกห้องประชุม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditRoomPage;
