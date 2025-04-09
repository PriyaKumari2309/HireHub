import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/user/forgot-password",
        { email },
        { withCredentials: true }
      );
      toast.success(data.message);

      // 👇 Redirect to reset-password page after OTP is sent
      navigate("/reset-password");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Forgot Password
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your registered email"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#6A38C2] text-white font-medium py-2 px-4 rounded-lg transition duration-300 hover:bg-[#5b30a6] shadow-md"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
