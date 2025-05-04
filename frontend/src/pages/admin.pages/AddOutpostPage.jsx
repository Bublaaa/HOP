import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapPinned, Plus } from "lucide-react";
import { Input } from "../../components/Input.jsx";
import { motion } from "framer-motion";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { requestLocation } from "../../utils/location.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";

const AddOutpostPage = () => {
  const { createOutpost, isLoading } = useOutpostStore();
  const [name, setName] = useState("");
  const [locationGranted, setLocationGranted] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const checkLocationPermission = async () => {
    try {
      const coords = await requestLocation();
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      setLocationGranted(true);
    } catch (error) {
      console.error("Location permission denied:", error);
      setLocationGranted(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (latitude === 0 || longitude === 0) {
      toast.error("Please recalibrate your coordinates");
      return;
    }
    await createOutpost(name, latitude, longitude);
    toast.success("Success add new outpost");
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const handleCalibrateCoordinates = (e) => {
    e.preventDefault;
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
        <h6>New Outpost</h6>
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
        label={"Outpost Name"}
        placeholder="Outpost Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        buttonSize="large"
        buttonType="primary"
        icon={MapPinned}
        onClick={checkLocationPermission}
      >
        Get Location
      </Button>
      {locationGranted === null && <p>Checking location permission...</p>}
      {locationGranted === false && (
        <p>❌ Location permission is required for attendance.</p>
      )}
      <div className="grid grid-cols-2 gap-5">
        {/* Start Time Picker */}
        <div className="flex flex-col gap-2">
          <h6>Latitude</h6>
          <p>{latitude}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h6>Longitude</h6>
          <p>{longitude}</p>
        </div>
      </div>
    </form>
  );
};

export default AddOutpostPage;
