import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Users, BadgeCheck } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 rounded-2xl shadow-md bg-white border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      {/* Company Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-purple-600" />
          <h2 className="text-md font-medium text-gray-800">
            {job?.company?.name}
          </h2>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          India
        </p>
      </div>

      {/* Job Title & Description */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black mb-2">{job?.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>
      </div>

      {/* Job Details Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge
          variant="outline"
          className="text-sm border-purple-300 text-purple-700 font-semibold flex items-center gap-1"
        >
          <Users className="w-4 h-4" /> {job?.position} Position
        </Badge>
        <Badge
          variant="outline"
          className="text-sm border-red-300 text-red-600 font-semibold flex items-center gap-1"
        >
          <BadgeCheck className="w-4 h-4" /> {job?.jobType}
        </Badge>
        <Badge
          variant="outline"
          className="text-sm border-green-300 text-green-700 font-semibold flex items-center gap-1"
        >
          <DollarSign className="w-4 h-4" /> ₹ {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
