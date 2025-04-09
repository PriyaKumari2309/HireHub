import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const { loading } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(input);

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <ToastContainer />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 bg-white shadow-lg border border-gray-200 rounded-md p-6 my-10"
        >
          <h1 className="font-bold text-2xl text-gray-700 mb-5 text-center">
            Sign Up
          </h1>

          {/* Full Name */}
          <div className="my-3">
            <Label className="text-gray-600 font-semibold">Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Enter your name"
              className="border-gray-300"
            />
          </div>

          {/* Email */}
          <div className="my-3">
            <Label className="text-gray-600 font-semibold">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="border-gray-300"
            />
          </div>

          {/* Phone Number */}
          <div className="my-3">
            <Label className="text-gray-600 font-semibold">Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="Enter your phone number"
              className="border-gray-300"
            />
          </div>

          {/* Password */}
          {/* Password */}
          <div className="my-3 relative">
            <Label className="text-gray-600 font-semibold">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="border-gray-300 pr-10" // Ensures space for the eye icon
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Role Selection (One Line) */}
          <div className="flex items-center gap-4 my-3">
            <Label className="font-medium  text-gray-600">Role</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer w-4 h-4 accent-black"
                />
                <span className="text-gray-700">Student</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="recruiter"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer w-4 h-4 accent-black"
                />
                <span className="text-gray-700">Recruiter</span>
              </label>
            </div>
          </div>

          {/* Profile Picture Upload (Same Line) */}
          <div className="flex items-center gap-4 my-3">
            <Label className="text-gray-600 font-semibold">Profile</Label>
            <Input
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
              className="cursor-pointer border-gray-300"
            />
          </div>

          {/* Signup Button */}
          {loading ? (
            <Button className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-semibold py-2 rounded-md">
              <Loader2 className="mr-2 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-semibold py-2 rounded-md"
            >
              Signup
            </Button>
          )}

          {/* Already have an account? */}
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
