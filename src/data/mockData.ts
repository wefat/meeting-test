// src/data/mockData.ts

export type RoomStatus = "available" | "booked" | "maintenance" | "disabled";

export type RoomAmenity =
  | "wifi"
  | "video"
  | "coffee"
  | "whiteboard"
  | "projector"
  | "microphone"
  | "tv";

export interface RoomListItem {
  id: number;
  name: string;
  capacity: number;
  status: RoomStatus;
  image: string;
  amenities: RoomAmenity[];
  grayscale?: boolean;
}

export const rooms = [
  { id: 1, name: "Conference Room A", capacity: 10 },
  { id: 2, name: "Conference Room B", capacity: 20 },
  { id: 3, name: "Meeting Room 101", capacity: 5 },
  { id: 4, name: "Meeting Room 102", capacity: 8 },
];

export const roomListItems: RoomListItem[] = [
  {
    id: 1,
    name: "Skyline Boardroom",
    capacity: 12,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=340&fit=crop",
    amenities: ["wifi", "video", "coffee"],
  },
  {
    id: 2,
    name: "Creative Hub",
    capacity: 4,
    status: "booked",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=340&fit=crop",
    amenities: ["whiteboard", "tv"],
  },
  {
    id: 3,
    name: "Grand Hall",
    capacity: 50,
    status: "maintenance",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=340&fit=crop",
    amenities: ["projector", "microphone"],
  },
  {
    id: 4,
    name: "Focus Pod 04",
    capacity: 2,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&h=340&fit=crop",
    amenities: ["wifi"],
  },
  {
    id: 5,
    name: "North Wing B",
    capacity: 8,
    status: "disabled",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=340&fit=crop",
    amenities: ["wifi", "whiteboard"],
    grayscale: true,
  },
  {
    id: 6,
    name: "Summit Suite",
    capacity: 15,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=340&fit=crop",
    amenities: ["wifi", "video", "coffee", "projector"],
  },
];

export const timeSlotOptions = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "13:00 - 13:30",
  "13:30 - 14:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
];

export const capacityFilterOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "1-5 ท่าน", value: "1-5" },
  { label: "6-15 ท่าน", value: "6-15" },
  { label: "16+ ท่าน", value: "16+" },
];

export const bookings = [
  {
    id: 1,
    roomId: 1,
    userId: 2,
    startTime: new Date("2024-08-01T10:00:00"),
    endTime: new Date("2024-08-01T11:00:00"),
    title: "Project Kick-off",
  },
  {
    id: 2,
    roomId: 2,
    userId: 2,
    startTime: new Date("2024-08-01T14:00:00"),
    endTime: new Date("2024-08-01T15:30:00"),
    title: "Client Presentation",
  },
  {
    id: 3,
    roomId: 1,
    userId: 1,
    startTime: new Date("2024-08-02T09:00:00"),
    endTime: new Date("2024-08-02T10:00:00"),
    title: "Team Sync",
  },
];

export const notifications = [
  { id: 1, message: "New booking for Conference Room A", read: false },
  { id: 2, message: "Your booking for Meeting Room 101 is confirmed", read: false },
  { id: 3, message: "Maintenance alert for Conference Room B", read: true },
];

export const dashboardStats = {
  totalRooms: 4,
  totalBookings: 3,
  upcomingBookings: 2,
  availableRooms: 1,
};
