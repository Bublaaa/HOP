import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useAttendanceStore } from "../../../store/attendanceStore.js";
import { requestLocation } from "../../utils/location.js";
import QrScanner from "../../components/QrScanner.jsx";
import { getShiftStatus } from "../../utils/dateHelper.js";
import { Loader } from "lucide-react";

const ConditionalRenderElement = ({
  locationGranted,
  isLocating,
  isClockedIn,
  activeStatus,
  handleScan,
}) => {
  if (isLocating) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }
  if (!activeStatus) {
    return <p>There is no ongoing schedule.</p>;
  }
  if (isClockedIn) {
    return <p>Already clock in on this schedule</p>;
  }

  if (!isClockedIn && locationGranted === true && activeStatus) {
    return <QrScanner onScanSuccess={handleScan} />;
  }
  switch (locationGranted) {
    case null:
      return <p>Checking location permission...</p>;
    case false:
      return <p>❌ Location permission is required for attendance.</p>;
    default:
      return <p>Checking location permission...</p>;
  }
};

const ClockInPage = () => {
  //** ZUSTAND
  const { user } = useAuthStore();
  const {
    schedules,
    fetchScheduleToday,
    isLoading: isScheduleLoading,
  } = useScheduleStore();
  const {
    attendancesByScheduleId,
    fetchScheduleAttendance,
    isLoading: isAttendanceLoading,
    handleScanClockInSuccess,
  } = useAttendanceStore();
  const { shifts, fetchShifts } = useShiftStore();

  //** STATE VARIABLES
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [activeStatus, setActiveStatus] = useState(false);
  const [locationGranted, setLocationGranted] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  //** GET LOCATION PERMISSION
  const checkLocationPermission = async () => {
    setIsLocating(true);
    try {
      const coords = await requestLocation();
      setTimeout(() => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        setLocationGranted(true);
        setIsLocating(false);
      }, 3000);
    } catch (error) {
      console.error("Location permission denied:", error);
      setLocationGranted(false);
      setIsLocating(false);
    }
  };

  //** LOAD INITIAL DATA
  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchScheduleToday(user._id);
      fetchShifts();
    }
  }, [user?._id]);

  useEffect(() => {
    if (schedules.length) {
      schedules.forEach((schedule) => {
        if (!attendancesByScheduleId[schedule._id]) {
          fetchScheduleAttendance(schedule._id);
        }
      });
    }
  }, [schedules]);

  useEffect(() => {
    let ongoing = false;
    let alreadyClockedIn = false;

    const shiftMap = Object.fromEntries(shifts.map((s) => [s._id, s]));

    schedules.forEach((schedule) => {
      const shift = shiftMap[schedule.shiftId];
      const attendance = attendancesByScheduleId[schedule._id];
      const shiftStatus = shift
        ? getShiftStatus(shift.startTime, shift.endTime)
        : null;

      if (shiftStatus === "ongoing") {
        ongoing = true;
        if (attendance?.clockIn) {
          alreadyClockedIn = true;
        }
      }
    });

    setActiveStatus(ongoing);
    setIsClockedIn(alreadyClockedIn);
  }, [schedules, attendancesByScheduleId, shifts]);

  const handleScan = (data) => {
    if (data) {
      handleScanClockInSuccess(data, user._id, latitude, longitude);
    }
  };

  if (isScheduleLoading || isAttendanceLoading) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-2"
    >
      <div className="p-8 flex flex-col gap-5">
        <h5 className="text-center bg-clip-text">Clock In</h5>
        <motion.div
          className="p-4 rounded-lg bg-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ConditionalRenderElement
            isLocating={isLocating}
            isClockedIn={isClockedIn}
            activeStatus={activeStatus}
            locationGranted={locationGranted}
            handleScan={handleScan}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClockInPage;
