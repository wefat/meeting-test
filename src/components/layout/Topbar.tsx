"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CircleHelp, Search } from "lucide-react";
import { logout } from "../../lib/mockAuth";
import MobileNav from "./MobileNav";
import { UserNavItem } from "../../data/userNavItems";

interface TopbarProps {
  userName?: string;
  showAdminView?: boolean;
  navItems?: UserNavItem[];
}

const Topbar: React.FC<TopbarProps> = ({
  userName = "User",
  showAdminView = true,
  navItems = [],
}) => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {navItems.length > 0 && <MobileNav navItems={navItems} />}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border-color bg-white px-4 py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
            <Search size={18} className="shrink-0 text-text-muted" />
            <input
              type="text"
              placeholder="ค้นหาห้องหรือการจอง..."
              className="w-full bg-transparent text-sm text-text-main outline-none placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 lg:gap-4">
          <button
            type="button"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-slate-100"
            aria-label="Help"
          >
            <CircleHelp size={20} />
          </button>

          {showAdminView && (
            <Link
              href="/admin/dashboard"
              className="hidden rounded-lg border border-border-color bg-white px-3 py-1.5 text-sm font-medium text-text-main shadow-sm transition-colors hover:bg-slate-50 sm:inline-block"
            >
              Admin View
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue/30"
            aria-label={`Profile for ${userName}`}
          >
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt={userName}
              className="h-9 w-9 rounded-full border border-border-color object-cover"
            />
          </button>
        </div>
      </header>
    </>
  );
};

export default Topbar;
