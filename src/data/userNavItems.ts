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
  { href: "/user/bookings", label: "My Bookings", icon: Calendar },
  { href: "/user/rooms/room-list", label: "Room List", icon: DoorOpen },
];
