import { Temporal } from "@js-temporal/polyfill";
import { getHoliday } from "../utils/holidays";

function CalendarMonth({ month }: { month: number }) {
  // Get the current year
  const currentYear = Temporal.Now.plainDateISO().year;

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
      <div className="grid grid-cols-7 gap-2">
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
          <div key={`empty-${index}`} className="h-6 w-6"></div>
        ))}
        {/* Render the days of the month */}
        {days.map((day) => {
          const date = Temporal.PlainDate.from({
            year: currentYear,
            month: month,
            day: day,
          });

          const holiday = getHoliday(date);

          return (
            <div
              key={day}
              className={`h-6 w-6 flex items-center justify-center rounded select-none text-sm lg:text-lg ${
                holiday
                  ? "bg-red-200 text-red-800 font-bold"
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
