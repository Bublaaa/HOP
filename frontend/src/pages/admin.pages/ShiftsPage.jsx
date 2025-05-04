import { useEffect } from "react";
import { useShiftStore } from "../../../store/shiftStore.js";
import Button from "../../components/Button.jsx";
import { Trash2, PenBoxIcon, Plus } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { formatTime } from "../../utils/dateFormatter.js";

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

const ShiftsPage = ({}) => {
  const { shifts, fetchShifts, isLoading } = useShiftStore();
  useEffect(() => {
    fetchShifts();
  }, []);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex max-w-md w-full flex-col gap-2 mx-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center p-4 bg-white rounded-lg justify-between"
      >
        <h6>Manage Shift</h6>
        <NavLink to={"/admin/add-shift"}>
          <Button buttonType="primary" buttonSize="medium" icon={Plus}>
            Add Shift
          </Button>
        </NavLink>
      </motion.div>
      {shifts.map((shift, index) => {
        return (
          <motion.div
            key={shift._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 * (index + 1) }}
            className="grid grid-cols-4 items-center p-3 rounded-lg bg-white hover:bg-gray-100"
          >
            <div>{toTitleCase(shift.name)}</div>
            <div className="col-span-2 flex flex-col gap-2 items-center">
              <p>
                {formatTime(shift.startTime)}-{formatTime(shift.endTime)}
              </p>
              <ShiftProgressBar
                startTime={shift.startTime}
                endTime={shift.endTime}
              />
            </div>
            <div className="flex flex-row justify-end gap-2">
              <NavLink to={`/admin/shifts/${shift._id}`}>
                <Button
                  buttonType="secondary"
                  buttonSize="icon"
                  icon={PenBoxIcon}
                />
              </NavLink>
              <Button buttonType="danger" buttonSize="icon" icon={Trash2} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ShiftsPage;
