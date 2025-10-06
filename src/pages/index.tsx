import AllCalendars from "../components/all-calendars";
import HolidayInfo from "../components/holiday-info";
import WorkDaysCalc from "../components/work-days-calc";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-8">
      <h1 className="text-xl md:text-3xl font-bold my-4">
        Colombian Holiday Calendar
      </h1>
      <AllCalendars />
      <div className="mt-8 container flex gap-4 items-center justify-center border-red-500">
        <HolidayInfo />
        <WorkDaysCalc />
      </div>
    </div>
  );
}

export default Home;
