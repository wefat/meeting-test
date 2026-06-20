"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Search } from "lucide-react";
import {
  capacityFilterOptions,
  timeSlotOptions,
} from "../../data/mockData";

interface FilterBarProps {
  onCapacityChange?: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onCapacityChange }) => {
  const [selectedDate, setSelectedDate] = useState("2023-11-24");
  const [selectedTime, setSelectedTime] = useState(timeSlotOptions[0]);
  const [selectedCapacity, setSelectedCapacity] = useState(
    capacityFilterOptions[0].value
  );

  const handleCapacityChange = (value: string) => {
    setSelectedCapacity(value);
    onCapacityChange?.(value);
  };

  return (
    <div className="mb-6 rounded-xl border border-border-color bg-white p-4 shadow-sm lg:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end">
        <div>
          <label
            htmlFor="filter-date"
            className="mb-1.5 block text-xs font-medium text-text-secondary"
          >
            เลือกวันที่
          </label>
          <div className="relative">
            <input
              id="filter-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border-color bg-white px-3 py-2.5 pr-10 text-sm text-text-main outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
            />
            <Calendar
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-time"
            className="mb-1.5 block text-xs font-medium text-text-secondary"
          >
            ช่วงเวลา
          </label>
          <div className="relative">
            <select
              id="filter-time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border-color bg-white px-3 py-2.5 pr-10 text-sm text-text-main outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
            >
              {timeSlotOptions.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-capacity"
            className="mb-1.5 block text-xs font-medium text-text-secondary"
          >
            ความจุ
          </label>
          <div className="relative">
            <select
              id="filter-capacity"
              value={selectedCapacity}
              onChange={(e) => handleCapacityChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border-color bg-white px-3 py-2.5 pr-10 text-sm text-text-main outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
            >
              {capacityFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:col-span-2 xl:col-span-1 xl:min-w-[120px]"
        >
          <Search size={16} />
          ค้นหา
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
