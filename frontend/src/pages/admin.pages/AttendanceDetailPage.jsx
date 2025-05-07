import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/authStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { useAttendanceStore } from "../../../store/attendanceStore.js";
import {
  DropdownInput,
  Input,
  TextareaInput,
  TimeInput,
} from "../../components/Input.jsx";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";
import { toTitleCase } from "../../utils/toTitleCase.js";
import {
  formatDate,
  formatTime,
  formatTimeToUTC,
} from "../../utils/dateFormatter.js";

const AttendanceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [latitudeIn, setLatitudeIn] = useState(0);
  const [longitudeIn, setLongitudeIn] = useState(0);
  const [latitudeOut, setLatitudeOut] = useState(0);
  const [longitudeOut, setLongitudeOut] = useState(0);
  const [report, setReport] = useState("");
  const [status, setStatus] = useState("");

  const {
    userDetail,
    fetchUserDetail,
    isLoading: isUserLoading,
  } = useAuthStore();
  const {
    shifts,
    fetchShifts,
    shift,
    fetchShiftDetail,
    isLoading: isShiftLoading,
  } = useShiftStore();
  const {
    outposts,
    fetchOutposts,
    outpost,
    fetchOutpostDetail,
    isLoading: isOutpostLoading,
  } = useOutpostStore();
  const {
    schedule,
    fetchScheduleDetail,
    isLoading: isScheduleLoading,
  } = useScheduleStore();
  const {
    attendance,
    fetchAttendanceDetail,
    updateAttendance,
    isLoading: isAttendanceLoading,
  } = useAttendanceStore();

  useEffect(() => {
    fetchAttendanceDetail(id);
    fetchShifts();
    fetchOutposts();
  }, [id]);

  useEffect(() => {
    if (attendance?.scheduleId) {
      fetchScheduleDetail(attendance.scheduleId);
    }
  }, [attendance?.scheduleId]);

  useEffect(() => {
    if (schedule) {
      fetchShiftDetail(schedule.shiftId);
      fetchUserDetail(schedule.userId);
      fetchOutpostDetail(schedule.outpostId);
    }
  }, [schedule]);

  useEffect(() => {
    if (attendance) {
      setClockIn(attendance.clockIn || "");
      setClockOut(attendance.clockOut || "");
      setLatitudeIn(attendance.latitudeIn || "");
      setLongitudeIn(attendance.longitudeIn || "");
      setLatitudeOut(attendance.latitudeOut || "");
      setLongitudeOut(attendance.longitudeOut || "");
      setReport(attendance.report || "");
      setStatus(attendance.status || "");
    }
  }, [attendance]);

  const statusOptions = ["early", "on time", "late", "absent", "invalid"].map(
    (s) => ({ value: s, label: toTitleCase(s) })
  );

  const handleClockInChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setClockIn(formatTimeToUTC(value));
  };

  const handleClockOutChange = (e) => {
    const value = e.target.value;
    setClockOut(formatTimeToUTC(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAttendance(
        id,
        attendance?.scheduleId,
        clockIn,
        clockOut,
        report,
        latitudeIn,
        longitudeIn,
        latitudeOut,
        longitudeOut,
        status
      );

      toast.success("Attendance updated successfully.");
      navigate(-1);
    } catch (error) {
      toast.error("Update failed. Please check your input.");
    }
  };

  const isLoading =
    isUserLoading ||
    isShiftLoading ||
    isOutpostLoading ||
    isScheduleLoading ||
    isAttendanceLoading;

  if (isLoading || !attendance || !schedule) {
    return <Loader className="w-6 h-6 animate-spin mx-auto mt-10" />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md w-full flex-col gap-5 p-4 bg-white rounded-lg mx-2"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-row w-full items-center justify-between"
      >
        <h6>Edit Attendance</h6>
        <Button type="submit" buttonType="primary" buttonSize="medium">
          Save
        </Button>
      </motion.div>

      <div className="p-4 bg-gray-100 rounded-lg space-y-2">
        <InfoRow label="Name">
          {toTitleCase(userDetail?.firstName)}{" "}
          {toTitleCase(userDetail?.lastName)}
        </InfoRow>
        <InfoRow label="Outpost">{toTitleCase(outpost?.name)}</InfoRow>
        <InfoRow label="Shift">{toTitleCase(shift?.name)}</InfoRow>
        <InfoRow label="Date">{formatDate(schedule?.date)}</InfoRow>
      </div>

      <DropdownInput
        label="Status"
        name="status"
        value={status}
        options={statusOptions}
        onChange={(e) => setStatus(e.target.value)}
      />

      <TimeInput
        label="Clock In"
        name="clockIn"
        value={formatTime(clockIn)}
        onChange={handleClockInChange}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Latitude In"
          type="number"
          name="latitudeIn"
          value={latitudeIn}
          onChange={(e) => setLatitudeIn(e.target.value)}
        />
        <Input
          label="Longitude In"
          type="number"
          name="longitudeIn"
          value={longitudeIn}
          onChange={(e) => setLongitudeIn(e.target.value)}
        />
      </div>

      <TimeInput
        label="Clock Out"
        name="clockOut"
        value={formatTime(clockOut)}
        onChange={handleClockOutChange}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Latitude Out"
          type="number"
          name="latitudeOut"
          value={latitudeOut}
          onChange={(e) => setLatitudeOut(e.target.value)}
        />
        <Input
          label="Longitude Out"
          type="number"
          name="longitudeOut"
          value={longitudeOut}
          onChange={(e) => setLongitudeOut(e.target.value)}
        />
      </div>

      <TextareaInput
        label="Report"
        name="report"
        value={report}
        onChange={(e) => setReport(e.target.value)}
      />
    </form>
  );
};

const InfoRow = ({ label, children }) => (
  <div className="grid grid-cols-5 text-sm">
    <span className="col-span-1 font-medium">{label}</span>
    <span className="col-span-1">:</span>
    <span className="col-span-3">{children}</span>
  </div>
);

export default AttendanceDetailPage;
