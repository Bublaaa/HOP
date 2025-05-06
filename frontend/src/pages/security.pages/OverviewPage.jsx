import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useScheduleStore } from "../../../store/scheduleStore";
import { useAttendanceStore } from "../../../store/attendanceStore";
import { useOutpostStore } from "../../../store/outpostStore";
import { useShiftStore } from "../../../store/shiftStore";
import { formatTimeToHours } from "../../utils/dateFormatter";
import { getShiftStatus } from "../../utils/dateHelper";
import { toTitleCase } from "../../utils/toTitleCase";
import { Loader } from "lucide-react";
import Button from "../../components/Button";

const OverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    schedules,
    fetchScheduleToday,
    isLoading: isScheduleLoading,
  } = useScheduleStore();

  const {
    attendancesByScheduleId,
    fetchScheduleAttendance,
    isLoading: isAttendanceLoading,
  } = useAttendanceStore();
  const { outposts, fetchOutposts } = useOutpostStore();
  const { shifts, fetchShifts } = useShiftStore();

  useEffect(() => {
    if (user) {
      fetchScheduleToday(user._id);
      fetchOutposts();
      fetchShifts();
    }
  }, [user]);

  useEffect(() => {
    if (schedules.length) {
      schedules.forEach((schedule) => {
        fetchScheduleAttendance(schedule._id);
      });
    }
  }, [schedules]);

  const getOutpostName = (id) =>
    toTitleCase(outposts.find((outpost) => outpost._id === id)?.name || "-");

  const getShiftDetail = (id) => {
    const shift = shifts.find((s) => s._id === id);
    if (!shift) return "-";
    return `${toTitleCase(shift.name)} (${formatTimeToHours(
      shift.startTime
    )} - ${formatTimeToHours(shift.endTime)})`;
  };

  if (isScheduleLoading || isAttendanceLoading) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }

  return (
    <div className="flex max-w-3lg flex-col gap-5 bg-white rounded-lg mx-2 shadow-md">
      <div className="overflow-x-auto w-full rounded-lg ">
        <table className="table w-full text-sm">
          <thead className="bg-accent text-white">
            <tr>
              <th className="p-2">Clock In</th>
              <th className="p-2">Clock Out</th>
              <th className="p-2">Outpost</th>
              <th className="p-2">Shift</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => {
              const attendance = attendancesByScheduleId[schedule._id];
              const shift = shifts.find((s) => s._id === schedule.shiftId);
              const shiftStatus = shift
                ? getShiftStatus(shift.startTime, shift.endTime)
                : null;

              return (
                <tr key={schedule._id} className="odd:bg-gray-50 even:bg-white">
                  <td className="p-2 text-center">
                    {attendance?.clockIn ? "✅" : "❌"}
                  </td>
                  <td className="p-2 text-center">
                    {attendance?.clockOut ? "✅" : "❌"}
                  </td>
                  <td className="p-2">{getOutpostName(schedule.outpostId)}</td>
                  <td className="p-2">{getShiftDetail(schedule.shiftId)}</td>
                  <td className="p-2 text-center">
                    {!shift ? (
                      "-"
                    ) : !attendance ? (
                      (() => {
                        if (!shiftStatus) {
                          return (
                            <p className="text-red-400">No shift status</p>
                          );
                        }

                        switch (shiftStatus) {
                          case "ongoing":
                            return (
                              <Button
                                buttonType="primary"
                                onClick={() => navigate("/security/clock-in")}
                              >
                                Clock In
                              </Button>
                            );
                          case "about-to-start":
                            return (
                              <p className="text-yellow-600">
                                Shift about to start
                              </p>
                            );
                          case "not-started-yet":
                            return (
                              <p className="text-gray-500">
                                Shift not started yet
                              </p>
                            );
                          case "finished":
                            return (
                              <p className="text-gray-400">Shift finished</p>
                            );
                          default:
                            return (
                              <p className="text-red-400">
                                Unknown shift status
                              </p>
                            );
                        }
                      })()
                    ) : attendance.clockIn ? (
                      <Button
                        buttonType="secondary"
                        onClick={() => navigate("/security/clock-out")}
                      >
                        Clock Out
                      </Button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverviewPage;
