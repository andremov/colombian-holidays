import React from "react";
import CalendarMonth from "./calendar-month";

function AllCalendars() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-8">
      {Array.from({ length: 12 }, (_, monthIndex) => (
        <CalendarMonth key={monthIndex} month={monthIndex + 1} />
      ))}
    </div>
  );
}

export default AllCalendars;
