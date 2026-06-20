"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import { UserNavItem } from "../../data/userNavItems";

interface SidebarProps {
  navItems: UserNavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/user/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden md:flex w-60 lg:w-64 shrink-0 flex-col bg-white border-r border-border-color min-h-screen">
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-blue text-white">
            <Building2 size={20} strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-main leading-tight">
              RoomSync Pro
            </h1>
            <p className="text-[10px] font-medium tracking-wider text-text-muted uppercase">
              Enterprise Management
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-light-blue-bg text-primary-blue"
                      : "text-text-secondary hover:bg-slate-50 hover:text-text-main"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  {item.label}
                  {active && (
                    <span className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-primary-blue" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
