import React from "react";
import { RoomStatus } from "../../data/mockData";

interface RoomStatusBadgeProps {
  status: RoomStatus;
}

const statusConfig: Record<
  RoomStatus,
  { label: string; className: string }
> = {
  available: {
    label: "ว่าง",
    className: "bg-status-green-bg text-status-green border border-green-200",
  },
  booked: {
    label: "มีผู้จองแล้ว",
    className: "bg-status-yellow-bg text-status-yellow border border-yellow-200",
  },
  maintenance: {
    label: "ซ่อมบำรุง",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  disabled: {
    label: "ปิดใช้งาน",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
};

const RoomStatusBadge: React.FC<RoomStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default RoomStatusBadge;
