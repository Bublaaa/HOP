import dayjs from "dayjs";

const ShiftProgressBar = ({ startTime, endTime }) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const totalMinutes = 1440;
  const startMin = start.hour() * 60 + start.minute();
  const endMin = end.hour() * 60 + end.minute();
  const isOvernight = endMin <= startMin;
  const getPercent = (minutes) => (minutes / totalMinutes) * 100;
  return (
    <div className="relative w-full h-3 bg-gray-200 rounded-full">
      {isOvernight ? (
        <>
          <div
            className="absolute h-full bg-accent shadow-accent shadow-sm rounded-full"
            style={{
              left: `${getPercent(startMin)}%`,
              width: `${getPercent(totalMinutes - startMin)}%`,
            }}
          />
          <div
            className="absolute h-full bg-accent shadow-accent shadow-sm rounded-full"
            style={{
              left: `0%`,
              width: `${getPercent(endMin)}%`,
            }}
          />
        </>
      ) : (
        <div
          className="absolute h-full bg-accent shadow-accent shadow-sm rounded-full"
          style={{
            left: `${getPercent(startMin)}%`,
            width: `${getPercent(endMin - startMin)}%`,
          }}
        />
      )}
    </div>
  );
};
export default ShiftProgressBar;
