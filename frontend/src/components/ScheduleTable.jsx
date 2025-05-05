import { formatDate, formatTimeToHours } from "../utils/dateFormatter";
import ShiftProgressBar from "./ShiftProgressBar";
import { NavLink } from "react-router-dom";

const ScheduleTable = ({
  selectedOutpost,
  users,
  shifts,
  schedules,
  dateRange,
}) => {
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
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="odd:bg-gray-100 even:bg-gray-50">
              <td className="p-2 font-medium whitespace-nowrap">
                {user.firstName} {user.lastName}
              </td>
              {dateRange.map((date) => {
                const schedule = schedulesByOutpost.find(
                  (s) =>
                    s.userId === user._id &&
                    formatDate(new Date(s.date)) === formatDate(date)
                );
                if (schedule) {
                  const shift = shifts.find(
                    (shift) => shift._id === schedule.shiftId
                  );
                  return (
                    <td
                      key={date.toISOString()}
                      className="p-2 text-center hover:bg-gray-200 hover:cursor-pointer"
                    >
                      <NavLink to={`/admin/schedule/${schedule._id}`}>
                        <div className="font-semibold">
                          {shift?.name
                            ? shift.name.charAt(0).toUpperCase()
                            : "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeToHours(shift?.startTime)} -{" "}
                          {formatTimeToHours(shift?.endTime)}
                        </div>
                        <ShiftProgressBar
                          startTime={shift?.startTime}
                          endTime={shift?.endTime}
                        />
                      </NavLink>
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={date.toISOString()}
                      className="text-center hover:bg-gray-200 hover:cursor-pointer"
                    >
                      <NavLink
                        to={`/admin/add-schedule?userId=${user._id}&outpostId=${
                          selectedOutpost._id
                        }&date=${date.toISOString()}`}
                      >
                        <div className="w-full h-full flex py-5">
                          <p className="w-full text-center items-center">-</p>
                        </div>
                      </NavLink>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
