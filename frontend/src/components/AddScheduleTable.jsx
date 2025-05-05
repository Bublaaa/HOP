import { useEffect, useState } from "react";
import { DropdownInput } from "./Input.jsx";

const AddScheduleTable = ({ users, shifts, scheduleData, setScheduleData }) => {
  //** WEEK DATES
  const [weekDates, setWeekDates] = useState([]);

  //** ADDING DAY NAME ARRAY INTO WEEK DATES
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

  //** RESTRUCTURE SHIFT INTO SHIFT OPTION
  const shiftOptions = shifts.map((shift) => ({
    label: shift.name,
    value: shift._id,
  }));

  //** HANDLE DROPDOWN SELECT
  const handleSelect = (e, date, userId) => {
    const shiftId = e.target.value;
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    //** ADDING SCHEDULE DATA TO SCHEDULE IN WEEK
    setScheduleData((prev) => {
      return prev.map((item) => {
        if (item.userId !== userId) return item;
        const scheduleInWeek = Array.isArray(item.scheduleInWeek)
          ? item.scheduleInWeek
          : [];
        const dayIndex = scheduleInWeek.findIndex(
          (entry) => Object.keys(entry)[0] === dayName
        );
        let newScheduleInWeek = [...scheduleInWeek];
        if (dayIndex > -1) {
          newScheduleInWeek[dayIndex] = { [dayName]: shiftId };
        } else {
          newScheduleInWeek.push({ [dayName]: shiftId });
        }
        return {
          ...item,
          scheduleInWeek: newScheduleInWeek,
        };
      });
    });
  };

  return (
    <div>
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
                    <DropdownInput
                      label=""
                      name="position"
                      value={selectedShiftId}
                      options={shiftOptions}
                      placeholder="Select Shift"
                      onChange={(e) => handleSelect(e, date, user._id)}
                    />
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
