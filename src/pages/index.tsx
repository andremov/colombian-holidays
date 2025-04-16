import AllCalendars from "../components/all-calendars";
import HolidayInfo from "../components/holiday-info";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl md:text-3xl font-bold my-4">
        Colombian Holiday Calendar
      </h1>
      <AllCalendars />
      <HolidayInfo />
    </div>
  );
}

export default Home;
