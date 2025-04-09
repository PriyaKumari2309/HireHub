import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center flex-1">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
        >
          <div className="mb-5 text-center">
            <h1 className="font-bold text-2xl text-gray-800">Welcome Back!</h1>
            <p className="text-sm text-gray-600 mt-1">
              We are so excited to see you here.
            </p>
          </div>

          {/* Email Field */}
          <div className="my-3">
            <Label className="font-medium text-gray-600">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="mt-1 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 rounded-md p-2"
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div className="my-3 relative">
            <Label className="font-medium text-gray-600">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="mt-1 w-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 rounded-md p-2 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-sm text-right text-gray-600 mb-3">
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Role Selection */}
          <div className="flex items-center gap-4 my-3">
            <Label className="font-medium text-gray-600">Role</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
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

          {/* Login Button */}
          {loading ? (
            <Button className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
            >
              Login
            </Button>
          )}

          {/* Signup Link */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
