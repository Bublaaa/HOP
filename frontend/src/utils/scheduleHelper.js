import { formatDate } from "./dateFormatter";

export const findScheduleId = (schedules, userId, outpostId, shiftId) => {
  const now = new Date();
  if (!Array.isArray(schedules)) return null;

  const match = schedules.find(
    (schedule) =>
      schedule.outpostId == outpostId &&
      schedule.shiftId == shiftId &&
      schedule.userId == userId &&
      formatDate(schedule.date) == formatDate(now)
  );

  return match ? match._id : null;
};
