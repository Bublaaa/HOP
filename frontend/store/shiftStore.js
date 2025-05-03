import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useShiftStore = create((set, get) => {
  const handleError = (error, defaultMsg) => {
    const message = error.response?.data?.message || defaultMsg;
    set({ error: message, isLoading: false });
    toast.error(message);
  };

  return {
    shift: null,
    shifts: [],
    error: null,
    isLoading: false,
    message: null,

    fetchShifts: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}shift/getAll`);
        set({ shifts: response.data.shifts, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching shifts");
      }
    },
    fetchShiftDetail: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}shift/getDetail/${id}`);
        set({ shift: response.data.shift, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching shift");
      }
    },

    createShift: async (name, startTime, endTime) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}shift/create`, {
          name,
          startTime,
          endTime,
        });
        set({ shift: response.data.shift, isLoading: false });
        toast.success("Success add new shift");
        await get().fetchShifts(); // refresh list
      } catch (error) {
        handleError(error, "Error creating shift");
      }
    },

    updateShift: async (id, name, startTime, endTime) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.put(`${API_URL}shift/update/${id}`, {
          name,
          startTime,
          endTime,
        });
        set({ shift: response.data.shift, isLoading: false });
        toast.success("Success update shift");
        await get().fetchShifts(); // refresh list
      } catch (error) {
        handleError(error, "Error updating shift");
      }
    },

    deleteShift: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_URL}shift/delete/${id}`);
        set({ isLoading: false });
        toast.success("Success delete shift");
        await get().fetchShifts(); // refresh list
      } catch (error) {
        handleError(error, "Error deleting shift");
      }
    },
  };
});
