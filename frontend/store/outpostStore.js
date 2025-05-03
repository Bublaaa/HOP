import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useOutpostStore = create((set, get) => {
  const handleError = (error, defaultMsg) => {
    const message = error.response?.data?.message || defaultMsg;
    set({ error: message, isLoading: false });
    toast.error(message);
  };

  return {
    outpost: null,
    outposts: [],
    error: null,
    isLoading: false,
    message: null,
    //** GET ALL
    fetchOutposts: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}outpost/getAll`);
        set({ outposts: response.data.outposts, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching outposts");
      }
    },
    //** GET DETAIL
    fetchOutpostDetail: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}outpost/getDetail/${id}`);
        set({ outpost: response.data.outpost, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching outpost");
      }
    },
    //** CREATE
    createOutpost: async (name, latitude, longitude) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}outpost/create`, {
          name,
          latitude,
          longitude,
        });
        set({ outpost: response.data.outpost, isLoading: false });
        toast.success("Success add new outpost");
        await get().fetchOutposts(); // refresh list
      } catch (error) {
        handleError(error, "Error creating outpost");
      }
    },
    //** UPDATE
    updateOutpost: async (id, name, latitude, longitude) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.put(`${API_URL}outpost/update/${id}`, {
          name,
          latitude,
          longitude,
        });
        set({ outpost: response.data.outpost, isLoading: false });
        toast.success("Success update outpost");
        await get().fetchOutposts(); // refresh list
      } catch (error) {
        handleError(error, "Error updating outpost");
      }
    },
    //** DELETE
    deleteOutpost: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_URL}outpost/delete/${id}`);
        set({ isLoading: false });
        toast.success("Success delete outpost");
        await get().fetchOutposts(); // refresh list
      } catch (error) {
        handleError(error, "Error deleting outpost");
      }
    },
  };
});
