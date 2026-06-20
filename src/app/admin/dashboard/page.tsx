"use client";
import React from "react";
import {
  BarChart,
  Bell,
  ChevronDown,
  CircleHelp,
  FileDown,
  LayoutGrid,
  List,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
  Calendar,
  Home,
  Users,
  Building,
} from "lucide-react";

// Mock Data based on the screenshot
const roomStatusData = [
  {
    floor: 12,
    name: "Andaman Suite",
    type: "ห้องประชุมใหญ่",
    capacity: 50,
    status: "พร้อมใช้งาน",
  },
  {
    floor: 12,
    name: "Similan Room",
    type: "ห้องประชุมย่อย",
    capacity: 12,
    status: "มีการใช้งาน",
  },
  {
    floor: 10,
    name: "Lanna Hub",
    type: "Creative Space",
    capacity: 30,
    status: "รอทำความสะอาด",
  },
  {
    floor: 9,
    name: "Chao Phraya Boardroom",
    type: "Executive Boardroom",
    capacity: 20,
    status: "บำรุงรักษา",
  },
  {
    floor: 8,
    name: "Phuket Lab",
    type: "Training Room",
    capacity: 40,
    status: "พร้อมใช้งาน",
  },
    {
    floor: 9,
    name: "Phuket Lab",
    type: "Training Room",
    capacity: 40,
    status: "พร้อมใช้งาน",
  },
    {
    floor: 10,
    name: "Phuket Lab",
    type: "Training Room",
    capacity: 40,
    status: "พร้อมใช้งาน",
  },
      {
    floor: 11,
    name: "Phuket Lab",
    type: "Training Room",
    capacity: 40,
    status: "พร้อมใช้งาน",
  },

  
];

const popularRoomsData = [
    { rank: 1, name: "Andaman Suite", bookings: 124 },
    { rank: 2, name: "Lanna Hub", bookings: 98 },
    { rank: 3, name: "Phuket Lab", bookings: 85 },
    { rank: 4, name: "Chao Phraya", bookings: 72 },
]

const recentActivitiesData = [
    {
        icon: "check",
        user: "Andaman Suite",
        action: "จองสำเร็จ",
        details: "ดำเนินการจองสำเร็จ - 22 นาทีที่แล้ว"
    },
    {
        icon: "cancel",
        user: "Similan Room",
        action: "ยกเลิก",
        details: "ยกเลิกการจอง - 1 ชั่วโมงที่แล้ว"
    },
    {
        icon: "new",
        user: "Lanna Hub",
        action: "สร้างการจองใหม่",
        details: "สร้างการจองใหม่ - 1 ชั่วโมงที่แล้ว"
    }
]

const monthlyUsageData = [50, 65, 70, 75, 80, 85, 90, 85, 80, 75, 70, 65];


// Helper to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "พร้อมใช้งาน":
      return "bg-green-100 text-green-800";
    case "มีการใช้งาน":
      return "bg-yellow-100 text-yellow-800";
    case "รอทำความสะอาด":
      return "bg-blue-100 text-blue-800";
    case "บำรุงรักษา":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const StatCard = ({ title, value, change, progressBar, children }: any) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {children}
    </div>
    {change && <p className="text-sm text-green-500 mt-2">{change}</p>}
    {progressBar && (
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: progressBar }}></div>
      </div>
    )}
  </div>
);

const AdminDashboardPage = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r fixed h-full flex flex-col">
        <div className="p-4">
            <h1 className="text-xl font-bold text-blue-600">MeetingSpace</h1>
            <p className="text-xs text-gray-400">ENTERPRISE ADMIN</p>
        </div>
        <nav className="flex-1 p-2">
            <ul>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded-lg bg-blue-100 text-blue-600 font-semibold"><LayoutGrid size={20}/> Dashboard</a></li>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"><Calendar size={20}/> Booking Management</a></li>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"><Building size={20}/> Room Management</a></li>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"><Settings size={20}/> Settings</a></li>
            </ul>
        </nav>
        <div className="p-2 border-t">
            <ul>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"><CircleHelp size={20}/> Support</a></li>
                <li><a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"><LogOut size={20}/> Logout</a></li>
            </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-56">
        {/* Topbar */}
        <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg w-96">
            <Search size={20} className="text-gray-500"/>
            <input type="text" placeholder="ค้นหาห้องหรือการจอง..." className="bg-transparent outline-none w-full"/>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-600"/>
            <CircleHelp size={20} className="text-gray-600"/>
            <div className="flex items-center gap-2">
              <img src="https://i.pravatar.cc/40" alt="Admin" className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-semibold text-sm">แอดมิน ทดสอบ</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
              <ChevronDown size={16}/>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h2>
                    <p className="text-gray-500">สรุปข้อมูลภาพรวมทั้งหมดของระบบจองห้องประชุม RoomSync Pro</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow-sm"><FileDown size={16}/> Export</button>
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-blue-600 text-white shadow-sm"><Plus size={16}/> เพิ่มการจองใหม่</button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="อัตราการใช้งานรวม" value="82.4%" change="+3.2%" progressBar="82.4%" />
                <StatCard title="การจองวันนี้" value="151" change="+12 bookings"/>
                <StatCard title="สถานะการบำรุงรักษา" value="3">
                    <div className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">3 rooms</div>
                </StatCard>
                <StatCard title="รายได้เดือนนี้ (THB)" value="฿12.4k" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Room Status Table */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-bold mb-4">สถานะห้องทั้งหมดวันนี้ (Floor Status)</h3>
                      <table className="w-full text-sm text-left">
                        <thead className="text-gray-500">
                          <tr>
                            <th className="p-2">ชั้น</th>
                            <th className="p-2">ชื่อห้อง</th>
                            <th className="p-2">ประเภท</th>
                            <th className="p-2">ความจุ</th>
                            <th className="p-2">สถานะ</th>
                            <th className="p-2">การจัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomStatusData.map((room, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">{room.floor}</td>
                              <td className="p-2 font-semibold">{room.name}</td>
                              <td className="p-2">{room.type}</td>
                              <td className="p-2">{room.capacity} คน</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(room.status)}`}>
                                  {room.status}
                                </span>
                              </td>
                              <td className="p-2">...</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </div>
                <div className="space-y-6">
                  {/* Urgent Alert */}
                   <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                        <h3 className="font-bold text-red-600">การแจ้งเตือนด่วน</h3>
                        <ul className="mt-2 text-sm space-y-2">
                            <li className="border-b pb-2">ระบบปรับอากาศห้อง Chao Phraya Boardroom ไม่ทำงาน</li>
                            <li>Andaman Suite (15:00 - 16:00) มีการจองซ้อน</li>
                        </ul>
                    </div>

                    {/* Occupancy Rate */}
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                      <h3 className="font-bold mb-2">อัตราการใช้งานเทียบความจุ</h3>
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32">
                                <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="54" cx="64" cy="64"/>
                                <circle className="text-blue-600" strokeWidth="10" stroke="currentColor" fill="transparent" r="54" cx="64" cy="64" strokeDasharray={339.292} strokeDashoffset={339.292 - (339.292 * 78) / 100}/>
                            </svg>
                            <span className="absolute text-2xl font-bold">78%</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">OCCUPIED</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold mb-4">กิจกรรมล่าสุดในระบบ</h3>
                    <ul className="space-y-4 text-sm">
                       {recentActivitiesData.map((act, i) => (
                         <li key={i} className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">{/* Icon placeholder */}</div>
                           <div>
                             <p><span className="font-semibold">{act.user}</span>: {act.action}</p>
                             <p className="text-xs text-gray-500">{act.details}</p>
                           </div>
                         </li>
                       ))}
                    </ul>
                </div>
                {/* Popular Rooms */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                     <h3 className="font-bold mb-4">ห้องยอดนิยมสูงสุด (Top Popular Rooms)</h3>
                     <ul className="space-y-3 text-sm">
                        {popularRoomsData.map(room => (
                            <li key={room.rank} className="flex justify-between items-center">
                                <span><span className="inline-block text-center w-5 h-5 bg-gray-100 rounded-full mr-2">{room.rank}</span>{room.name}</span>
                                <span className="font-semibold">{room.bookings} ครั้ง</span>
                            </li>
                        ))}
                     </ul>
                </div>
                {/* Monthly Usage */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold mb-4">แนวโน้มการใช้งานรายเดือน (Monthly Usage Trend)</h3>
                    <div className="flex items-end justify-between h-32">
                        {monthlyUsageData.map((val, i) => (
                            <div key={i} className="w-4 bg-blue-200 rounded-t-sm" style={{height: `${val}%`}}></div>
                        ))}
                    </div>
                </div>
            </div>

        </main>
      </div>

      <button className="fixed bottom-8 right-8 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AdminDashboardPage;
