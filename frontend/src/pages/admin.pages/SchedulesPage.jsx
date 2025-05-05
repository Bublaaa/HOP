import { useEffect, useState } from "react";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { Plus, Loader } from "lucide-react";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { DeleteConfirmationForm } from "../../components/DeleteConfirmationForm.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import { useAuthStore } from "../../../store/authStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useOutpostStore } from "../../../store/outpostStore";
import ScheduleTable from "../../components/ScheduleTable.jsx";
import { getDateRangeOfCurrentMonth } from "../../utils/dateHelper.js";

const SchedulesPage = ({}) => {
  //** SELECTED OUTPOST
  const [selectedOutpost, setSelectedOutpost] = useState("");

  //** ZUSTAND FUNCTION
  const { users, fetchAllUsers, isLoading: isUserLoading } = useAuthStore();
  const { shifts, fetchShifts, isLoading: isShiftLoading } = useShiftStore();
  const {
    outposts,
    fetchOutposts,
    isLoading: isOutpostLoading,
  } = useOutpostStore();
  const {
    schedules,
    fetchSchedules,
    deleteSchedule,
    isLoading: isScheduleLoading,
  } = useScheduleStore();

  //** FETCHING ALL DATA
  useEffect(() => {
    fetchSchedules();
    fetchAllUsers();
    fetchShifts();
    fetchOutposts();
  }, [fetchOutposts, fetchShifts, fetchAllUsers, fetchSchedules]);

  //** UPDATING THE SELECTED OUTPOST STATE
  useEffect(() => {
    if (outposts && outposts.length > 0) {
      setSelectedOutpost(outposts[0]);
    }
  }, [outposts]);

  //** GET THIS MONTH DATES RANGE
  const { firstHalf, secondHalf } = getDateRangeOfCurrentMonth();

  //** MODAL CONTROLLER
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    body: null,
  });
  const openModal = (title, body) =>
    setModalState({ isOpen: true, title, body });
  const closeModal = () =>
    setModalState({ isOpen: false, title: "", body: null });

  //** HANDLING DELETE ACTION
  const handleDeleteAction = (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) {
      openModal(
        "Delete Schedule",
        <DeleteConfirmationForm
          itemName={deleteButton.dataset.name}
          onDelete={deleteSchedule}
          itemId={deleteButton.dataset.id}
          onClose={closeModal}
          // redirect={navigate(-1)}
        />
      );
      return;
    }
  };

  //** IS LOADING EXCEPTION
  if (
    isUserLoading ||
    isShiftLoading ||
    isOutpostLoading ||
    isScheduleLoading
  ) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }
  return (
    <div className="flex max-w-6xl w-full flex-col gap-2 mx-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center p-4 bg-white rounded-lg justify-between"
      >
        <h6>Manage Schedules</h6>
        <NavLink to={"/admin/add-schedule"}>
          <Button buttonType="primary" buttonSize="medium" icon={Plus}>
            Add Schedule
          </Button>
        </NavLink>
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

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        body={modalState.body}
      />

      <div className="space-y-2" onClick={(e) => handleDeleteAction(e)}>
        <ScheduleTable
          selectedOutpost={selectedOutpost}
          users={users}
          shifts={shifts}
          schedules={schedules}
          dateRange={firstHalf}
        />
        <ScheduleTable
          selectedOutpost={selectedOutpost}
          users={users}
          shifts={shifts}
          schedules={schedules}
          dateRange={secondHalf}
        />
      </div>
    </div>
  );
};

export default SchedulesPage;
