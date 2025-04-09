import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    // Use default values to avoid TypeError
    {
      /*} const { Location = [], Industry = [], Salary = [] } = searchedQuery || {};

    const filteredJobs = allJobs.filter((job) => {
      const matchLocation =
        Location.length === 0 || Location.includes(job.location);

      const matchIndustry =
        Industry.length === 0 || Industry.includes(job.title);

      const matchSalary =
        Salary.length === 0 || Salary.includes(String(job.salary)); // Convert to string for exact match

      return matchLocation && matchIndustry && matchSalary;
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);*/
    }
    if (!searchedQuery) {
      setFilterJobs(allJobs);
      return;
    }

    // If searchedQuery is a string (text search)
    if (typeof searchedQuery === "string") {
      const query = searchedQuery.toLowerCase().trim();

      const filtered = allJobs.filter((job) => {
        return (
          job.title?.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
        );
      });

      setFilterJobs(filtered);
    }

    // If searchedQuery is an object (filter options like Industry, Location, Salary)
    else if (typeof searchedQuery === "object") {
      const { Location = [], Industry = [], Salary = [] } = searchedQuery;

      const filtered = allJobs.filter((job) => {
        const matchLocation =
          Location.length === 0 || Location.includes(job.location);

        const matchIndustry =
          Industry.length === 0 || Industry.includes(job.title);

        const matchSalary =
          Salary.length === 0 || Salary.includes(String(job.salary));

        return matchLocation && matchIndustry && matchSalary;
      });

      setFilterJobs(filtered);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-1/5">
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? (
            <span>Job not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
