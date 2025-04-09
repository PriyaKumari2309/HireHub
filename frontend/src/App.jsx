import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import socket from "./socket"; // instead of creating a new one

import "./App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/signup";
import Home from "./components/home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/browse", element: <Browse /> },
  { path: "/description/:id", element: <JobDescription /> },
  { path: "/profile", element: <Profile /> },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
]);

function App() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
      console.log("Socket join emitted for:", user._id);
    }
  }, [user]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
