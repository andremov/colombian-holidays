import { Temporal } from "@js-temporal/polyfill";
import { getHoliday } from "../lib/holidays";
import useCalendarStore from "@/store/calendar-store";

function CalendarMonth({ month }: { month: number }) {
  const { today, setSelectedDate, selectedDate } = useCalendarStore();
  // Get the current year
  const currentYear = today.year;

  // Get the first day of the month
  const firstDayOfMonth = Temporal.PlainDate.from({
    year: currentYear,
    month: month,
    day: 1,
  });

  // Get the number of days in the month
  const daysInMonth = firstDayOfMonth.daysInMonth;

  // Get the start day of the week
  const startDayOfWeek = firstDayOfMonth.dayOfWeek % 7; // Adjust to start with Sunday (0)

  // Generate an array of days for the calendar
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white">
      <div className="text-center mb-4">
        <h2 className="text-md md:text-lg font-bold">
          {firstDayOfMonth.toLocaleString("en-US", { month: "long" })}{" "}
          {currentYear}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {/* Render weekday names */}
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((weekday) => (
          <div
            key={weekday}
            className="text-center text-sm lg:text-lg font-medium text-gray-600"
          >
            {weekday}
          </div>
        ))}
        {/* Render empty cells for days before the start of the month */}
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="size-8"></div>
        ))}
        {/* Render the days of the month */}
        {days.map((day) => {
          const date = Temporal.PlainDate.from({
            year: currentYear,
            month: month,
            day: day,
          });

          const holiday = getHoliday(date);

          const isToday = date.equals(today);

          const isSelected = selectedDate ? date.equals(selectedDate) : false;

          return (
            <div
              key={day}
              onClick={() => setSelectedDate(date)}
              className={`size-8 flex items-center justify-center rounded select-none text-sm lg:text-lg cursor-pointer ${
                isSelected ? "border-1 border-green-400" : ""
              } ${
                isToday && holiday
                  ? "bg-purple-200 text-purple-800 font-bold"
                  : isToday
                  ? "bg-blue-200 text-blue-800 font-bold"
                  : holiday
                  ? "bg-red-100 text-red-800"
                  : "hover:bg-gray-200"
              }`}
              title={holiday ? holiday.name : ""}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarMonth;
