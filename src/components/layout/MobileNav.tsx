"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNavItem } from "../../data/userNavItems";

interface MobileNavProps {
  navItems: UserNavItem[];
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/user/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="shrink-0 border-b border-border-color bg-white px-3 py-2 overflow-x-auto md:hidden">
      <div className="flex gap-2 min-w-max">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-light-blue-bg text-primary-blue"
                  : "text-text-secondary hover:bg-slate-50"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
