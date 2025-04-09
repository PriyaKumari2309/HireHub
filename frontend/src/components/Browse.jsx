import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  //const { user } = useSelector((store) => store.auth);
  const { allJobs } = useSelector((store) => store.job);

  // useEffect(() => {
  //  if (!user) {
  //   navigate("/login");
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);

  //if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Browse Job Listings
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Showing {allJobs.length} result{allJobs.length !== 1 && "s"}
          </p>
        </div>

        {allJobs.length === 0 ? (
          <div className="text-center mt-20">
            <img
              src="/logos/th11.jpg" // add this image in public folder or remove
              alt="No jobs"
              className="mx-auto w-60 h-auto opacity-60"
            />
            <p className="mt-6 text-gray-500 text-lg">
              No jobs found. Try refining your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
