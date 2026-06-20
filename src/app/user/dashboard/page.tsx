"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserShell from "../../../components/layout/UserShell";
import Card from "../../../components/ui/Card";
import { getAuthUser, User } from "../../../lib/mockAuth";
import { bookings, notifications, rooms } from "../../../data/mockData";
import { userNavItems } from "../../../data/userNavItems";

const UserDashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser || authUser.type !== "user") {
      router.push("/login");
    } else {
      setUser(authUser);
      setLoading(false);
    }
  }, [router]);

  const userBookings = bookings.filter((booking) => booking.userId === user?.id);
  const userNotifications = notifications.filter((notification) => !notification.read);

  const getRoomName = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.name : "Unknown Room";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserShell navItems={userNavItems} userName={user?.name || "User"}>
      <main className="flex-1 p-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user?.name || "User"}!
            </h2>
            <p className="text-gray-600 mb-6">
              Book and manage your meeting rooms with ease.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Book Meeting Room
              </button>
              <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
                View Room Status
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Today’s Schedule</h3>
              <ul>
                {userBookings.map((booking) => (
                  <li key={booking.id} className="border-b py-2">
                    <p className="font-semibold">{booking.title}</p>
                    <p className="text-sm text-gray-500">
                      {getRoomName(booking.roomId)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.startTime.toLocaleTimeString()} -{" "}
                      {booking.endTime.toLocaleTimeString()}
                    </p>
                  </li>
                ))}
                {userBookings.length === 0 && <p>No bookings for today.</p>}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Notifications</h3>
              <ul>
                {userNotifications.map((notification) => (
                  <li key={notification.id} className="border-b py-2">
                    {notification.message}
                  </li>
                ))}
                {userNotifications.length === 0 && (
                  <p>No new notifications.</p>
                )}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card title="Book Meeting Room" value="New" />
              <Card title="My Bookings" value="View" />
              <Card title="Room Availability" value="Check" />
              <Card title="Support" value="Contact" />
            </div>
          </div>
        </main>
      <footer className="bg-white p-4 text-center text-gray-600 shadow-md mt-auto">
        <p>© 2024 RoomSync Pro. All rights reserved.</p>
      </footer>
    </UserShell>
  );
};

export default UserDashboardPage;
