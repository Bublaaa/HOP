import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input.jsx";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import { toast } from "react-hot-toast";
import Button from "../../components/Button.jsx";

const UserDetailPage = () => {
  const { id } = useParams();
  const { userDetail, fetchUserDetail, updateUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetail(id);
  }, [id, fetchUserDetail]);

  useEffect(() => {
    if (userDetail) {
      setEmail(userDetail.email);
      setFirstName(userDetail.firstName);
      setMiddleName(userDetail.middleName);
      setLastName(userDetail.lastName);
    }
  }, [userDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(id, email, firstName, middleName, lastName);
    toast.success("User updated");
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-2"
    >
      <div className="p-8">
        <h2 className="mb-6 text-center bg-clip-text">Update Account</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            icon={User}
            type="text"
            placeholder="Fist Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            icon={User}
            type="text"
            placeholder="Middle Name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
          <Input
            icon={User}
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            buttonSize="large"
            buttonType="primary"
            type="submit"
            className="w-full"
          >
            Save
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
export default UserDetailPage;
