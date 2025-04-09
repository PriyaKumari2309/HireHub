import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJob";

const hasResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Profile Info Card */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm my-8 p-8 transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-start">
          {/* Avatar + Name */}
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 ring-2 ring-purple-200 shadow-md">
              {user?.profile?.profilePhoto ? (
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt={user?.fullname || "Profile Picture"}
                />
              ) : (
                <User className="h-full w-full text-gray-400" />
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {user?.fullname || "No Name"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {user?.profile?.bio || "No bio available"}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="hover:border-purple-400 hover:text-purple-700"
          >
            <Pen className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-3 text-gray-600 text-sm">
          {user?.email && (
            <div className="flex items-center gap-2">
              <Mail className="text-purple-500 w-4 h-4" />
              <span>{user?.email}</span>
            </div>
          )}
          {user?.phoneNumber && (
            <div className="flex items-center gap-2">
              <Contact className="text-purple-500 w-4 h-4" />
              <span>{user?.phoneNumber}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="font-medium text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((skill, idx) => (
                <Badge
                  key={idx}
                  className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-1"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">Not specified</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="mt-6">
          <Label className="text-md font-semibold text-gray-800">Resume</Label>
          <div className="mt-1">
            {hasResume ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={user?.profile?.resume}
                className="text-blue-600 hover:underline text-sm"
              >
                {user?.profile?.resumeOriginalName}
              </a>
            ) : (
              <span className="text-sm text-gray-500">No resume uploaded</span>
            )}
          </div>
        </div>
      </div>

      {/* Applied Jobs Table */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-6 mb-12 transition-all duration-300 hover:shadow-lg">
        <h1 className="font-bold text-lg text-gray-800 mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
