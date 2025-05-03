import { useEffect } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import Button from "../../components/Button.jsx";
import * as LucideIcons from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const UserPage = ({}) => {
  const { users, fetchAllUsers, isLoading } = useAuthStore();
  useEffect(() => {
    fetchAllUsers();
  }, []);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex max-w-md w-full flex-col gap-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center p-4 bg-white rounded-lg justify-between"
      >
        <h6>Manage Account</h6>
        <NavLink to={"/admin/signup"}>
          <Button
            buttonType="primary"
            buttonSize="medium"
            icon={LucideIcons.Plus}
          >
            Add Account
          </Button>
        </NavLink>
      </motion.div>
      {users.map((user, index) => {
        return (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 * (index + 1) }}
            className="grid grid-cols-3 items-center p-3 rounded-lg bg-white hover:bg-gray-100"
          >
            <div>
              {toTitleCase(user.firstName)} {toTitleCase(user.middleName)}
              {toTitleCase(user.lastName)}
            </div>
            <div
              className={`rounded-sm w-fit py-1 px-2 font-semibold ${
                user.position === "admin"
                  ? "bg-green-100 text-green-500"
                  : user.position === "security"
                  ? "bg-blue-100 text-blue-500"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {toTitleCase(user.position)}
            </div>
            <div className="flex flex-row justify-end gap-5">
              <Button
                buttonType="secondary"
                buttonSize="icon"
                icon={LucideIcons.PenBoxIcon}
              />
              <Button
                buttonType="danger"
                buttonSize="icon"
                icon={LucideIcons.Trash2}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UserPage;
