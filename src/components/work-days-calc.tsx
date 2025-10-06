import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import useCalendarStore from "@/store/calendar-store";
import { formatDate, isHoliday } from "@/utils/holidays";

export default function WorkDaysCalc() {
  const { selectedDate, today } = useCalendarStore();
  const [workDays, setWorkDays] = useState<number>(1);
  const [result, setResult] = useState<{
    calendarDays: number;
    endDate: Temporal.PlainDate;
  } | null>(null);

  const isWorkDay = (date: Temporal.PlainDate): boolean => {
    // Check if it's a weekend (Saturday = 6, Sunday = 7)
    const dayOfWeek = date.dayOfWeek;
    if (dayOfWeek === 6 || dayOfWeek === 7) {
      return false;
    }

    // Check if it's a holiday (only works for current year)
    const currentYear = Temporal.Now.plainDateISO().year;
    if (date.year === currentYear) {
      return !isHoliday(date);
    }

    // For other years, only exclude weekends
    return true;
  };

  const calculateCalendarDays = () => {
    const startDate = selectedDate || today;
    let currentDate = startDate;
    let workDaysCount = 0;
    let calendarDaysCount = 0;

    // Start from the next day if the start date is not a work day
    if (!isWorkDay(currentDate)) {
      currentDate = currentDate.add({ days: 1 });
      calendarDaysCount = 1;
    }

    while (workDaysCount < workDays) {
      if (isWorkDay(currentDate)) {
        workDaysCount++;
      }

      if (workDaysCount < workDays) {
        currentDate = currentDate.add({ days: 1 });
        calendarDaysCount++;
      }
    }

    setResult({
      calendarDays: calendarDaysCount,
      endDate: currentDate,
    });
  };

  const startDate = selectedDate || today;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Work Days Calculator
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Start date:{" "}
          <span className="font-medium">{formatDate(startDate)}</span>
        </p>
      </div>

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

      <button
        onClick={calculateCalendarDays}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Result:</h3>
          <div className="space-y-2">
            <p className="text-blue-800">
              <span className="font-semibold">Calendar days needed:</span>{" "}
              <span className="text-lg font-bold">{result.calendarDays}</span>
            </p>
            <p className="text-blue-800">
              <span className="font-semibold">End date:</span>{" "}
              <span className="font-medium">{formatDate(result.endDate)}</span>
            </p>
          </div>

          <div className="mt-3 text-xs text-blue-600">
            <p>
              * Excludes weekends and Colombian holidays for the current year
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
