import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useScheduleStore = create((set, get) => {
  const handleError = (error, defaultMsg) => {
    const message = error.response?.data?.message || defaultMsg;
    set({ error: message, isLoading: false });
    toast.error(message);
  };

  return {
    attendance: null,
    attendances: [],
    error: null,
    isLoading: false,
    message: null,
    //** GET ALL
    fetchSchedules: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}attendance/getAll`);
        set({ attendances: response.data.attendances, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching attendances");
      }
    },
    //** GET DETAIL
    fetchScheduleDetail: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(
          `${API_URL}attendance/getDetail/${id}`
        );
        set({ attendance: response.data.attendance, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching attendance");
      }
    },
    //** CLOCK IN
    clockIn: async (scheduleId, latitude, longitude) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}attendance/clock-in`, {
          scheduleId,
          latitude,
          longitude,
        });
        set({ attendance: response.data.attendance, isLoading: false });
        toast.success("Success clock in");
        await get().fetchSchedules(); // refresh list
      } catch (error) {
        handleError(error, "Error creating attendance");
      }
    },
    //** CLOCK OUT
    clockOut: async (id, scheduleId, latitude, longitude, report) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.put(
          `${API_URL}attendance/clock-out/${id}`,
          {
            scheduleId,
            latitude,
            longitude,
            report,
          }
        );
        set({ attendance: response.data.attendance, isLoading: false });
        toast.success("Success clock out");
        await get().fetchSchedules(); // refresh list
      } catch (error) {
        handleError(error, "Error updating attendance");
      }
    },
    //** FORCE UPDATE FOR ADMIN
    updateSchedule: async (
      id,
      scheduleId,
      clockIn,
      clockOut,
      report,
      latitude,
      longitude,
      status
    ) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.put(`${API_URL}attendance/update/${id}`, {
          scheduleId,
          clockIn,
          clockOut,
          report,
          latitude,
          longitude,
          status,
        });
        set({ attendance: response.data.attendance, isLoading: false });
        toast.success("Success update attendance");
        await get().fetchSchedules(); // refresh list
      } catch (error) {
        handleError(error, "Error updating attendance");
      }
    },
    //** DELETE
    deleteSchedule: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_URL}attendance/delete/${id}`);
        set({ isLoading: false });
        toast.success("Success delete attendance");
        await get().fetchSchedules(); // refresh list
      } catch (error) {
        handleError(error, "Error deleting attendance");
      }
    },
  };
});
