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
