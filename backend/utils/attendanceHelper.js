export const generateAttendanceSession = (shifts = []) => {
  const now = new Date();

  for (const shift of shifts) {
    // Ensure times are strings in "HH:mm" format
    const startTime =
      typeof shift.startTime === "string"
        ? shift.startTime
        : new Date(shift.startTime).toTimeString().slice(0, 5); // fallback if it's a Date object

    const endTime =
      typeof shift.endTime === "string"
        ? shift.endTime
        : new Date(shift.endTime).toTimeString().slice(0, 5); // fallback if it's a Date object

    // Parse times into today's Date objects
    const start = new Date();
    const [startHour, startMinute] = startTime.split(":").map(Number);
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    const [endHour, endMinute] = endTime.split(":").map(Number);
    end.setHours(endHour, endMinute, 0, 0);

    // Handle overnight shift (e.g. 22:00 - 06:00)
    if (end < start) {
      if (now >= start || now <= end) {
        return shift.name;
      }
    } else {
      if (now >= start && now <= end) {
        return shift.name;
      }
    }
  }

  return null; // No active shift
};
