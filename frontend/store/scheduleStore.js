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
    schedule: null,
    schedules: [],
    error: null,
    isLoading: false,
    message: null,

    fetchSchedules: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}schedule/getAll`);
        set({ schedules: response.data.schedules, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching schedules");
      }
    },
    fetchScheduleDetail: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}schedule/getDetail/${id}`);
        set({ schedule: response.data.schedule, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching schedule");
      }
    },

    createSchedule: async (userId, outpostId, shiftId, date) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}schedule/create`, {
          userId,
          outpostId,
          shiftId,
          date,
        });
        set({ schedule: response.data.schedule, isLoading: false });
        toast.success("Success add new schedule");
        await get().fetchSchedules(); // refresh list
      } catch (error) {
        handleError(error, "Error creating schedule");
      }
    },

    updateSchedule: async (id, userId, outpostId, shiftId, date) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.put(`${API_URL}schedule/update/${id}`, {
          userId,
          outpostId,
          shiftId,
          date,
        });
        set({ schedule: response.data.schedule, isLoading: false });
        toast.success("Success update schedule");
        await get().fetchSchedules(); // refresh list
      } catch (error) {
        handleError(error, "Error updating schedule");
      }
    },

    deleteSchedule: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_URL}schedule/delete/${id}`);
        set({ isLoading: false });
        toast.success("Success delete schedule");
        await get().fetchSchedules(); // refresh list
      } catch (error) {
        handleError(error, "Error deleting schedule");
      }
    },
  };
});
