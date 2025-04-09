import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Table className="min-w-full border border-gray-200 rounded-lg">
        <TableCaption className="text-gray-500 text-sm">
          A list of your applied jobs
        </TableCaption>
        <TableHeader className="bg-gray-100 text-gray-700">
          <TableRow className="text-sm">
            <TableHead className="p-3">Date</TableHead>
            <TableHead className="p-3">Job Role</TableHead>
            <TableHead className="p-3">Company</TableHead>
            <TableHead className="p-3 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan="4" className="text-center py-6 text-gray-500">
                🚀 You haven't applied for any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow
                key={appliedJob._id}
                className="hover:bg-gray-200 transition duration-200"
              >
                <TableCell className="p-3 text-gray-700">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="p-3 font-medium text-gray-800">
                  {appliedJob.job?.title}
                </TableCell>
                <TableCell className="p-3 text-gray-700">
                  {appliedJob.job?.company?.name}
                </TableCell>
                <TableCell className="p-3 text-right">
                  <Badge
                    className={`px-3 py-1 text-white rounded-full transition-all ${
                      appliedJob?.status === "rejected"
                        ? "bg-red-500"
                        : appliedJob.status === "pending"
                        ? "bg-gray-500"
                        : "bg-green-500"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
