export const getDateRangeOfCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d.getTime())); // clone to avoid reference issue
  }

  const mayDates = dates.filter((date) => date.getMonth() === 4); // 4 = May
  const middleIndex = Math.floor(mayDates.length / 2);
  const firstHalf = mayDates.slice(0, middleIndex);
  const secondHalf = mayDates.slice(middleIndex);

  return { firstHalf, secondHalf };
};
