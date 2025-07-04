// ** LIBRARY
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";
import { useEffect, lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
// ** PAGES
import LoginPage from "./pages/LoginPage.jsx";

// ** LAZY IMPORT
const AdminDashboard = lazy(() =>
  import("./pages/admin.pages/AdminDashboard.jsx")
);
const OutpostDashboard = lazy(() =>
  import("./pages/outpost.pages/OutpostDashboard.jsx")
);
const SecurityDashboard = lazy(() =>
  import("./pages/security.pages/SecurityDashboard.jsx")
);

const SignUpPage = lazy(() => import("./pages/admin.pages/SignUpPage.jsx"));
const UsersPage = lazy(() => import("./pages/admin.pages/UsersPage.jsx"));
const UserDetailPage = lazy(() =>
  import("./pages/admin.pages/UserDetailPage.jsx")
);

const OutpostsPage = lazy(() => import("./pages/admin.pages/OutpostsPage.jsx"));
const AddOutpostPage = lazy(() =>
  import("./pages/admin.pages/AddOutpostPage.jsx")
);
const OutpostDetailPage = lazy(() =>
  import("./pages/admin.pages/OutpostDetailPage.jsx")
);

const ShiftsPage = lazy(() => import("./pages/admin.pages/ShiftsPage.jsx"));
const AddShiftPage = lazy(() => import("./pages/admin.pages/AddShiftPage.jsx"));
const ShiftsDetailPage = lazy(() =>
  import("./pages/admin.pages/ShiftsDetailPage.jsx")
);

const SchedulesPage = lazy(() =>
  import("./pages/admin.pages/SchedulesPage.jsx")
);
const AddSchedulePage = lazy(() =>
  import("./pages/admin.pages/AddSchedulePage.jsx")
);
const ScheduleDetailPage = lazy(() =>
  import("./pages/admin.pages/ScheduleDetailPage.jsx")
);
const CreateSingleSchedulePage = lazy(() =>
  import("./pages/admin.pages/CreateSingleSchedulePage.jsx")
);
const AttendancesPage = lazy(() =>
  import("./pages/admin.pages/AttendancesPage.jsx")
);
const AttendanceDetailPage = lazy(() =>
  import("./pages/admin.pages/AttendanceDetailPage.jsx")
);

const QrCodePage = lazy(() => import("./pages/outpost.pages/QrCodePage.jsx"));
const SchedulesOutpostPage = lazy(() =>
  import("./pages/outpost.pages/SchedulesOutpostPage.jsx")
);

const ClockInPage = lazy(() =>
  import("./pages/security.pages/ClockInPage.jsx")
);
const ClockOutPage = lazy(() =>
  import("./pages/security.pages/ClockOutPage.jsx")
);
const OverviewPage = lazy(() =>
  import("./pages/security.pages/OverviewPage.jsx")
);
const SchedulesSecurityPage = lazy(() =>
  import("./pages/security.pages/SchedulesSecurityPage.jsx")
);

// Protect routes that require authentication
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.position !== requiredRole) {
    // Prevent unnecessary redirects if already on the correct route
    if (user.position === "security" && location.pathname !== "/security") {
      return <Navigate to="/security" replace />;
    }
    if (user.position === "outpost" && location.pathname !== "/outpost") {
      return <Navigate to="/outpost" replace />;
    }
    if (
      user.position === "admin" &&
      location.pathname !== "/admin" &&
      !location.pathname.startsWith("/admin/")
    ) {
      return <Navigate to="/admin" replace />;
    }
  }
  return children;
};

// Redirect to user page based on user position
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    switch (user.position) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "outpost":
        return <Navigate to="/outpost" replace />;
      case "security":
        return <Navigate to="/security" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  return children;
};
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <Loader className="w-6h-6 animate-spin mx-auto" />;

  return (
    <div className="h-screen w-full bg-white-shadow flex items-center justify-center overflow-hidden">
      <Routes>
        {/* <Route path="/" element={<RedirectToRoleBasedDashboard />} /> */}
        {/*  Admin Routes  * */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Suspense
                fallback={<Loader className="w-6h-6 animate-spin mx-auto" />}
              >
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="schedules" replace />} />

          <Route
            path="users"
            element={
              <Suspense>
                <UsersPage />
              </Suspense>
            }
          />
          <Route
            path="user/:id"
            element={
              <Suspense>
                <UserDetailPage />
              </Suspense>
            }
          />
          <Route
            path="signup"
            element={
              <Suspense>
                <SignUpPage />
              </Suspense>
            }
          />
          <Route
            path="outposts"
            element={
              <Suspense>
                <OutpostsPage />
              </Suspense>
            }
          />
          <Route
            path="outpost/:id"
            element={
              <Suspense>
                <OutpostDetailPage />
              </Suspense>
            }
          />
          <Route
            path="add-outpost"
            element={
              <Suspense>
                <AddOutpostPage />
              </Suspense>
            }
          />
          <Route
            path="shifts"
            element={
              <Suspense>
                <ShiftsPage />
              </Suspense>
            }
          />
          <Route
            path="shifts/:id"
            element={
              <Suspense>
                <ShiftsDetailPage />
              </Suspense>
            }
          />
          <Route
            path="add-shift"
            element={
              <Suspense>
                <AddShiftPage />
              </Suspense>
            }
          />
          <Route
            path="schedules"
            element={
              <Suspense>
                <SchedulesPage />
              </Suspense>
            }
          />
          <Route
            path="add-schedules"
            element={
              <Suspense>
                <AddSchedulePage />
              </Suspense>
            }
          />
          <Route
            path="add-schedule"
            element={
              <Suspense>
                <CreateSingleSchedulePage />
              </Suspense>
            }
          />
          <Route
            path="schedule/:id"
            element={
              <Suspense>
                <ScheduleDetailPage />
              </Suspense>
            }
          />
          <Route
            path="attendances"
            element={
              <Suspense>
                <AttendancesPage />
              </Suspense>
            }
          />
          <Route
            path="attendance/:id"
            element={
              <Suspense>
                <AttendanceDetailPage />
              </Suspense>
            }
          />
        </Route>
        {/* Outpost Routes */}
        <Route
          path="/outpost"
          element={
            <ProtectedRoute requiredRole="outpost">
              <Suspense
                fallback={<Loader className="w-6h-6 animate-spin mx-auto" />}
              >
                <OutpostDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="qr-code" replace />} />
          <Route
            path="qr-code"
            element={
              <Suspense>
                <QrCodePage />
              </Suspense>
            }
          />
          <Route
            path="schedules"
            element={
              <Suspense>
                <SchedulesOutpostPage />
              </Suspense>
            }
          />
        </Route>
        {/* Security Routes */}
        <Route
          path="/security"
          element={
            <ProtectedRoute requiredRole="security">
              <Suspense
                fallback={<Loader className="w-6h-6 animate-spin mx-auto" />}
              >
                <SecurityDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route
            path="overview"
            element={
              <Suspense>
                <OverviewPage />
              </Suspense>
            }
          />
          <Route
            path="clock-in"
            element={
              <Suspense>
                <ClockInPage />
              </Suspense>
            }
          />
          <Route
            path="clock-out"
            element={
              <Suspense>
                <ClockOutPage />
              </Suspense>
            }
          />
          <Route
            path="schedules"
            element={
              <Suspense>
                <SchedulesSecurityPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        {/* catch all routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
