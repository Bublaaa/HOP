import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useAttendanceStore } from "../../../store/attendanceStore.js";
import { requestLocation } from "../../utils/location.js";
import { getShiftStatus } from "../../utils/dateHelper.js";
import { Loader } from "lucide-react";
import { NavLink } from "react-router-dom";
import { TextareaInput } from "../../components/Input.jsx";
import QrScanner from "../../components/QrScanner.jsx";
import Button from "../../components/Button.jsx";

const ConditionalRenderElement = ({
  locationGranted,
  isLocating,
  isClockedIn,
  isClockedOut,
  showScanner,
  setShowScanner,
  setReport,
  activeStatus,
  handleScan,
}) => {
  const [inputValue, setInputValue] = useState("");

  if (isLocating) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }

  if (!activeStatus) {
    return <p>There is no ongoing schedule.</p>;
  }

  if (isClockedOut) {
    return <p>You have already clocked out.</p>;
  }

  if (!isClockedIn) {
    return (
      <div className="flex flex-row justify-between items-center">
        <p>You are not clocked in yet</p>
        <NavLink to="/security/clock-id">
          <Button buttonType="primary" buttonSize="medium">
            Clock In
          </Button>
        </NavLink>
      </div>
    );
  }

  if (showScanner && inputValue.trim() !== "") {
    return <QrScanner onScanSuccess={handleScan} />;
  }

  if (locationGranted === true) {
    return (
      <div className="space-y-2">
        <TextareaInput
          id="duty-report"
          label="Duty Report"
          type="text"
          placeholder="What did you do on this shift?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          buttonSize="medium"
          buttonType="primary"
          onClick={() => {
            setShowScanner(true);
            setReport(inputValue);
          }}
        >
          Save
        </Button>
      </div>
    );
  }

  if (locationGranted === false) {
    return <p>❌ Location permission is required for attendance.</p>;
  }

  return <p>Checking location permission...</p>;
};

const ClockOutPage = () => {
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
    handleScanClockOutSuccess,
  } = useAttendanceStore();
  const { shifts, fetchShifts } = useShiftStore();

  const [report, setReport] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isClockedOut, setIsClockedOut] = useState(false);
  const [locationGranted, setLocationGranted] = useState(null);
  const [activeStatus, setActiveStatus] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

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
    let clockedIn = false;
    let clockedOut = false;

    const shiftMap = Object.fromEntries(
      shifts.map((shift) => [shift._id, shift])
    );

    schedules.forEach((schedule) => {
      const attendance = attendancesByScheduleId[schedule._id];
      const shift = shiftMap[schedule.shiftId];
      const shiftStatus = shift
        ? getShiftStatus(shift.startTime, shift.endTime)
        : null;

      if (shiftStatus === "ongoing") {
        ongoing = true;
        if (attendance?.clockIn) {
          clockedIn = true;
        }
        if (attendance?.clockOut) {
          clockedOut = true;
        }
      }
    });

    setActiveStatus(ongoing);
    setIsClockedIn(clockedIn);
    setIsClockedOut(clockedOut);
  }, [schedules, attendancesByScheduleId, shifts]);

  const handleScan = (data) => {
    if (data && report.trim() !== "") {
      handleScanClockOutSuccess(data, user._id, latitude, longitude, report);
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
        <h5 className="text-center bg-clip-text">Clock Out</h5>
        <motion.div
          className="p-4 rounded-lg bg-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ConditionalRenderElement
            locationGranted={locationGranted}
            isLocating={isLocating}
            isClockedIn={isClockedIn}
            isClockedOut={isClockedOut}
            showScanner={showScanner}
            setShowScanner={setShowScanner}
            setReport={setReport}
            activeStatus={activeStatus}
            handleScan={handleScan}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClockOutPage;
