import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate days ago
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Fixed 24 hrs
  };

  // Handle save job
  const handleSaveJob = async (jobId) => {
    if (isSaved || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/user/save-job/${jobId}`, {
        method: "POST", // ✅ FIXED this route
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setIsSaved(true);
        // Optional: Show toast instead of alert
        // toast.success("Job saved successfully!");
      } else {
        alert("Failed to save job.");
      }
    } catch (err) {
      console.error("Failed to save job:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if job is already saved on mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response = await fetch(`/api/v1/user/is-saved/${job._id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [job._id]);

  return (
    <div className="p-6 rounded-2xl shadow-md bg-white border border-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Top section: Posted Date + Bookmark */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {daysAgoFunction(job?.createdAt) === 0
            ? "Posted Today"
            : `${daysAgoFunction(job?.createdAt)} day(s) ago`}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-purple-700"
          onClick={() => handleSaveJob(job?._id)}
          disabled={isSaved || loading}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-4">
        <div className="w-12 h-12 p-2 rounded-full border bg-gray-50 flex items-center justify-center">
          <Avatar className="w-8 h-8">
            <AvatarImage src={job?.company?.logo} alt="logo" />
          </Avatar>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">{job?.company?.name}</h2>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="text-lg font-bold text-black">{job?.title}</h1>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge
          variant="outline"
          className="text-sm border-purple-300 text-purple-700"
        >
          {job?.position} Positions
        </Badge>
        <Badge
          variant="outline"
          className="text-sm border-red-300 text-red-600"
        >
          {job?.jobType}
        </Badge>
        <Badge
          variant="outline"
          className="text-sm border-indigo-300 text-indigo-600"
        >
          ₹ {job?.salary} LPA
        </Badge>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="hover:bg-purple-100 text-purple-700 border-purple-300"
        >
          View Details
        </Button>
        <Button
          className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
          onClick={() => handleSaveJob(job?._id)}
          disabled={isSaved || loading}
        >
          {loading ? "Saving..." : isSaved ? "Saved" : "Save for Later"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
