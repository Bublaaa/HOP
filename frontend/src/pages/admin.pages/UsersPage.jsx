import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import Button from "../../components/Button.jsx";
import { Trash2, PenBoxIcon, Plus, Loader } from "lucide-react";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Modal from "../../components/Modal.jsx";
import { DeleteConfirmationForm } from "../../components/DeleteConfirmationForm.jsx";

const UserPage = ({}) => {
  const { users, fetchAllUsers, isLoading, deleteUser } = useAuthStore();
  useEffect(() => {
    fetchAllUsers();
  }, []);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    body: null,
  });
  const openModal = (title, body) =>
    setModalState({ isOpen: true, title, body });
  const closeModal = () =>
    setModalState({ isOpen: false, title: "", body: null });

  const handleDeleteAction = (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) {
      openModal(
        "Delete Account",
        <DeleteConfirmationForm
          itemName={deleteButton.dataset.name}
          onDelete={deleteUser}
          itemId={deleteButton.dataset.id}
          onClose={closeModal}
          // redirect={navigate(-1)}
        />
      );
      return;
    }
  };
  if (isLoading) {
    return <Loader className="w-6h-6 animate-spin mx-auto" />;
  }
  return (
    <div className="flex max-w-md w-full flex-col gap-2 mx-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center p-4 bg-white rounded-lg justify-between"
      >
        <h6>Manage Account</h6>
        <NavLink to={"/admin/signup"}>
          <Button buttonType="primary" buttonSize="medium" icon={Plus}>
            Add Account
          </Button>
        </NavLink>
      </motion.div>
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        body={modalState.body}
      />
      <div className="space-y-2" onClick={(e) => handleDeleteAction(e)}>
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
                <NavLink to={`/admin/user/${user._id}`}>
                  <Button
                    buttonType="secondary"
                    buttonSize="icon"
                    icon={PenBoxIcon}
                  />
                </NavLink>
                <Button
                  className="delete-btn"
                  buttonType="danger"
                  buttonSize="icon"
                  icon={Trash2}
                  data-id={user._id}
                  data-name={user.firstName}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default UserPage;
