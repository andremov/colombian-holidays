import React from "react";
import useCalendarStore from "../store/calendar-store";
import { getHoliday } from "@/utils/holidays";

export default function HolidayInfo() {
  const { today, selectedDate } = useCalendarStore();

  const triggeringDate = selectedDate || today;
  const holiday = getHoliday(triggeringDate);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-md">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Date:</span>
        <span>{triggeringDate?.toLocaleString()}</span>
      </div>
      {holiday && (
        <div className="flex items-center justify-between">
          <span className="text-md font-semibold">Holiday:</span>
          <span>{holiday.name}</span>
        </div>
      )}
    </div>
  );
}
