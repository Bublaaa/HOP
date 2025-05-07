import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "../utils/dateFormatter";
import toast from "react-hot-toast";

const AttendanceTable = ({
  selectedOutpost,
  users,
  attendances,
  schedules,
  dateRange,
}) => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "on time":
        return "text-green-600";
      case "late":
        return "text-yellow-600";
      case "early":
        return "text-blue-600";
      case "absent":
      case "invalid":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md scrollbar-hidden">
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

            if (!cell) {
              toast.error("Attendance data is empty");
              return;
            }

            const targetUrl = cell.dataset.navigate;
            navigate(targetUrl);
          }}
        >
          {users.map((user) => (
            <tr key={user._id}>
              <td className="p-2 font-medium whitespace-nowrap">
                {user.firstName} {user.lastName}
              </td>
              {dateRange.map((date) => {
                const schedule = schedules.find(
                  (s) =>
                    s.userId === user._id &&
                    s.outpostId === selectedOutpost._id &&
                    formatDate(new Date(s.date)) === formatDate(date)
                );

                const attendance = schedule
                  ? attendances.find((a) => a.scheduleId === schedule?._id)
                  : null;

                const url = attendance
                  ? `/admin/attendance/${attendance?._id}`
                  : null;
                return (
                  <td
                    key={date.toISOString()}
                    className="p-2 min-w-[100px] text-center hover:bg-gray-200 hover:cursor-pointer"
                    data-navigate={url || undefined}
                  >
                    {attendance ? (
                      <div>
                        <div
                          className={`font-semibold ${getStatusColor(
                            attendance.status
                          )}`}
                        >
                          {attendance.status}
                        </div>
                        <div className="grid grid-cols-3 items-center">
                          <div className="text-xs flex flex-col text-gray-500">
                            <div>In</div>
                            {formatTime(attendance.clockIn)}{" "}
                          </div>
                          <div>-</div>
                          <div className="text-xs flex flex-col text-gray-500">
                            <div>Out</div>
                            {attendance.clockOut
                              ? formatTime(attendance.clockOut)
                              : "—"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        {new Date(date) < new Date(new Date().toDateString())
                          ? "Empty"
                          : "—"}
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

export default AttendanceTable;
