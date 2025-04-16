import { CalendarState } from "@/utils/types";
import { create } from "zustand";

const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: null,
  holiday: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setHoliday: (holiday) => set({ holiday }),
}));

export default useCalendarStore;
