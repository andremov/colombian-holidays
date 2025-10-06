import { CalendarState } from "@/utils/types";
import { Temporal } from "@js-temporal/polyfill";
import { create } from "zustand";

const useCalendarStore = create<CalendarState>((set) => ({
  today: Temporal.Now.plainDateISO(),
  selectedDate: null,
  holiday: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export default useCalendarStore;
