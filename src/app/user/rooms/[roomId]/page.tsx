"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Users,
  Clock,
  Wifi,
  Monitor,
  Wind,
  Coffee,
  Zap,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import SidebarNav from "@/components/layout/NavbarUser";

interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  pricePerHour: number;
  image: string;
  amenities: string[];
  description: string;
  galleryImages: string[];
  availableHours: number;
}

const mockRoomsDetail: Record<string, Room> = {
  "1": {
    id: "1",
    name: "Skyline Boardroom",
    floor: 12,
    capacity: 12,
    pricePerHour: 1500,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    amenities: ["wifi", "projector", "ac", "catering"],
    description:
      "Premium boardroom with stunning city views. Perfect for executive meetings and presentations.",
    galleryImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    ],
    availableHours: 8,
  },
  "2": {
    id: "2",
    name: "Creative Hub",
    floor: 8,
    capacity: 8,
    pricePerHour: 800,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    amenities: ["wifi", "whiteboard", "ac"],
    description:
      "Collaborative space designed for creative teams and brainstorming sessions.",
    galleryImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    ],
    availableHours: 5,
  },
  "3": {
    id: "3",
    name: "Grand Hall",
    floor: 5,
    capacity: 50,
    pricePerHour: 3500,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    amenities: ["wifi", "projector", "ac", "catering"],
    description:
      "Large-scale event space with professional setup. Ideal for conferences and major meetings.",
    galleryImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    ],
    availableHours: 3,
  },
  "4": {
    id: "4",
    name: "Focus Pod 04",
    floor: 2,
    capacity: 2,
    pricePerHour: 300,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    amenities: ["wifi", "ac"],
    description:
      "Private quiet space perfect for one-on-one meetings or focused work.",
    galleryImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    ],
    availableHours: 12,
  },
  "5": {
    id: "5",
    name: "North Wing B",
    floor: 3,
    capacity: 6,
    pricePerHour: 600,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    amenities: ["wifi", "projector"],
    description:
      "Modern meeting room with advanced technology and comfortable seating.",
    galleryImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    ],
    availableHours: 9,
  },
  "6": {
    id: "6",
    name: "Summit Suite",
    floor: 15,
    capacity: 15,
    pricePerHour: 2000,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    amenities: ["wifi", "projector", "ac", "coffee"],
    description:
      "Executive suite with premium amenities and dedicated support staff.",
    galleryImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    ],
    availableHours: 6,
  },
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={20} />,
  projector: <Monitor size={20} />,
  ac: <Wind size={20} />,
  catering: <Coffee size={20} />,
  whiteboard: <Zap size={20} />,
};

const amenityLabels: Record<string, string> = {
  wifi: "High-speed Wi-Fi",
  projector: "Video Conferencing",
  ac: "Air Conditioning",
  catering: "Catering Service",
  whiteboard: "Whiteboard",
};

export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId as string;
  const room = mockRoomsDetail[roomId];
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-600 font-medium">Room not found</p>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans antialiased">
      {/* Sidebar Area */}
      <SidebarNav sidebarOpen={sidebarOpen} />

      {/* Main Content Area: ปรับ ml-0 md:ml-64 บาลานซ์หลบขอบข้างของเมนูสไลด์ */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 transition-all duration-300 w-full">
        
        {/* Header: ล็อกขอบบนชิดขวา พร้อมขยับ Padding หลบ Hamburger */}
        <header className="border-b border-slate-200 bg-white shadow-xs sticky top-0 z-20">
          <div className="pl-16 pr-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="flex w-fit items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all active:scale-95"
            >
              <ChevronLeft size={18} className="stroke-[2.5]" />
              <span>Back</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full">
            
            {/* Hero Banner Image */}
            <div className="relative mb-8 h-80 overflow-hidden rounded-xl shadow-md border border-slate-200/60">
              <img
                src={room.image}
                alt={room.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="mb-2 text-xs font-bold tracking-wider text-blue-200 uppercase opacity-90">
                  Room • Floor {room.floor}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{room.name}</h1>
              </div>
            </div>

            {/* Layout Split Grid Panels */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              
              {/* Main Left Content: ข้อมูลหลักของการ์ด */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Room Information */}
                <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
                  <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-900 tracking-wide">
                    <AlertCircle size={18} className="text-blue-600" />
                    <span>Room Information</span>
                  </h2>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{room.capacity} People</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                        <p className="text-sm font-bold text-slate-800 truncate">Floor {room.floor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 border border-green-100 shadow-2xs">
                        <Clock size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Availability</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{room.availableHours}h Today</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities Block */}
                <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
                  <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-900 tracking-wide">
                    <Check size={18} className="text-blue-600" />
                    <span>Amenities</span>
                  </h2>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {room.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-150 transition-all hover:border-blue-150"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 border border-slate-200 shadow-2xs">
                          {amenityIcons[amenity] || <Zap size={16} />}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {amenityLabels[amenity] || amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Block */}
                <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
                  <h2 className="mb-4 text-base font-bold text-slate-900 tracking-wide">Gallery</h2>
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-xl bg-slate-100 h-64 border border-slate-200 shadow-2xs">
                      <img
                        src={room.galleryImages[galleryIndex]}
                        alt={`Gallery Display ${galleryIndex + 1}`}
                        className="h-full w-full object-cover transition-all duration-300"
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {room.galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setGalleryIndex(idx)}
                          className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all border-2 ${
                            idx === galleryIndex
                              ? "border-blue-600 scale-95 shadow-sm"
                              : "border-slate-200 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail View ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Right: Pricing & Actions Container */}
              <div className="h-fit rounded-xl bg-white p-6 border border-slate-200 shadow-sm lg:sticky lg:top-24">
                {/* Pricing Header */}
                <div className="mb-6 border-b border-slate-100 pb-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Price per hour
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      ฿{room.pricePerHour.toLocaleString()}
                    </span>
                    <span className="text-slate-400 font-medium text-xs">/ hour</span>
                  </div>
                </div>

                {/* Room Description */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* CTA Booking Action Buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/user/rooms/${roomId}/reserve`)}
                    className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition-all hover:bg-blue-700 active:scale-98 shadow-sm shadow-blue-100"
                  >
                    Reserve Now
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/user/rooms/room-list")}
                    className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 bg-white transition-all hover:bg-slate-50 active:scale-98"
                  >
                    Back to List
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