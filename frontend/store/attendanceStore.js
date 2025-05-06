import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useAttendanceStore = create((set, get) => {
  const handleError = (error, defaultMsg) => {
    const message = error.response?.data?.message || defaultMsg;
    set({ error: message, isLoading: false });
    toast.error(message);
  };

  return {
    attendance: null,
    attendances: [],
    attendancesByScheduleId: [],
    error: null,
    isLoading: false,
    message: null,
    //** GET ALL
    fetchAttendances: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}attendance/getAll`);
        set({ attendances: response.data.attendances, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching attendances");
      }
    },
    //** GET DETAIL
    fetchAttendanceDetail: async (id) => {
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
    fetchScheduleToday: async (userId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}schedule/getAll`);
        const today = new Date().toISOString();
        const filtered = response.data.schedules.filter(
          (s) => s.userId === userId && formatDate(s.date) == formatDate(today)
        );
        set({ schedules: filtered, isLoading: false });
      } catch (error) {
        handleError(error, "Error fetching today's schedule");
      }
    },
    fetchScheduleAttendance: async (scheduleId) => {
      set((state) => ({ isLoading: true, error: null }));
      try {
        const response = await axios.get(`${API_URL}attendance/getAll`);
        const attendances = response.data.attendances;
        const filteredAttendance = attendances.find(
          (a) => a.scheduleId === scheduleId
        );

        // Store as map of scheduleId -> attendance
        set((state) => ({
          attendancesByScheduleId: {
            ...state.attendancesByScheduleId,
            [scheduleId]: filteredAttendance,
          },
          isLoading: false,
        }));
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
    updateAttendance: async (
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
        await get().fetchAttendances(); // refresh list
      } catch (error) {
        handleError(error, "Error updating attendance");
      }
    },
    //** DELETE
    deleteAttendance: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_URL}attendance/delete/${id}`);
        set({ isLoading: false });
        toast.success("Success delete attendance");
        await get().fetchAttendances(); // refresh list
      } catch (error) {
        handleError(error, "Error deleting attendance");
      }
    },
  };
});
