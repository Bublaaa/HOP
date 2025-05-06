import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useAttendanceStore } from "../../../store/attendanceStore.js";
import { requestLocation } from "../../utils/location.js";
import QrScanner from "../../components/QrScanner.jsx";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { formatTimeToHours } from "../../utils/dateFormatter.js";
import { getShiftStatus } from "../../utils/dateHelper.js";
import { Loader } from "lucide-react";

const ClockInPage = () => {
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
    handleScanSuccess,
  } = useAttendanceStore();

  const { shifts, fetchShifts } = useShiftStore();
  const { outposts, fetchOutposts } = useOutpostStore();

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [locationGranted, setLocationGranted] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  // Get location permission
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

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (user) {
      fetchScheduleToday(user._id);
      fetchOutposts();
      fetchShifts();
    }
  }, [user]);

  useEffect(() => {
    if (schedules.length) {
      schedules.forEach((schedule) => {
        fetchScheduleAttendance(schedule._id);
      });
    }
  }, [schedules]);

  useEffect(() => {
    let clockedIn = false;

    schedules.forEach((schedule) => {
      const attendance = attendancesByScheduleId[schedule._id];
      const shift = shifts.find((shift) => shift._id === schedule.shiftId);
      const shiftStatus = shift
        ? getShiftStatus(shift.startTime, shift.endTime)
        : null;

      if (shiftStatus === "ongoing" && attendance?.clockIn) {
        clockedIn = true;
      }
    });

    setIsClockedIn(clockedIn);
  }, [schedules, attendancesByScheduleId, shifts]);

  const handleScan = (data) => {
    if (data) {
      handleScanSuccess(data, user._id, { latitude, longitude });
    }
  };

  const getOutpostName = (id) =>
    toTitleCase(outposts.find((outpost) => outpost._id === id)?.name || "-");

  const getShiftDetail = (id) => {
    const shift = shifts.find((s) => s._id === id);
    if (!shift) return "-";
    return `${toTitleCase(shift.name)} (${formatTimeToHours(
      shift.startTime
    )} - ${formatTimeToHours(shift.endTime)})`;
  };

  if (isScheduleLoading || isAttendanceLoading) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }

  const ConditionalRenderElement = ({
    locationGranted,
    isLocating,
    isClockedIn,
  }) => {
    if (isLocating) {
      return <Loader className="w-6 h-6 animate-spin mx-auto" />;
    }

    if (!isClockedIn && locationGranted === true) {
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
            locationGranted={locationGranted}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClockInPage;
