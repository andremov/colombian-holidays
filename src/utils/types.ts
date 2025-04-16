import { Temporal } from "@js-temporal/polyfill";

export type Holiday = {
  date: Temporal.PlainDate;
  name: string;
};

export type CalendarState = {
  selectedDate: Temporal.PlainDate | null;
  holiday: Holiday | null;
  setSelectedDate: (date: Temporal.PlainDate) => void;
  setHoliday: (holiday: Holiday | null) => void;
};
