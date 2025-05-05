import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader, MapPinnedIcon } from "lucide-react";
import { Input } from "../../components/Input.jsx";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/authStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { requestLocation } from "../../utils/location.js";
import { DropdownInput } from "../../components/Input.jsx";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/dateFormatter.js";
import { toTitleCase } from "../../utils/toTitleCase.js";

const ScheduleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //** SCHEDULE DATA STATE
  const [storedShiftId, setStoredShiftId] = useState("");
  const [storedOutpostId, setStoredOutpostId] = useState("");
  //** ZUSTAND FUNCTION
  const {
    userDetail,
    fetchUserDetail,
    isLoading: isUserLoading,
  } = useAuthStore();
  const {
    shift,
    shifts,
    fetchShiftDetail,
    fetchShifts,
    isLoading: isShiftLoading,
  } = useShiftStore();
  const {
    outpost,
    outposts,
    fetchOutposts,
    fetchOutpostDetail,
    isLoading: isOutpostLoading,
  } = useOutpostStore();
  const {
    schedule,
    fetchScheduleDetail,
    updateSchedule,
    isLoading: isScheduleLoading,
  } = useScheduleStore();

  useEffect(() => {
    fetchScheduleDetail(id);
    fetchShifts();
    fetchOutposts();
  }, [id, fetchScheduleDetail, fetchShifts, fetchOutposts]);

  useEffect(() => {
    if (schedule) {
      setStoredShiftId(schedule.shiftId || "");
      setStoredOutpostId(schedule.outpostId || "");
      fetchShiftDetail(schedule.shiftId || "");
      fetchUserDetail(schedule.userId || "");
      fetchOutpostDetail(schedule.outpostId || "");
    }
  }, [schedule]);

  const shiftOptions = shifts.map((shift) => ({
    label: shift.name,
    value: shift._id,
  }));
  const outpostOptions = outposts.map((outpost) => ({
    label: toTitleCase(outpost.name),
    value: outpost._id,
  }));

  if (
    isUserLoading ||
    isShiftLoading ||
    isOutpostLoading ||
    isScheduleLoading
  ) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSchedule(
      id,
      schedule.userId,
      storedOutpostId,
      storedShiftId,
      schedule.date
    );
    toast.success("Success update outpost detail");
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <form
      className="flex max-w-md w-full flex-col gap-5 p-4 bg-white rounded-lg mx-2"
      onSubmit={handleSubmit}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center justify-between"
      >
        <h6>Update Schedule</h6>
        <Button type="submit" buttonType="primary" buttonSize="medium">
          Save
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col w-full items-center justify-between"
      >
        <div className="flex flex-col w-full gap-3 p-3 mb-2 bg-gray-200 rounded-lg">
          <div className="grid grid-cols-5">
            <p>Name</p>
            <p>:</p>
            <p className="font-semibold col-span-3">
              {toTitleCase(userDetail?.firstName || "")}{" "}
              {toTitleCase(userDetail?.lastName || "")}
            </p>
          </div>

          <div className="grid grid-cols-5">
            {" "}
            <p>Outpost</p>
            <p>:</p>
            <p className="font-semibold col-span-3">
              {toTitleCase(outpost?.name || "")}
            </p>
          </div>

          <div className="grid grid-cols-5">
            <p>Shift</p>
            <p>:</p>
            <p className="font-semibold col-span-3">
              {toTitleCase(shift?.name)}
            </p>
          </div>

          <div className="grid grid-cols-5">
            <p>Date</p>
            <p>:</p>
            <p className="font-semibold col-span-3">
              {formatDate(schedule?.date)}
            </p>
          </div>
        </div>
        <DropdownInput
          label="Change shift to :"
          name="shift"
          value={storedShiftId}
          options={shiftOptions}
          placeholder="Select Shift"
          onChange={(e) => setStoredShiftId(e.target.value)}
        />
        <DropdownInput
          label="Change outpost to :"
          name="outpost"
          value={storedOutpostId}
          options={outpostOptions}
          placeholder="Select Shift"
          onChange={(e) => setStoredOutpostId(e.target.value)}
        />
      </motion.div>
    </form>
  );
};

export default ScheduleDetailPage;
