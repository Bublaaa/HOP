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
        </Route>

        {/* Outpost Routes */}
        <Route
          path="/outpost"
          element={
            <ProtectedRoute requiredRole="outpost">
              <Suspense>
                <OutpostDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        ></Route>
        {/* Security Routes */}
        <Route
          path="/security"
          element={
            <ProtectedRoute requiredRole="security">
              <Suspense>
                <SecurityDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        ></Route>
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
