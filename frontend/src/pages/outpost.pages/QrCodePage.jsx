import { useEffect, useState } from "react";
import { Loader, MapPinnedIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { requestLocation, calculateDistance } from "../../utils/location.js";
import { useShiftStore } from "../../../store/shiftStore.js";
import { toTitleCase } from "../../utils/toTitleCase.js";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";

const QrCOdePage = () => {
  //** ZUSTAND
  const {
    qrCode,
    error,
    url,
    isLoading: isShiftLoading,
    fetchQrCode,
  } = useShiftStore();

  const {
    outposts,
    fetchOutposts,
    isLoading: isOutpostLoading,
  } = useOutpostStore();
  //** USE STATE
  const [nearestOutpost, setNearestOutpost] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationGranted, setLocationGranted] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

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

  //** GET THE NEAREST OUTPOST FROM LOGIN LOCATION
  const checkNearestLoginLocation = () => {
    let nearest = null;
    let minDistance = Infinity;

    outposts.forEach((outpost) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        outpost.latitude,
        outpost.longitude
      );
      // console.log(
      //   outpost.latitude,
      //   "  ",
      //   outpost.longitude,
      //   "Distance : ",
      //   distance
      // );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = outpost;
      }
    });
    //** MAX DISTANCE 15 METERS
    if (minDistance <= 15) {
      setNearestOutpost(nearest);
      // toast.success(
      //   `Nearest outpost: ${nearest.name} (${minDistance.toFixed(2)} m)`
      // );
    } else {
      setNearestOutpost(null);
      // toast.error("No nearby outpost found (must be within 15 meters)");
    }
  };
  //** FETCH INITIAL DATA
  useEffect(() => {
    fetchOutposts();
    checkLocationPermission();
  }, [fetchOutposts]);

  //** CHECK ALL OUTPOST
  useEffect(() => {
    if (locationGranted && latitude && longitude && outposts.length > 0) {
      checkNearestLoginLocation();
    }
  }, [locationGranted, latitude, longitude, outposts]);

  //** FETCH QR CODE FOR ATTENDANCE
  useEffect(() => {
    if (nearestOutpost) {
      fetchQrCode(nearestOutpost._id);
    }
  }, [fetchQrCode, nearestOutpost]);

  //** LOADING EXCEPTION
  if (isOutpostLoading || isShiftLoading) {
    return <Loader className="w-6 h-6 animate-spin mx-auto" />;
  }
  return (
    <form className="flex max-w-md w-full flex-col gap-5 p-4 bg-white rounded-lg mx-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center justify-between"
      >
        <h6>Outpost QR Code</h6>
        <Button
          buttonSize="medium"
          buttonType={isLocating ? "disabled" : "primary"}
          icon={MapPinnedIcon}
          onClick={() => checkLocationPermission()}
        >
          {isLocating ? "Calibrating..." : "Recalibrate"}
        </Button>
      </motion.div>

      {/* QR CONDITIONAL RENDER */}
      {!isLocating && nearestOutpost && qrCode ? (
        <div className="flex justify-center items-center">
          <img src={qrCode} alt="Attendance QR Code" className="w-48 h-48" />
        </div>
      ) : !isLocating && !qrCode ? (
        <h6 className="text-center text-red-500">
          {error || "QR Code unavailable"}
        </h6>
      ) : (
        isLocating && <Loader className="w-6 h-6 animate-spin mx-auto" />
      )}

      {/* NEAREST OUTPOST  */}
      {nearestOutpost && !isLocating && (
        <div className="text-center rounded-lg">
          <h6>{toTitleCase(nearestOutpost.name)}</h6>
        </div>
      )}
      {/* LOCATION PERMISSION CHECK */}
      {locationGranted === null && (
        <div className="p-2 items-center text-center bg-yellow-100 rounded-lg">
          <p className="text-yellow-500">Checking location permission</p>
        </div>
      )}
      {locationGranted === false && (
        <div className="p-2 items-center text-center bg-red-100 rounded-lg">
          <p className="text-red-500">
            ❌ Location permission is required for adding new outpost.
          </p>
        </div>
      )}
    </form>
  );
};

export default QrCOdePage;
