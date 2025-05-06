import { formatTime } from "./dateFormatter";

export const getDateRangeOfCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0 = January)

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d)); // Copy to avoid mutation
  }

  const middleIndex = Math.floor(dates.length / 2);
  const firstHalf = dates.slice(0, middleIndex);
  const secondHalf = dates.slice(middleIndex);

  return { firstHalf, secondHalf, dates };
};

export const getShiftStatus = (startTime, endTime) => {
  const getTimeInMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    console.log(hours, minutes);
    return hours * 60 + minutes;
  };

  const now = new Date();
  const nowTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  const startTimeInMinutes = getTimeInMinutes(formatTime(startTime));
  let convertedEndTime = "";
  if (formatTime(endTime) === "00:00") {
    convertedEndTime = "24:01";
  } else {
    convertedEndTime = formatTime(endTime);
  }
  const endTimeInMinutes = getTimeInMinutes(convertedEndTime);
  const adjustedEndTime = endTime === "00:00" ? 1440 : endTimeInMinutes;

  if (nowTimeInMinutes < startTimeInMinutes - 15) {
    return "not-started-yet";
  } else if (
    nowTimeInMinutes >= startTimeInMinutes - 15 &&
    nowTimeInMinutes < adjustedEndTime
  ) {
    return "ongoing";
  } else if (nowTimeInMinutes >= adjustedEndTime) {
    return "finished";
  }

  return "unknown";
};
