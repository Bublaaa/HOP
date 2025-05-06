import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { findScheduleId } from "../src/utils/scheduleHelper";

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

    handleScanClockInSuccess: async (
      scannedData,
      userId,
      latitude,
      longitude
    ) => {
      set({ isLoading: true, error: null });
      try {
        const scheduleResponse = await axios.get(`${API_URL}schedule/getAll`);
        const schedules = scheduleResponse.data.schedules;

        const [baseUrl, outpostId, shiftId] = (() => {
          const parts = scannedData.split("/");
          const shiftId = parts.pop();
          const outpostId = parts.pop();
          const baseUrl = parts.join("/");
          return [baseUrl, outpostId, shiftId];
        })();

        const scheduleId = findScheduleId(
          schedules,
          userId,
          outpostId,
          shiftId
        );
        toast.success(scheduleId);

        console.log("scheduleId : ", scheduleId);
        const response = await axios.post(baseUrl + "/clock-in", {
          scheduleId: scheduleId,
          latitude: latitude,
          longitude: longitude,
        });
        set({ attendance: response.data.attendance });
        toast.success("Success create attendance");
      } catch (error) {
        handleError(error, "Error creating attendance");
      }
    },
    handleScanClockOutSuccess: async (
      id,
      scannedData,
      scheduleId,
      latitude,
      longitude,
      report
    ) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const scheduleResponse = await axios.get(`${API_URL}schedule/getAll`);
        const schedules = scheduleResponse.data.schedules;

        const urlParts = scannedData.split("/");
        const outpostId = urlParts[urlParts.length - 2];
        const shiftId = urlParts[urlParts.length - 1];

        const response = await axios.put(scannedData + `/clock-out/${id}`, {
          scheduleId,
          latitude,
          longitude,
          report,
        });
      } catch (error) {
        handleError(error, "Error updating attendance");
      }
    },

    handleScanSuccess: async (
      scannedData,
      userId,
      latitude,
      longitude,
      action
    ) => {
      set({ isLoading: true, error: null, message: null });
      try {
        if (action === "clock-out") {
        }

        router.post("/clock-in", punchIn);
        router.put("/clock-out/:id", punchOut);

        set({ message: "Sending attendance..." });

        const createResponse = await axios.post(scannedData + "/" + action, {
          userId,
          location,
        });
        const updateResponse = await axios.put(
          scannedData + "/" + action + "/",
          {
            id,
            location,
          }
        );

        if (response.data.success) {
          set({
            attendances: response.data.attendance,
            isLoading: false,
            message: "✅ Attendance recorded successfully!",
          });
          toast("Attendance recorded successfully!");
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "❌ Error submitting attendance";
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },
  };
});
