// ** LIBRARY
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";
import { useEffect, lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// ** PAGES
import LoginPage from "./pages/LoginPage.jsx";

// ** COMPONENTS
import LoadingSpinner from "./components/LoadingSpinner.jsx";

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
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="h-screen w-full bg-white-shadow flex items-center justify-center overflow-hidden">
      <Routes>
        {/*  Admin Routes  * */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Suspense>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            path="/signup"
            element={
              <Suspense>
                <SignUpPage />
              </Suspense>
            }
          />
          {/* <Route
            path="overview"
            element={
              <Suspense>
                <OverviewPage />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense>
                <OrderPage />
              </Suspense>
            }
          />
          <Route
            path="orders/:id"
            element={
              <Suspense>
                <OrderDetailPage />
              </Suspense>
            }
          />
          <Route
            path="product"
            element={
              <Suspense>
                <ProductPage />
              </Suspense>
            }
          />
          <Route
            path="product/:id"
            element={
              <Suspense>
                <ProductDetailPage />
              </Suspense>
            }
          /> */}
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
        >
          {/* <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route
            path="menu"
            index
            element={
              <Suspense>
                <MenuPage />
              </Suspense>
            }
          /> */}
          {/* <Route path="profile" element={<TestPage />} /> */}
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
