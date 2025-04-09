import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-20 px-4 ">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl font-bold text-black">
        <span className="text-[#6A38C2] bg-clip-text">Latest & Top</span> Job
        Openings
      </h1>

      {/* Subtext */}
      <p className="text-lg sm:text-xl text-gray-600 mt-3 animate-fade-in">
        Get your desired job from top companies
      </p>

      {/* Job Cards */}
      {allJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-gray-500 text-lg">
            No jobs available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-5">
          {allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
