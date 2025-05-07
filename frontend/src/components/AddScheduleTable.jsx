import { useEffect, useState } from "react";
import { DropdownInput } from "./Input.jsx";
import { getDateRangeOfCurrentMonth } from "../utils/dateHelper.js";

const AddScheduleTable = ({
  users,
  shifts,
  schedules,
  scheduleData,
  setScheduleData,
  selectedOutpostId,
}) => {
  const [weekDates, setWeekDates] = useState([]);
  const [fullScheduledUsers, setFullScheduledUsers] = useState([]);
  const { dates: monthDates } = getDateRangeOfCurrentMonth();
  useEffect(() => {
    const fullyScheduled = users.filter((user) => {
      const userSchedules = schedules.filter(
        (s) => s.userId === user._id && s.outpostId === selectedOutpostId
      );

      const scheduledDates = userSchedules.map(
        (s) => new Date(s.date).toISOString().split("T")[0]
      );

      // Compare to see if all dates of the month are scheduled
      return monthDates.every((date) =>
        scheduledDates.includes(date.toISOString().split("T")[0])
      );
    });

    setFullScheduledUsers(fullyScheduled.map((u) => u._id));
  }, [users, schedules, selectedOutpostId]);

  // Set current week
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
    setWeekDates(dates);
  }, [users, shifts]);

  const shiftOptions = shifts.map((shift) => ({
    label: shift.name,
    value: shift._id,
  }));

  const handleSelect = (e, date, userId) => {
    const shiftId = e.target.value;
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const scheduleForUser = scheduleData.find((s) => s.userId === userId);
    const oldSchedule = Array.isArray(scheduleForUser?.scheduleInWeek)
      ? scheduleForUser.scheduleInWeek
      : [];

    const dayIndex = oldSchedule.findIndex(
      (entry) => Object.keys(entry)[0] === dayName
    );

    let newScheduleInWeek = [...oldSchedule];
    if (dayIndex > -1) {
      newScheduleInWeek[dayIndex] = { [dayName]: shiftId };
    } else {
      newScheduleInWeek.push({ [dayName]: shiftId });
    }

    setScheduleData(newScheduleInWeek, userId);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md scrollbar-hidden">
      <table className="table w-full h-full text-sm">
        <thead className="bg-accent text-white">
          <tr>
            <th className="p-2">Security</th>
            {weekDates.map((date) => (
              <th key={date.toISOString()} className="p-2 text-center">
                {date.toLocaleDateString("id-ID", { weekday: "long" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="p-2 font-medium whitespace-nowrap">
                {user.firstName} {user.lastName}
              </td>
              {weekDates.map((date) => {
                const dayName = new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                });

                const scheduleForUser = scheduleData.find(
                  (s) => s.userId === user._id
                );

                const scheduleInWeek = Array.isArray(
                  scheduleForUser?.scheduleInWeek
                )
                  ? scheduleForUser.scheduleInWeek
                  : [];

                const found = scheduleInWeek.find(
                  (entry) => Object.keys(entry)[0] === dayName
                );

                const selectedShiftId = found ? found[dayName] : "";

                return (
                  <td key={date.toISOString()} className="p-2">
                    {fullScheduledUsers.includes(user._id) ? (
                      <span className="text-gray-400 text-xs italic">
                        Scheduled
                      </span>
                    ) : (
                      <DropdownInput
                        label=""
                        name="position"
                        value={selectedShiftId}
                        options={shiftOptions}
                        placeholder="Select Shift"
                        onChange={(e) => handleSelect(e, date, user._id)}
                      />
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

export default AddScheduleTable;
