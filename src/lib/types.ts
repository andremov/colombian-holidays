import { Temporal } from "@js-temporal/polyfill";

export type Holiday = {
  date: Temporal.PlainDate;
  name: string;
};

export type CalendarState = {
  today: Temporal.PlainDate;
  selectedDate: Temporal.PlainDate | null;
  holiday: Holiday | null;
  setSelectedDate: (date: Temporal.PlainDate) => void;
};
