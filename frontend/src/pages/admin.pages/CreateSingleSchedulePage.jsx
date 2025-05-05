import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/authStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { DropdownInput } from "../../components/Input.jsx";
import { formatDate } from "../../utils/dateFormatter.js";
import { toTitleCase } from "../../utils/toTitleCase.js";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";

const CreateSingleSchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const userId = searchParams.get("userId");
  const outpostId = searchParams.get("outpostId");
  const date = searchParams.get("date");

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
    createSchedule,
    isLoading: isScheduleLoading,
  } = useScheduleStore();

  //** LOAD INITIAL DATA
  useEffect(() => {
    fetchUserDetail(userId);
    fetchOutpostDetail(outpostId);
    fetchShifts();
  }, [fetchUserDetail, fetchOutpostDetail, fetchShifts]);

  //** DROPDOWNS OPTIONS
  const shiftOptions = shifts.map((shift) => ({
    label: shift.name,
    value: shift._id,
  }));

  //** SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !outpostId || !storedShiftId || !date) {
      toast.error("All fields are required");
      return;
    }
    await createSchedule(userId, outpostId, storedShiftId, date);
    toast.success("Success create single schedule");
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  //** LOADER
  if (
    isUserLoading ||
    isShiftLoading ||
    isOutpostLoading ||
    isScheduleLoading
  ) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }
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
        <h6>Create Schedule</h6>
        <Button
          type="submit"
          buttonType={`${!storedShiftId ? "disabled" : "primary"}`}
          buttonSize="medium"
          icon={Plus}
        >
          Add
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
            <p>Date</p>
            <p>:</p>
            <p className="font-semibold col-span-3">{formatDate(date)}</p>
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
      </motion.div>
    </form>
  );
};

export default CreateSingleSchedulePage;
