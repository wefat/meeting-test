import React from "react";

interface BadgeProps {
  status: "In Use" | "Available";
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const statusClasses =
    status === "In Use"
      ? "bg-red-200 text-red-800"
      : "bg-green-200 text-green-800";

  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

export default Badge;
