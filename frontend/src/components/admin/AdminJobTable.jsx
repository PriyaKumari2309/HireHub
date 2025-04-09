import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { Eye } from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs = [], searchJobByText } = useSelector(
    (store) => store.job
  );
  const navigate = useNavigate();

  // Optimize filtering logic using useMemo
  const filteredJobs = useMemo(() => {
    return allAdminJobs.filter((job) =>
      searchJobByText
        ? job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase())
        : true
    );
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posted Jobs</h2>
      <Table className="w-full border-collapse border border-gray-200">
        <TableCaption className="text-gray-600">
          List of your recent posted jobs
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow className="text-gray-700">
            <TableHead className="px-4 py-2 text-left">Company Name</TableHead>
            <TableHead className="px-4 py-2 text-left">Role</TableHead>
            <TableHead className="px-4 py-2 text-left">Date</TableHead>
            <TableHead className="px-4 py-2 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow
              key={job?._id}
              className="hover:bg-gray-100 transition duration-200 border-b border-gray-300"
            >
              {/* Ensure _id is unique */}
              <TableCell>{job?.company?.name || "N/A"}</TableCell>
              <TableCell>{job?.title || "N/A"}</TableCell>
              <TableCell>{job?.createdAt?.split("T")[0] || "N/A"}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-36 bg-white shadow-lg rounded-lg py-2">
                    <div
                      onClick={() => navigate(`/admin/companies/${job._id}`)}
                      className="flex items-center w-fit gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-300 hover:scale-105 cursor-pointer transition-all duration-300 rounded-md shadow-sm"
                    >
                      <Edit2 className="w-4 text-gray-700 group-hover:text-black transition-colors duration-300" />
                      <span className="text-gray-700 font-medium">Edit</span>
                    </div>

                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center w-fit gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-300 hover:scale-105 cursor-pointer transition-all duration-300 rounded-md shadow-sm mt-2"
                    >
                      <Eye className="w-4 text-gray-700 group-hover:text-black transition-colors duration-300" />
                      <span className="text-gray-700 font-medium">
                        Applicants
                      </span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
