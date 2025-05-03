import { useAuthStore } from "../../../store/authStore.js";
import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar/Sidebar.jsx";
// import sidebarLinks from "../constants/sidebarLinks.js";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };

  // const links = sidebarLinks[user?.position] || [];

  return (
    <div className="w-full flex flex-row h-screen">
      <h1>Admin Dashboard</h1>
      {/* <Sidebar links={links} /> */}
      <div className="flex-grow overflow-auto w-5/6 scrollbar-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
