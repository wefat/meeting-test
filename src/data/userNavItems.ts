import {
  LayoutGrid,
  DoorOpen,
  Calendar,
  BarChart3,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface UserNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const userNavItems: UserNavItem[] = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/user/rooms/room-list", label: "Room List", icon: DoorOpen },
  { href: "/user/bookings/", label: "My Bookings", icon: Calendar },
  { href: "/user/room-list", label: "Analytics", icon: BarChart3 },
  { href: "/user/room-list", label: "Settings", icon: Settings },
];
