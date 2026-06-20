"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { UserNavItem } from "../../data/userNavItems";

interface UserShellProps {
  navItems: UserNavItem[];
  userName: string;
  children: React.ReactNode;
}

const UserShell: React.FC<UserShellProps> = ({
  navItems,
  userName,
  children,
}) => {
  return (
    <div className="flex min-h-screen bg-page-bg font-sans">
      <Sidebar navItems={navItems} />
      <div className="flex min-w-0 flex-1 flex flex-col">
        <Topbar userName={userName} navItems={navItems} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default UserShell;
