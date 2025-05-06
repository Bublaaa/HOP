import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input.jsx";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import { toast } from "react-hot-toast";
import Button from "../../components/Button.jsx";
import ShiftProgressBar from "../../components/ShiftProgressBar.jsx";
import { useScheduleStore } from "../../../store/scheduleStore.js";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { useAttendanceStore } from "../../../store/attendanceStore.js";
import { requestLocation } from "../../utils/location.js";
import QrScanner from "../../components/QrScanner.jsx";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { formatTime } from "../../utils/dateFormatter.js";

const ClockInPage = () => {
  const { user } = useAuthStore();
  const { schedules, fetchScheduleToday } = useScheduleStore();
  const { shifts, fetchShifts } = useShiftStore();
  const { outposts, fetchOutposts } = useOutpostStore();
  const { handleScanSuccess } = useAttendanceStore();
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
        setIsLocating(false); // done
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

  const handleScan = (data) => {
    console.log(data);
    if (data) {
      handleScanSuccess(data, user._id, location);
    }
  };

  useEffect(() => {
    if (user) {
      fetchScheduleToday(user._id);
      fetchOutposts();
      fetchShifts();
    }
  }, [user, fetchScheduleToday, fetchOutposts, fetchShifts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-2"
    >
      <div className="p-8 flex flex-col  gap-5">
        <h5 className="text-center bg-clip-text">Clock In</h5>
        <motion.div
          className="p-4 rounded-lg bg-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-3">Scan the QR</h3>
          {locationGranted === null && <p>Checking location permission...</p>}
          {locationGranted === false && (
            <p>❌ Location permission is required for attendance.</p>
          )}
          {locationGranted === true && <QrScanner onScanSuccess={handleScan} />}
        </motion.div>
      </div>
    </motion.div>
  );
};
export default ClockInPage;
