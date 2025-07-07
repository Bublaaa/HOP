import { useEffect, useState, useMemo } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

import { useAuthStore } from "../../../store/authStore.js";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { useAttendanceStore } from "../../../store/attendanceStore.js";

import { toTitleCase } from "../../utils/toTitleCase.js";
import { getDateRangeOfCurrentMonth } from "../../utils/dateHelper.js";
import AttendanceTable from "../../components/AttendanceTable.jsx";

const AttendancesPage = () => {
  //** Selected Outpost */
  const [selectedOutpost, setSelectedOutpost] = useState("");

  //** Zustand store */
  const {
    users,
    fetchAllSecurities,
    isLoading: isUserLoading,
  } = useAuthStore();
  const {
    outposts,
    fetchOutposts,
    isLoading: isOutpostLoading,
  } = useOutpostStore();
  const {
    schedules,
    fetchSchedules,
    isLoading: isScheduleLoading,
  } = useScheduleStore();
  const {
    attendances,
    fetchAttendances,
    isLoading: isAttendancesLoading,
  } = useAttendanceStore();

  //** Fetch all data in parallel */
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchOutposts(),
        fetchAllSecurities(),
        fetchSchedules(),
        fetchAttendances(),
      ]);
    };
    loadData();
  }, []);

  //** Auto-select first outpost */
  useEffect(() => {
    if (outposts?.length > 0) {
      setSelectedOutpost(outposts[0]);
    }
  }, [outposts]);

  //** Memoized date ranges */
  const { firstHalf, secondHalf } = useMemo(
    () => getDateRangeOfCurrentMonth(),
    []
  );

  //** Memoized props to reduce rerenders */
  const memoizedUsers = useMemo(() => users, [users]);
  const memoizedSchedules = useMemo(() => schedules, [schedules]);
  const memoizedAttendances = useMemo(() => attendances, [attendances]);

  //** Combined loading state */
  const isLoading =
    isUserLoading ||
    isOutpostLoading ||
    isScheduleLoading ||
    isAttendancesLoading;

  if (isLoading) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }

  return (
    <div className="flex max-w-6xl w-full flex-col gap-2 md:gap-5 gap-2 px-2 md:px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-fill items-center p-4 bg-white rounded-lg justify-between"
      >
        <h6>Manage Attendances</h6>
      </motion.div>

      {/* Outpost Selectors */}
      <div className="flex flex-wrap gap-2 w-full">
        {outposts.map((outpost) => (
          <div
            key={outpost._id}
            className={`flex p-3 rounded-lg shadow-md font-semibold hover:cursor-pointer ${
              selectedOutpost === outpost
                ? "bg-accent hover:bg-accent-hover text-white"
                : "bg-white hover:bg-gray-100 text-gray-500"
            }`}
            onClick={() => setSelectedOutpost(outpost)}
          >
            {toTitleCase(outpost.name)}
          </div>
        ))}
      </div>

      {/* Attendance Tables */}
      {memoizedUsers.length > 0 && selectedOutpost && (
        <div className="md:space-y-5 space-y-2">
          <AttendanceTable
            key={`first-${selectedOutpost._id}`}
            selectedOutpost={selectedOutpost}
            users={memoizedUsers}
            attendances={memoizedAttendances}
            schedules={memoizedSchedules}
            dateRange={firstHalf}
            action="edit"
          />
          <AttendanceTable
            key={`second-${selectedOutpost._id}`}
            selectedOutpost={selectedOutpost}
            users={memoizedUsers}
            attendances={memoizedAttendances}
            schedules={memoizedSchedules}
            dateRange={secondHalf}
            action="edit"
          />
        </div>
      )}
    </div>
  );
};

export default AttendancesPage;
