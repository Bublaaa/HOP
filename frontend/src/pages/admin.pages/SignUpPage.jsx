import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input, DropdownInput } from "../../components/Input.jsx";
import { useState } from "react";
// import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../../../store/authStore.js";
import Button from "../../components/Button.jsx";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("security");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();
  const positions = ["security", "outpost", "admin"].map((position) => ({
    label: position.charAt(0).toUpperCase() + position.slice(1),
    value: position,
  }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, firstName, middleName, lastName, position);
      toast.success("User created");
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-2"
    >
      <div className="p-8">
        <h2 className="mb-6 text-center bg-clip-text">Create Account</h2>

        <form className="space-y-5" onSubmit={handleSignUp}>
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

          <div className="grid grid-cols-2 gap-5">
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <DropdownInput
              label=""
              name="position"
              value={position}
              options={positions}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          {/* <PasswordStrengthMeter password={password} /> */}

          <Button
            buttonSize="large"
            buttonType="primary"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6h-6 animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </div>
      {/* <div className="px-8 py-4 bg-white-shadow flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div> */}
    </motion.div>
  );
};
export default SignUpPage;
