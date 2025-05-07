import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import { Input } from "../../components/Input.jsx";
import { motion } from "framer-motion";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { requestLocation } from "../../utils/location.js";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";

const AddOutpostPage = () => {
  const { createOutpost, isLoading } = useOutpostStore();
  const [name, setName] = useState("");
  const [locationGranted, setLocationGranted] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigate = useNavigate();
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

  useEffect(() => {
    checkLocationPermission();
  }, []);
  if (isLoading) {
    return <Loader className="w-6h-6 animate-spin mx-auto" />;
  }

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
  return (
    <form
      className="flex max-w-md w-full flex-col gap-5 p-4 bg-white rounded-lg mx-2"
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
          buttonType={`${latitude !== 0 ? "primary" : "disabled"}`}
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

      <div className="grid grid-cols-2 gap-5">
        {/* Start Time Picker */}
        <div className="flex flex-col gap-2 items-center">
          <h6>Latitude</h6>
          {locationGranted === null && (
            <Loader className="w-6h-6 animate-spin mx-auto" />
          )}
          {locationGranted === true && <p>{latitude}</p>}
        </div>

        <div className="flex flex-col gap-2 items-center">
          <h6>Longitude</h6>
          {locationGranted === null && (
            <Loader className="w-6h-6 animate-spin mx-auto" />
          )}
          {locationGranted === true && <p>{longitude}</p>}
        </div>
      </div>
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

export default AddOutpostPage;
