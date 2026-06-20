"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UserShell from "../../../../components/layout/UserShell";
import FilterBar from "../../../../components/rooms/FilterBar";
import RoomCard from "../../../../components/rooms/RoomCard";
import { roomListItems } from "../../../../data/mockData";
import { userNavItems } from "../../../../data/userNavItems";
import { getAuthUser, User } from "../../../../lib/mockAuth";

const UserRoomListPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [capacityFilter, setCapacityFilter] = useState("all");

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser || authUser.type !== "user") {
      router.push("/login");
    } else {
      setUser(authUser);
      setLoading(false);
    }
  }, [router]);

  const filteredRooms = useMemo(() => {
    if (capacityFilter === "all") return roomListItems;
    if (capacityFilter === "1-5") {
      return roomListItems.filter((room) => room.capacity <= 5);
    }
    if (capacityFilter === "6-15") {
      return roomListItems.filter(
        (room) => room.capacity >= 6 && room.capacity <= 15
      );
    }
    return roomListItems.filter((room) => room.capacity >= 16);
  }, [capacityFilter]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-bg text-text-secondary">
        Loading...
      </div>
    );
  }

  return (
    <UserShell navItems={userNavItems} userName={user?.name || "User"}>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-main lg:text-3xl">
            meeting-room-scheduling-system
          </h1>
          <p className="mt-1 text-sm text-text-secondary lg:text-base">
            Manage meeting room bookings easily, clearly, and efficiently.
          </p>
        </div>

        <FilterBar onCapacityChange={setCapacityFilter} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>
    </UserShell>
  );
};

export default UserRoomListPage;
