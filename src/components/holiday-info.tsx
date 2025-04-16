import React from "react";
import useCalendarStore from "../store/calendar-store";

function HolidayInfo() {
  const { selectedDate, holiday } = useCalendarStore();

  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-100">
      {selectedDate ? (
        <div>
          <h2 className="text-lg font-semibold">Selected Date:</h2>
          <p>{selectedDate?.toLocaleString()}</p>
          {holiday && (
            <div>
              <h3 className="text-md font-semibold">Holiday:</h3>
              <p>{holiday.name}</p>
            </div>
          )}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default HolidayInfo;
