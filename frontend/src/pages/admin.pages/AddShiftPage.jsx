import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useShiftStore } from "../../../store/shiftStore.js";
import { Plus } from "lucide-react";
import { Input, TimeInput } from "../../components/Input.jsx";
import { motion } from "framer-motion";
import { formatTime, formatTimeToUTC } from "../../utils/dateFormatter.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import Button from "../../components/Button.jsx";

const ShiftsDetailPage = () => {
  const { createShift, isLoading } = useShiftStore();
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("1969-12-31T17:00:00.000Z");
  const [endTime, setEndTime] = useState("1969-12-31T17:00:00.000Z");
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createShift(name, startTime, endTime);
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const handleStartTimeChange = (date) => {
    console.log(formatTimeToUTC(date));
    setStartTime(formatTimeToUTC(date));
  };

  const handleEndTimeChange = (date) => {
    setEndTime(formatTimeToUTC(date));
  };

  return (
    <form
      className="flex max-w-md w-full flex-col gap-2 p-4 bg-white rounded-lg mx-2"
      onSubmit={handleSubmit}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center justify-between"
      >
        <h6>New Shift</h6>
        <Button
          type="submit"
          buttonType="primary"
          buttonSize="medium"
          icon={Plus}
        >
          Save
        </Button>
      </motion.div>
      {/* Shift Name */}
      <Input
        type="text"
        label={"Shift Name"}
        placeholder="Shift Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-5">
        {/* Start Time Picker */}
        <TimeInput
          label={"Start Time"}
          value={formatTime(startTime)}
          onChange={(e) => handleStartTimeChange(e.target.value)}
        />
        {/* End Time Picker */}
        <TimeInput
          label={"Start Time"}
          value={formatTime(endTime)}
          onChange={(e) => handleEndTimeChange(e.target.value)}
        />
      </div>
    </form>
  );
};

export default ShiftsDetailPage;
