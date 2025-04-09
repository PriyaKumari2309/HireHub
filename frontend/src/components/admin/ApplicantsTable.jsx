import React from "react";
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
import { MoreHorizontal } from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; // Import dispatch
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (event, status, id) => {
    event.stopPropagation(); // Prevent multiple triggers

    if (!id) {
      console.error("❌ Invalid applicant ID:", id);
      return;
    }

    try {
      console.log(`🔄 Updating status: ${status} for ID: ${id}`);

      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );

      console.log("✅ API Response:", res.data);

      const success = res.data?.success || res.data?.status;
      const message = res.data?.message || "Status updated successfully ✅";

      if (success) {
        toast.success(message);

        // ✅ Update Redux state immediately
        dispatch({
          type: "UPDATE_APPLICANT_STATUS",
          payload: { id, status },
        });
      } else {
        console.error("⚠️ Unexpected API Response Format:", res.data);
        toast.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("🚨 Error updating status:", error.response);
      toast.error(error.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-5">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Applicants List
      </h2>
      <Table className="w-full border-collapse border border-gray-200">
        <TableCaption className="text-gray-600">
          A list of recent applicants
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow className="text-gray-700">
            <TableHead className="px-4 py-2 text-left">Full Name</TableHead>
            <TableHead className="px-4 py-2 text-left">Email</TableHead>
            <TableHead className="px-4 py-2 text-left">Contact</TableHead>
            <TableHead className="px-4 py-2 text-left">Resume</TableHead>
            <TableHead className="px-4 py-2 text-left">Date</TableHead>
            <TableHead className="px-4 py-2 text-left">Status</TableHead>
            <TableHead className="px-4 py-2 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map((item) => (
            <TableRow
              key={item._id}
              className="hover:bg-gray-100 transition duration-200 border-b border-gray-300"
            >
              <TableCell className="px-4 py-3">
                {item?.applicant?.fullname}
              </TableCell>
              <TableCell className="px-4 py-3">
                {item?.applicant?.email}
              </TableCell>
              <TableCell className="px-4 py-3">
                {item?.applicant?.phoneNumber}
              </TableCell>
              <TableCell className="px-4 py-3">
                {item.applicant?.profile?.resume ? (
                  <a
                    className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    href={item?.applicant?.profile?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.applicant?.profile?.resumeOriginalName || "Download"}
                  </a>
                ) : (
                  <span className="text-gray-500">NA</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3">
                {item?.applicant.createdAt.split("T")[0]}
              </TableCell>
              <TableCell className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs transition duration-300 ${
                    item?.status?.toLowerCase() === "accepted"
                      ? "bg-green-500"
                      : item?.status?.toLowerCase() === "rejected"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                >
                  {item?.status || "Pending"}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <Popover>
                  <PopoverTrigger className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-36 bg-white shadow-lg rounded-lg py-2">
                    {shortlistingStatus.map((status, index) => (
                      <div
                        key={status} // ✅ Fix key warning
                        onClick={(e) => statusHandler(e, status, item?._id)}
                        className="px-4 py-2 hover:bg-gray-300 cursor-pointer transition duration-200 rounded-md"
                      >
                        {status}
                      </div>
                    ))}
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

export default ApplicantsTable;
