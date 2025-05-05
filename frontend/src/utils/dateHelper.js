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
