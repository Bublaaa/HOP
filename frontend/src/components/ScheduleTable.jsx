import { useNavigate } from "react-router-dom";
import { formatDate, formatTimeToHours } from "../utils/dateFormatter";
import ShiftProgressBar from "./ShiftProgressBar";

const ScheduleTable = ({
  selectedOutpost,
  users,
  shifts,
  schedules,
  dateRange,
  action,
}) => {
  const navigate = useNavigate();

  const schedulesByOutpost = schedules.filter(
    (schedule) => schedule.outpostId === selectedOutpost._id
  );

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="table w-full text-sm">
        <thead className="bg-accent text-white">
          <tr>
            <th className="p-2">User</th>
            {dateRange.map((date) => (
              <th
                key={date.toISOString()}
                className="p-2 text-center hover:cursor-pointer hover:bg-accent-hover"
              >
                {formatDate(date).slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          onClick={(e) => {
            const cell = e.target.closest("td[data-navigate]");
            if (!cell) return;

            const targetUrl = cell.dataset.navigate;
            if (targetUrl) {
              navigate(targetUrl);
            }
          }}
        >
          {users.map((user) => (
            <tr key={user._id}>
              <td className="p-2 font-medium whitespace-nowrap">
                {user.firstName} {user.lastName}
              </td>
              {dateRange.map((date) => {
                const schedule = schedulesByOutpost.find(
                  (s) =>
                    s.userId === user._id &&
                    formatDate(new Date(s.date)) === formatDate(date)
                );

                const shift = schedule
                  ? shifts.find((shift) => shift._id === schedule.shiftId)
                  : null;

                const updateUrl =
                  schedule && action === "edit"
                    ? `/admin/schedule/${schedule._id}`
                    : null;

                const createUrl =
                  !schedule && action === "edit"
                    ? `/admin/add-schedule?userId=${user._id}&outpostId=${
                        selectedOutpost._id
                      }&date=${date.toISOString()}`
                    : null;

                const url = updateUrl || createUrl;

                return (
                  <td
                    key={date.toISOString()}
                    className="p-2 text-center hover:bg-gray-200 hover:cursor-pointer"
                    data-navigate={url || undefined}
                  >
                    {shift ? (
                      <div>
                        <div className="font-semibold">
                          {shift.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeToHours(shift.startTime)} -{" "}
                          {formatTimeToHours(shift.endTime)}
                        </div>
                        <ShiftProgressBar
                          startTime={shift.startTime}
                          endTime={shift.endTime}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex py-5">
                        <p className="w-full text-center items-center">-</p>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
