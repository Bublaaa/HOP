import { useEffect, useState } from "react";
import { useOutpostStore } from "../../../store/outpostStore.js";
import { Trash2, PenBoxIcon, Plus, Loader } from "lucide-react";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { DeleteConfirmationForm } from "../../components/DeleteConfirmationForm.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";

const OutpostsPage = ({}) => {
  const { outposts, fetchOutposts, deleteOutpost, isLoading } =
    useOutpostStore();
  useEffect(() => {
    fetchOutposts();
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
  if (isLoading) {
    return <Loader className="w-6h-6 animate-spin mx-auto" />;
  }
  const handleDeleteAction = (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) {
      openModal(
        "Delete Outpost",
        <DeleteConfirmationForm
          itemName={deleteButton.dataset.name}
          onDelete={deleteOutpost}
          itemId={deleteButton.dataset.id}
          onClose={closeModal}
          // redirect={navigate(-1)}
        />
      );
      return;
    }
  };
  return (
    <div className="flex max-w-md w-full flex-col gap-2 mx-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center p-4 bg-white rounded-lg justify-between"
      >
        <h6>Manage Outposts</h6>
        <NavLink to={"/admin/add-outpost"}>
          <Button buttonType="primary" buttonSize="medium" icon={Plus}>
            Add Outpost
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
        {outposts.map((outpost, index) => {
          return (
            <motion.div
              key={outpost._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 * (index + 1) }}
              className="grid grid-cols-2 items-center p-3 rounded-lg bg-white hover:bg-gray-100"
            >
              <div>{toTitleCase(outpost.name)}</div>
              <div className="flex flex-row justify-end gap-5">
                <NavLink to={`/admin/outpost/${outpost._id}`}>
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
                  data-id={outpost._id}
                  data-name={outpost.name}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OutpostsPage;
