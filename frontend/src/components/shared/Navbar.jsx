import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Bell, LogOut, User2, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import NotificationBell from "../NotificationBell";
import socket from "@/socket"; // assuming a shared socket instance

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔁 Fetch user profile if not already in Redux
  {
    /*useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          withCredentials: true,
        });
        dispatch(setUser(res.data.user));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, [user, dispatch]); */
  }

  // 🔔 Socket events
  useEffect(() => {
    if (user && socket) {
      socket.emit("join", user._id);

      socket.on("getNotification", (data) => {
        toast.success(data.message);
        console.log("🔔 Notification received:", data);
      });

      return () => {
        socket.off("getNotification");
      };
    }
  }, [user]);

  // 🔓 Logout logic
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-white shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-5">
        <h1 className="text-2xl font-bold">
          Hire<span className="text-[#F83002]">Hub</span>
        </h1>

        <div className="flex items-center gap-6">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className={`group relative pb-1 text-black transition-colors duration-300 ${
                      location.pathname === "/admin/companies"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    Companies
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300 transform scale-x-0 bg-blue-600 group-hover:scale-x-100 origin-left ${
                        location.pathname === "/admin/companies"
                          ? "scale-x-100"
                          : ""
                      }`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className={`group relative pb-1 text-black transition-colors duration-300 ${
                      location.pathname === "/admin/jobs" ? "text-blue-600" : ""
                    }`}
                  >
                    Jobs
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300 transform scale-x-0 bg-blue-600 group-hover:scale-x-100 origin-left ${
                        location.pathname === "/admin/jobs" ? "scale-x-100" : ""
                      }`}
                    ></span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className={`group relative pb-1 text-black transition-colors duration-300 ${
                      location.pathname === "/" ? "text-blue-600" : ""
                    }`}
                  >
                    Home
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300 transform scale-x-0 bg-blue-600 group-hover:scale-x-100 origin-left ${
                        location.pathname === "/" ? "scale-x-100" : ""
                      }`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className={`group relative pb-1 text-black transition-colors duration-300 ${
                      location.pathname === "/browse" ? "text-blue-600" : ""
                    }`}
                  >
                    Browse
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300 transform scale-x-0 bg-blue-600 group-hover:scale-x-100 origin-left ${
                        location.pathname === "/browse" ? "scale-x-100" : ""
                      }`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className={`group relative pb-1 text-black transition-colors duration-300 ${
                      location.pathname === "/jobs" ? "text-blue-600" : ""
                    }`}
                  >
                    Jobs
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full transition-all duration-300 transform scale-x-0 bg-blue-600 group-hover:scale-x-100 origin-left ${
                        location.pathname === "/jobs" ? "scale-x-100" : ""
                      }`}
                    ></span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          {user && <NotificationBell userId={user._id} role={user.role} />}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="hover:bg-gray-300">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                  <Avatar className="hover:ring-2 hover:ring-blue-500 transition-all">
                    {user?.profile?.profilePhoto ? (
                      <AvatarImage
                        src={user.profile.profilePhoto}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="text-white" size={24} />
                      </div>
                    )}
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white shadow-lg rounded-xl transition-all duration-300">
                <div className="flex gap-2 items-center">
                  <Avatar>
                    {user?.profile?.profilePhoto ? (
                      <AvatarImage
                        src={user.profile.profilePhoto}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="text-white" size={24} />
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-black">{user.fullname}</h4>
                    <p className="text-sm text-black">{user.profile?.bio}</p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-black">
                  {user.role === "student" && (
                    <div className="flex items-center gap-2 hover:text-blue-500">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 hover:text-red-500">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
