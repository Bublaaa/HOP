import { useEffect } from "react";
import { useOutpostStore } from "../../../store/outpostStore.js";
import Button from "../../components/Button.jsx";
import { Trash2, PenBoxIcon, Plus } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { toTitleCase } from "../../utils/toTitleCase.js";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const OutpostsPage = ({}) => {
  const { outposts, fetchOutposts, isLoading } = useOutpostStore();
  useEffect(() => {
    fetchOutposts();
  }, []);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex max-w-md w-full flex-col gap-2 mx-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row w-full items-center p-4 bg-white rounded-lg justify-between"
      >
        <h6>Manage Outpost</h6>
        <NavLink to={"/admin/add-outpost"}>
          <Button buttonType="primary" buttonSize="medium" icon={Plus}>
            Add Outpost
          </Button>
        </NavLink>
      </motion.div>
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
              <Button
                buttonType="secondary"
                buttonSize="icon"
                icon={PenBoxIcon}
              />
              <Button buttonType="danger" buttonSize="icon" icon={Trash2} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OutpostsPage;
