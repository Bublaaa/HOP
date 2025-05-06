import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input.jsx";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import { toast } from "react-hot-toast";
import Button from "../../components/Button.jsx";
import ShiftProgressBar from "../../components/ShiftProgressBar.jsx";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { formatTime } from "../../utils/dateFormatter.js";

const ClockInPage = () => {
  const { user } = useAuthStore();
  const { schedules, fetchScheduleToday } = useScheduleStore();
  const { shifts, fetchShifts } = useShiftStore();
  const { outposts, fetchOutposts } = useOutpostStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchScheduleToday(user._id);
      fetchOutposts();
      fetchShifts();
    }
  }, [user, fetchScheduleToday, fetchOutposts, fetchShifts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-2"
    >
      <div className="p-8 flex flex-col  gap-5">
        <h5 className="mb-6 text-center bg-clip-text">Clock In</h5>

        {schedules.map((schedule) => {
          const outpost = outposts.find((o) => o._id === schedule.outpostId);
          const shift = shifts.find((s) => s._id === schedule.shiftId);

          return (
            <div
              className="grid grid-cols-2 gap-5 items-center text-center"
              key={schedule._id}
            >
              <p>{toTitleCase(outpost?.name) ?? "Unknown Outpost"}</p>
              <div className="flex flex-col items-center">
                <p>{toTitleCase(shift?.name) ?? "Unknown Shift"}</p>
                <p>
                  {formatTime(shift?.startTime)} - {formatTime(shift?.endTime)}
                </p>
                <ShiftProgressBar
                  startTime={shift?.startTime}
                  endTime={shift?.endTime}
                />
              </div>
            </div>
          );
        })}

        <div className="space-y-5">
          <Button
            buttonSize="large"
            buttonType="primary"
            type="submit"
            className="w-full"
          >
            Save
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
export default ClockInPage;
