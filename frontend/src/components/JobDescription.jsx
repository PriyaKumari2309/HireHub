import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, DollarSign, Users } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("You need to be logged in to apply for a job.");
      return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedApplications = [
          ...singleJob.applications,
          { applicant: user?._id },
        ];
        dispatch(
          setSingleJob({ ...singleJob, applications: updatedApplications })
        );
        setIsApplied(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to apply for the job";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            {singleJob?.title}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" />
            {singleJob?.location || "India"}
          </p>
        </div>

        <Button
          onClick={!isApplied ? applyJobHandler : null}
          disabled={isApplied || !user}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied
            ? "Already Applied"
            : user
            ? "Apply Now"
            : "Login to Apply"}
        </Button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Badge
          variant="outline"
          className="text-indigo-700 border-indigo-200 font-semibold flex items-center gap-1"
        >
          <Users className="w-4 h-4" /> {singleJob?.position || 1} Positions
        </Badge>
        <Badge
          variant="outline"
          className="text-red-600 border-red-200 font-semibold flex items-center gap-1"
        >
          {singleJob?.jobType}
        </Badge>
        <Badge
          variant="outline"
          className="text-green-700 border-green-200 font-semibold flex items-center gap-1"
        >
          <DollarSign className="w-4 h-4" /> {singleJob?.salary} LPA
        </Badge>
        <Badge
          variant="outline"
          className="text-gray-600 border-gray-200 font-semibold flex items-center gap-1"
        >
          <Calendar className="w-4 h-4" />
          Posted on {singleJob?.createdAt?.split("T")[0]}
        </Badge>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-purple-700">
          Job Details
        </h2>

        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            <span className="font-medium text-gray-900">Role:</span>{" "}
            {singleJob?.title}
          </li>
          <li>
            <span className="font-medium text-gray-900">Location:</span>{" "}
            {singleJob?.location}
          </li>
          <li>
            <span className="font-medium text-gray-900">Description:</span>{" "}
            {singleJob?.description}
          </li>
          <li>
            <span className="font-medium text-gray-900">Experience:</span>{" "}
            {singleJob?.experience} yrs
          </li>
          <li>
            <span className="font-medium text-gray-900">Salary:</span> ₹
            {singleJob?.salary} LPA
          </li>
          <li>
            <span className="font-medium text-gray-900">Total Applicants:</span>{" "}
            {singleJob?.applications?.length || 0}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescription;
