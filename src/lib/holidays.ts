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

// Cache holidays for multiple years
const holidayCache: Map<number, Holiday[]> = new Map();

function getHolidaysForYear(year: number): Holiday[] {
  if (!holidayCache.has(year)) {
    holidayCache.set(year, getColombianHolidays(year));
  }
  return holidayCache.get(year)!;
}

export const isHoliday = (date: Temporal.PlainDate): boolean => {
  return getHoliday(date) !== undefined;
};

export function getHoliday(date: Temporal.PlainDate): Holiday | undefined {
  const holidays = getHolidaysForYear(date.year);
  const dateString = date.toString();
  return holidays.find((holiday) => holiday.date.toString() === dateString);
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

  // Check if it's a holiday
  return !isHoliday(date);
};

export const workDaysToCalendarDays = (
  startDate: Temporal.PlainDate,
  workDays: number
): { calendarDays: number; endDate: Temporal.PlainDate } => {
  let currentDate = startDate;
  let workDaysCount = 0;
  let calendarDaysCount = 1;

  // Always start the next day
  currentDate = currentDate.add({ days: 1 });

  while (workDaysCount < workDays) {
    if (isWorkDay(currentDate)) {
      workDaysCount++;
    }

    if (workDaysCount < workDays) {
      currentDate = currentDate.add({ days: 1 });
      calendarDaysCount++;
    }
  }

  // Now find the next work day after completing the requested work days
  do {
    currentDate = currentDate.add({ days: 1 });
    calendarDaysCount++;
  } while (!isWorkDay(currentDate));

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
  // Revised approach: Try each possible start date and use workDaysToCalendarDays
  // to find the period, then track the maximum calendar days found.
  // This ensures perfect consistency with workDaysToCalendarDays behavior.

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

  // Try each date as a potential start date
  for (const startDate of allDates) {
    try {
      const result = workDaysToCalendarDays(startDate, workDays);

      // Only consider results where the end date is in the same year
      if (result.endDate.year === year) {
        if (result.calendarDays > maxCalendarDays) {
          maxCalendarDays = result.calendarDays;
          bestStartDate = startDate;
          bestEndDate = result.endDate;
        }
      }
    } catch (error) {
      // Skip start dates that can't accommodate the required work days within the year
      continue;
    }
  }

  return {
    calendarDays: maxCalendarDays,
    startDate: bestStartDate!,
    endDate: bestEndDate!,
  };
};

/*
2026
1 de enero	Jueves	Año Nuevo
12 de enero	Lunes	Reyes Magos
23 de marzo	Lunes	Día de San José
2 de abril	Jueves	Jueves Santo
3 de abril	Viernes	Viernes Santo
1 de mayo	Viernes	Día del trabajo
18 de mayo	Lunes	Ascensión de Jesús
8 de junio	Lunes	Corpus Christi
15 de junio	Lunes	Sagrado Corazón de Jesús
29 de junio	Lunes	San Pedro y San Pablo
20 de julio	Lunes	Día de la independencia
7 de agosto	Viernes	Batalla de Boyacá
17 de agosto	Lunes	Asunción de la Virgen
12 de octubre	Lunes	Día de la raza
2 de noviembre	Lunes	Todos los Santos
16 de noviembre	Lunes	Independencia de Cartagena
8 de diciembre	Martes	Inmaculada Concepción
25 de diciembre	Viernes	Navidad
*/
