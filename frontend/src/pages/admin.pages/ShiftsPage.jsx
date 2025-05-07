import { useEffect, useState } from "react";
import { useShiftStore } from "../../../store/shiftStore.js";
import Button from "../../components/Button.jsx";
import { Trash2, PenBoxIcon, Plus, Loader } from "lucide-react";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { formatTime } from "../../utils/dateFormatter.js";
import Modal from "../../components/Modal.jsx";
import { DeleteConfirmationForm } from "../../components/DeleteConfirmationForm.jsx";
import ShiftProgressBar from "../../components/ShiftProgressBar.jsx";

const ShiftsPage = ({}) => {
  const { shifts, fetchShifts, isLoading, deleteShift } = useShiftStore();
  useEffect(() => {
    fetchShifts();
  }, []);

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    body: null,
  });
  const openModal = (title, body) =>
    setModalState({ isOpen: true, title, body });
  const closeModal = () =>
    setModalState({ isOpen: false, title: "", body: null });

  const handleDeleteAction = (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) {
      openModal(
        "Delete Shift",
        <DeleteConfirmationForm
          itemName={deleteButton.dataset.name}
          onDelete={deleteShift}
          itemId={deleteButton.dataset.id}
          onClose={closeModal}
          // redirect={navigate(-1)}
        />
      );
      return;
    }
  };

  if (isLoading) {
    return <Loader className="w-6h-6 animate-spin mx-auto" />;
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
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        body={modalState.body}
      />
      <div className="space-y-2" onClick={(e) => handleDeleteAction(e)}>
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
                <Button
                  className="delete-btn"
                  buttonType="danger"
                  buttonSize="icon"
                  icon={Trash2}
                  data-id={shift._id}
                  data-name={shift.name}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftsPage;
