import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { toTitleCase } from "../../utils/toTitleCase.js";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore.js";
import { getDateRangeOfCurrentMonth } from "../../utils/dateHelper.js";
import AddScheduleTable from "../../components/AddScheduleTable.jsx";

const AddSchedulePage = () => {
  //** REDIRECT
  const navigate = useNavigate();

  //** ZUSTAND FUNCTION
  const {
    users,
    fetchAllSecurities,
    isLoading: isUserLoading,
  } = useAuthStore();
  const { shifts, fetchShifts, isLoading: isShiftLoading } = useShiftStore();
  const {
    outposts,
    fetchOutposts,
    isLoading: isOutpostLoading,
  } = useOutpostStore();
  const {
    schedules,
    fetchSchedules,
    createSchedule,
    deleteSchedule,
    isLoading: isScheduleLoading,
  } = useScheduleStore();

  //** FETCHING ALL DATA
  useEffect(() => {
    fetchSchedules();
    fetchAllSecurities();
    fetchShifts();
    fetchOutposts();
  }, [fetchOutposts, fetchShifts, fetchAllSecurities, fetchSchedules]);

  //** UPDATING THE SELECTED OUTPOST STATE
  useEffect(() => {
    if (outposts && outposts.length > 0) {
      const firstOutpost = outposts[0];
      setSelectedOutpost(firstOutpost);
    }
  }, [outposts]);

  //** IS SCHEDULE CHANGE STATE
  const [isScheduleDataChange, setIsScheduleDataChange] = useState(false);

  //** SELECTED OUTPOST STATE
  const [selectedOutpost, setSelectedOutpost] = useState("");

  //** SCHEDULE DATA STATE
  const [scheduleData, setScheduleData] = useState([
    {
      outpostId: "",
      userId: "",
      scheduleInWeek: [],
    },
  ]);
  useEffect(() => {
    if (outposts.length > 0 && users.length > 0) {
      setScheduleData(
        outposts
          .map((outpost) =>
            users.map((user) => ({
              outpostId: outpost._id,
              userId: user._id,
              scheduleInWeek: [],
            }))
          )
          .flat()
      );
    }
  }, [outposts, users]);

  useEffect(() => {
    const hasChanges = scheduleData.some(
      (schedule) =>
        Array.isArray(schedule.scheduleInWeek) &&
        schedule.scheduleInWeek.length > 0
    );
    setIsScheduleDataChange(hasChanges);
  }, [scheduleData]);

  //** CHECKING DUPLICATES
  const isScheduleAlreadyExists = (existingSchedules, newSchedule) => {
    return existingSchedules.some((schedule) => {
      return (
        schedule.userId === newSchedule.userId &&
        schedule.outpostId === newSchedule.outpostId &&
        schedule.shiftId === newSchedule.shiftId &&
        new Date(schedule.date).toISOString() === newSchedule.date
      );
    });
  };

  //** SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dates } = getDateRangeOfCurrentMonth();
    if (!isScheduleDataChange) return;

    try {
      for (const date of dates) {
        const currentDateDayName = new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
        });

        for (const schedule of scheduleData) {
          const shiftIdForDay = schedule.scheduleInWeek.find(
            (entry) => Object.keys(entry)[0] === currentDateDayName
          )?.[currentDateDayName];

          if (!shiftIdForDay) continue;

          const newSchedule = {
            userId: schedule.userId,
            outpostId: schedule.outpostId,
            shiftId: shiftIdForDay,
            date: new Date(date).toISOString(),
          };

          if (isScheduleAlreadyExists(schedules, newSchedule)) {
            continue;
          }
          await createSchedule(
            newSchedule.userId,
            newSchedule.outpostId,
            newSchedule.shiftId,
            newSchedule.date
          );
        }
      }

      toast.success("Schedule successfully created");
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create schedule");
    }
  };

  const today = new Date(Date.now());

  //** IS LOADING EXCEPTION
  if (
    isUserLoading ||
    isShiftLoading ||
    isOutpostLoading ||
    isScheduleLoading
  ) {
    return <Loader className="w-6h-6 animate-spin mx-auto" />;
  }
  return (
    <form
      className="flex max-w-5xl w-full flex-col gap-5 p-4 bg-white rounded-lg mx-2"
      onSubmit={handleSubmit}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center justify-between"
      >
        <h6>
          Create Attendance For{" "}
          {today.toLocaleString("default", { month: "long", year: "numeric" })}
        </h6>
        <Button
          type="submit"
          buttonSize="medium"
          buttonType={isScheduleDataChange ? "primary" : "disabled"}
          icon={Plus}
        >
          Save
        </Button>
      </motion.div>
      <div className="flex flex-wrap gap-2 w-full">
        {outposts.map((outpost, index) => {
          return (
            <div
              key={index}
              className={`flex p-3 rounded-lg shadow-md font-semibold ${
                selectedOutpost === outpost
                  ? "bg-accent hover:bg-accent-hover text-white"
                  : "bg-white hover:bg-gray-100 text-gray-500 "
              }`}
              onClick={() => setSelectedOutpost(outpost)}
            >
              {toTitleCase(outpost.name)}
            </div>
          );
        })}
      </div>
      <AddScheduleTable
        users={users}
        shifts={shifts}
        schedules={schedules}
        scheduleData={scheduleData.filter(
          (schedule) => schedule.outpostId == selectedOutpost._id
        )}
        setScheduleData={(updatedScheduleInWeek, userId) =>
          setScheduleData((prev) =>
            prev.map((item) =>
              item.outpostId === selectedOutpost._id && item.userId === userId
                ? { ...item, scheduleInWeek: updatedScheduleInWeek }
                : item
            )
          )
        }
        selectedOutpostId={selectedOutpost._id}
      />
    </form>
  );
};

export default AddSchedulePage;
