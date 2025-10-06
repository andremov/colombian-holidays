import { Temporal } from "@js-temporal/polyfill";
import { Holiday } from "./types";

function getColombianHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [];

  // Fixed holidays
  holidays.push({
    date: Temporal.PlainDate.from({ year, month: 1, day: 1 }),
    name: "Año Nuevo",
  });
  holidays.push({
    date: Temporal.PlainDate.from({ year, month: 5, day: 1 }),
    name: "Día del Trabajo",
  });
  holidays.push({
    date: Temporal.PlainDate.from({ year, month: 7, day: 20 }),
    name: "Día de la Independencia",
  });
  holidays.push({
    date: Temporal.PlainDate.from({ year, month: 8, day: 7 }),
    name: "Batalla de Boyacá",
  });
  holidays.push({
    date: Temporal.PlainDate.from({ year, month: 12, day: 8 }),
    name: "Inmaculada Concepción",
  });
  holidays.push({
    date: Temporal.PlainDate.from({ year, month: 12, day: 25 }),
    name: "Navidad",
  });

  // Movable holidays
  const moveToMonday = (date: Temporal.PlainDate): Temporal.PlainDate => {
    const dayOfWeek = date.dayOfWeek;
    return dayOfWeek === 1 ? date : date.add({ days: 8 - dayOfWeek });
  };

  holidays.push({
    date: moveToMonday(Temporal.PlainDate.from({ year, month: 1, day: 6 })),
    name: "Día de los Reyes Magos",
  });
  holidays.push({
    date: moveToMonday(Temporal.PlainDate.from({ year, month: 3, day: 19 })),
    name: "Día de San José",
  });

  // Easter-based holidays
  const getEasterSunday = (year: number): Temporal.PlainDate => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return Temporal.PlainDate.from({ year, month, day });
  };

  const easterSunday = getEasterSunday(year);
  holidays.push({
    date: easterSunday.subtract({ days: 3 }),
    name: "Jueves Santo",
  });
  holidays.push({
    date: easterSunday.subtract({ days: 2 }),
    name: "Viernes Santo",
  });
  holidays.push({
    date: moveToMonday(easterSunday.add({ days: 39 })),
    name: "Día de la Ascensión",
  });
  holidays.push({
    date: moveToMonday(easterSunday.add({ days: 60 })),
    name: "Corpus Christi",
  });
  holidays.push({
    date: moveToMonday(easterSunday.add({ days: 68 })),
    name: "Sagrado Corazón",
  });

  // Other movable holidays
  holidays.push({
    date: moveToMonday(Temporal.PlainDate.from({ year, month: 6, day: 29 })),
    name: "San Pedro y San Pablo",
  });
  holidays.push({
    date: moveToMonday(Temporal.PlainDate.from({ year, month: 8, day: 15 })),
    name: "La Asunción de la Virgen",
  });
  holidays.push({
    date: moveToMonday(Temporal.PlainDate.from({ year, month: 10, day: 12 })),
    name: "Día de la Raza",
  });
  holidays.push({
    date: moveToMonday(Temporal.PlainDate.from({ year, month: 11, day: 1 })),
    name: "Día de Todos los Santos",
  });
  holidays.push({
    date: moveToMonday(Temporal.PlainDate.from({ year, month: 11, day: 11 })),
    name: "Independencia de Cartagena",
  });

  return holidays;
}

const colombianHolidays = getColombianHolidays(
  Temporal.Now.plainDateISO().year
);

export const isHoliday = (date: Temporal.PlainDate): boolean => {
  return getHoliday(date) !== undefined;
};

export function getHoliday(date: Temporal.PlainDate): Holiday | undefined {
  const dateString = date.toString();
  return colombianHolidays.find(
    (holiday) => holiday.date.toString() === dateString
  );
}

export const formatDate = (date: Temporal.PlainDate): string => {
  return date.toLocaleString("en-US", {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const isWorkDay = (date: Temporal.PlainDate): boolean => {
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

export const workDaysToCalendarDays = (
  startDate: Temporal.PlainDate,
  workDays: number
): { calendarDays: number; endDate: Temporal.PlainDate } => {
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

  return {
    calendarDays: calendarDaysCount,
    endDate: currentDate,
  };
};

export const calculateMaxCalendarDays = (
  workDays: number,
  year: number
): {
  calendarDays: number;
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate;
} => {
  // Using a true sliding window approach for O(n) efficiency
  // Previous implementation: O(n * m) where n = days in year, m = work days needed
  // New implementation: O(n) where n = days in year
  //
  // Key optimization: Instead of recalculating work days for each start date,
  // we maintain a window that slides across the year, adding days on the right
  // and removing days on the left as needed to maintain exactly 'workDays' work days.

  let maxCalendarDays = 0;
  let bestStartDate: Temporal.PlainDate | null = null;
  let bestEndDate: Temporal.PlainDate | null = null;

  // Get all valid dates in the year
  const allDates: Temporal.PlainDate[] = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = Temporal.PlainDate.from({
      year,
      month,
      day: 1,
    }).daysInMonth;
    for (let day = 1; day <= daysInMonth; day++) {
      allDates.push(Temporal.PlainDate.from({ year, month, day }));
    }
  }

  // Initialize the window
  let windowStart = 0;
  let windowEnd = 0;
  let workDaysInWindow = 0;

  // Expand window until we have enough work days
  while (workDaysInWindow < workDays && windowEnd < allDates.length) {
    if (isWorkDay(allDates[windowEnd])) {
      workDaysInWindow++;
    }
    windowEnd++;
  }

  // If we found enough work days, record this window
  if (workDaysInWindow === workDays) {
    const calendarDays = windowEnd - windowStart; // Total days in the window
    maxCalendarDays = calendarDays;
    bestStartDate = allDates[windowStart];
    bestEndDate = allDates[windowEnd - 1];
  }

  // Slide the window across the rest of the year
  while (windowEnd < allDates.length) {
    // Add the new day to the window
    if (isWorkDay(allDates[windowEnd])) {
      workDaysInWindow++;
    }
    windowEnd++;

    // Shrink window from the left while we have more than needed work days
    while (workDaysInWindow > workDays && windowStart < windowEnd) {
      if (isWorkDay(allDates[windowStart])) {
        workDaysInWindow--;
      }
      windowStart++;
    }

    // If we have exactly the right number of work days, check if this is better
    if (workDaysInWindow === workDays) {
      const calendarDays = windowEnd - windowStart; // Total days in the window
      if (calendarDays > maxCalendarDays) {
        maxCalendarDays = calendarDays;
        bestStartDate = allDates[windowStart];
        bestEndDate = allDates[windowEnd - 1];
      }
    }
  }

  return {
    calendarDays: maxCalendarDays,
    startDate: bestStartDate!,
    endDate: bestEndDate!,
  };
};
