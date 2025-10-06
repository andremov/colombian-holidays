import { useMemo, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import useCalendarStore from "@/store/calendar-store";
import {
  calculateMaxCalendarDays,
  formatDate,
  isHoliday,
  isWorkDay,
  workDaysToCalendarDays,
} from "@/utils/holidays";

export default function WorkDaysCalc() {
  const { selectedDate, today } = useCalendarStore();
  const [workDays, setWorkDays] = useState<number>(1);

  const result: { calendarDays: number; endDate: Temporal.PlainDate } = useMemo(
    () => workDaysToCalendarDays(selectedDate || today, workDays),
    [selectedDate, today, workDays]
  );

  const maxResult: {
    calendarDays: number;
    startDate: Temporal.PlainDate;
    endDate: Temporal.PlainDate;
  } = useMemo(
    () => calculateMaxCalendarDays(workDays, today.year),
    [workDays, today.year]
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Work Days Calculator
      </h2>

      <div className="mb-4">
        <label
          htmlFor="workDays"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of work days:
        </label>
        <input
          type="number"
          id="workDays"
          min="1"
          max="365"
          value={workDays}
          onChange={(e) =>
            setWorkDays(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 ">
        <p className="font-semibold text-center mb-2">From today</p>
        <div className="flex items-center justify-between">
          <p className="flex-col flex">
            <span className="font-semibold">Start date:</span>{" "}
            <span className="font-medium">
              {formatDate(selectedDate || today)}
            </span>
          </p>
          <p className="flex-col flex">
            <span className="font-semibold">End date:</span>{" "}
            <span className="font-medium">{formatDate(result.endDate)}</span>
          </p>
          <p className="flex flex-col">
            <span className="font-semibold">Calendar days:</span>{" "}
            <span className="font-medium">{result.calendarDays}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 text-red-800 ">
        <p className="font-semibold text-center mb-2">Worst case</p>
        <div className="flex items-center justify-between">
          <p className="flex-col flex">
            <span className="font-semibold">Start date:</span>{" "}
            <span className="font-medium">
              {formatDate(maxResult.startDate)}
            </span>
          </p>
          <p className="flex-col flex">
            <span className="font-semibold">End date:</span>{" "}
            <span className="font-medium">{formatDate(maxResult.endDate)}</span>
          </p>
          <p className="flex flex-col">
            <span className="font-semibold">Calendar days:</span>{" "}
            <span className="font-medium">{maxResult.calendarDays}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
