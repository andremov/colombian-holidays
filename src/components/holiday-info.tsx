import React from "react";
import useCalendarStore from "../store/calendar-store";
import { formatDate, getHoliday } from "@/lib/holidays";

export default function HolidayInfo() {
  const { today, selectedDate } = useCalendarStore();

  const triggeringDate = selectedDate || today;
  const holiday = getHoliday(triggeringDate);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Holiday Information
      </h2>

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Date:</span>
        <span>{formatDate(triggeringDate)}</span>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800">
        {holiday ? (
          <div className="flex flex-col">
            <span className="text-md font-semibold">Holiday:</span>
            <span>{holiday.name}</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-md font-semibold">Holiday:</span>
            <span>No holiday</span>
          </div>
        )}
      </div>
    </div>
  );
}
