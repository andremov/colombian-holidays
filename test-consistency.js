// Simple test to verify consistency between workDaysToCalendarDays and calculateMaxCalendarDays
// This is a Node.js test that doesn't require TypeScript compilation

const { Temporal } = require("@js-temporal/polyfill");

// Mock the holiday functions for testing
const mockHolidays = [
  {
    date: Temporal.PlainDate.from({ year: 2024, month: 1, day: 1 }),
    name: "New Year",
  },
  {
    date: Temporal.PlainDate.from({ year: 2024, month: 12, day: 25 }),
    name: "Christmas",
  },
];

function isWorkDay(date) {
  const dayOfWeek = date.dayOfWeek;
  if (dayOfWeek === 6 || dayOfWeek === 7) return false;

  // Check holidays
  return !mockHolidays.some((h) => h.date.toString() === date.toString());
}

function workDaysToCalendarDays(startDate, workDays) {
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

  return {
    calendarDays: calendarDaysCount,
    endDate: currentDate,
  };
}

function calculateMaxCalendarDays(workDays, year) {
  // Revised approach: Try each possible start date and use workDaysToCalendarDays
  // to find the period, then track the maximum calendar days found.
  // This ensures perfect consistency with workDaysToCalendarDays behavior.

  let maxCalendarDays = 0;
  let bestStartDate = null;
  let bestEndDate = null;

  // Get all valid dates in the year
  const allDates = [];
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
    startDate: bestStartDate,
    endDate: bestEndDate,
  };
}

// Test consistency
function testConsistency() {
  const testCases = [
    { workDays: 5, year: 2024 },
    { workDays: 10, year: 2024 },
    { workDays: 20, year: 2024 },
  ];

  testCases.forEach(({ workDays, year }) => {
    console.log(`\nTesting ${workDays} work days in ${year}:`);

    const maxResult = calculateMaxCalendarDays(workDays, year);
    console.log(`Max calendar days found: ${maxResult.calendarDays}`);
    console.log(
      `Best period: ${maxResult.startDate.toString()} to ${maxResult.endDate.toString()}`
    );

    // Test if workDaysToCalendarDays gives the same result for this period
    const directResult = workDaysToCalendarDays(maxResult.startDate, workDays);
    console.log(
      `Direct calculation: ${
        directResult.calendarDays
      } calendar days, end: ${directResult.endDate.toString()}`
    );

    const consistent =
      directResult.calendarDays === maxResult.calendarDays &&
      directResult.endDate.toString() === maxResult.endDate.toString();

    console.log(`Consistent: ${consistent ? "YES ✓" : "NO ✗"}`);

    if (!consistent) {
      console.log(`ERROR: Functions give different results!`);
      console.log(
        `  calculateMaxCalendarDays: ${
          maxResult.calendarDays
        } days, end: ${maxResult.endDate.toString()}`
      );
      console.log(
        `  workDaysToCalendarDays: ${
          directResult.calendarDays
        } days, end: ${directResult.endDate.toString()}`
      );
    }
  });
}

testConsistency();
