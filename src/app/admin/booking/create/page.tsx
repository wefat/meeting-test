"use client";
import React, { useState } from "react";
import { ArrowLeft, Plus, X, Clock, Users } from "lucide-react";
import Link from "next/link";

const CreateEditBookingPage = () => {
  const [formData, setFormData] = useState({
    bookingId: "BK006",
    roomId: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    organizerName: "",
    organizerEmail: "",
    participants: [],
    participantCount: 1,
    title: "",
    description: "",
    status: "pending",
  });

  const [participantEmail, setParticipantEmail] = useState("");

  const rooms = [
    { id: 1, name: "Andaman Suite", capacity: 50, floor: 12 },
    { id: 2, name: "Similan Room", capacity: 12, floor: 12 },
    { id: 3, name: "Lanna Hub", capacity: 30, floor: 10 },
    { id: 4, name: "Chao Phraya Boardroom", capacity: 20, floor: 9 },
    { id: 5, name: "Phuket Lab", capacity: 40, floor: 8 },
  ];

  const handleAddParticipant = () => {
    if (participantEmail.trim()) {
      setFormData({
        ...formData,
        // participants: [...formData.participants, participantEmail],
      });
      setParticipantEmail("");
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter((p) => p !== email),
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
            href="/admin/booking"
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              เพิ่มการจองใหม่
            </h1>
            <p className="text-gray-500 mt-1">หมายเลขการจอง: {formData.bookingId}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Room Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              1. เลือกห้องประชุม
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, roomId: room.id.toString() })
                  }
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    formData.roomId === room.id.toString()
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900">{room.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    ชั้น {room.floor} • ความจุ {room.capacity} คน
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              2. เลือกวันและเวลา
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่จอง
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เวลาเริ่มต้น
                </label>
                <input
                  type="time"
                  name="timeStart"
                  value={formData.timeStart}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เวลาสิ้นสุด
                </label>
                <input
                  type="time"
                  name="timeEnd"
                  value={formData.timeEnd}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              3. รายละเอียดการจอง
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหัวข้อการประชุม
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="เช่น การประชุมทีมขายรายไตรมาส"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบายเพิ่มเติม
                </label>
                <textarea
                  name="description"
                  placeholder="รายละเอียดเกี่ยวกับประชุม..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              4. ข้อมูลผู้จัดการ
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้จัดการ
                </label>
                <input
                  type="text"
                  name="organizerName"
                  placeholder="ชื่อ นามสกุล"
                  value={formData.organizerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมลผู้จัดการ
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  placeholder="email@example.com"
                  value={formData.organizerEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              5. ผู้เข้าร่วมประชุม
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddParticipant();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
                >
                  <Plus size={18} />
                </button>
              </div>
              {formData.participants.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                    <Users size={16} />
                    ผู้เข้าร่วม ({formData.participants.length} คน)
                  </div>
                  <div className="space-y-2">
                    {formData.participants.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(email)}
                          className="p-1 hover:bg-red-50 rounded transition"
                        >
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">6. สถานะ</h2>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">รอการยืนยัน</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Link
              href="/admin/booking"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-center"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              บันทึกการจอง
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditBookingPage;
