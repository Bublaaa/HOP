import { useAuthStore } from "../../../store/authStore.js";
import { Outlet } from "react-router-dom";
import sidebarLinks from "../../constants/sidebarLinks.js";
import MenuLink from "../../components/MenuLink.jsx";

const SecurityDashboard = () => {
  const { user } = useAuthStore();
  const links = sidebarLinks[user?.position] || [];
  return (
    <div className="w-full h-full flex flex-col space-y-5 h-screen items-end justify-end">
      {/* CONTENT */}
      <div className="flex items-start justify-center w-full overflow-y-auto scrollbar-hidden py-10">
        <Outlet />
      </div>
      {/* NAVIGATION */}
      <div className="max-w-md w-full mx-auto h-fit">
        <MenuLink links={links} />
      </div>
    </div>
  );
};

export default SecurityDashboard;
