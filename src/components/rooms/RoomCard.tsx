import React from "react";
import {
  Coffee,
  Info,
  Mic,
  Monitor,
  Presentation,
  Tv,
  Users,
  Video,
  Wifi,
} from "lucide-react";
import { RoomAmenity, RoomListItem } from "../../data/mockData";
import RoomStatusBadge from "../ui/RoomStatusBadge";

interface RoomCardProps {
  room: RoomListItem;
}

const amenityIcons: Record<
  RoomAmenity,
  React.ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  wifi: Wifi,
  video: Video,
  coffee: Coffee,
  whiteboard: Presentation,
  projector: Monitor,
  microphone: Mic,
  tv: Tv,
};

const actionConfig = {
  available: {
    label: "จองห้องนี้",
    className:
      "bg-primary-blue text-white hover:bg-blue-700 border border-primary-blue",
    disabled: false,
  },
  booked: {
    label: "ไม่ว่าง",
    className:
      "bg-slate-100 text-text-secondary border border-border-color cursor-not-allowed",
    disabled: true,
  },
  maintenance: {
    label: "งดให้บริการ",
    className:
      "bg-status-red-bg text-status-red border border-red-200 cursor-not-allowed",
    disabled: true,
  },
  disabled: {
    label: "งดให้บริการ",
    className:
      "bg-status-red-bg text-status-red border border-red-200 cursor-not-allowed",
    disabled: true,
  },
};

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const action = actionConfig[room.status];

  return (
    <article className="overflow-hidden rounded-xl border border-border-color bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className={`h-full w-full object-cover ${
            room.grayscale ? "grayscale opacity-70" : ""
          }`}
        />
        <div className="absolute right-3 top-3">
          <RoomStatusBadge status={room.status} />
        </div>
      </div>

      <div className="p-4 lg:p-5">
        <h3 className="text-base font-bold text-text-main">{room.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
          <Users size={14} className="text-text-muted" />
          รองรับสูงสุด {room.capacity} ท่าน
        </p>

        {room.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {room.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity];
              return (
                <span
                  key={amenity}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-light-blue-bg text-primary-blue"
                  title={amenity}
                >
                  <Icon size={15} strokeWidth={2} />
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            disabled={action.disabled}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${action.className}`}
          >
            {action.label}
          </button>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-color bg-white text-primary-blue transition-colors hover:bg-light-blue-bg"
            aria-label={`More info about ${room.name}`}
          >
            <Info size={18} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
