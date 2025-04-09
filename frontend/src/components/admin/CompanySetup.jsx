import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput((prev) => ({ ...prev, file }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      navigate("/admin/companies");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <Button
          onClick={() => navigate("/admin/companies")}
          variant="outline"
          className="flex items-center gap-2 text-gray-600 hover:bg-gray-300 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </Button>

        <h1 className="font-bold text-2xl text-gray-800 mb-6 text-center">
          Company Setup
        </h1>

        <form onSubmit={submitHandler} className="space-y-5">
          {["name", "description", "website", "location"].map((field) => (
            <div key={field}>
              <Label className="text-gray-700 capitalize">{field}</Label>
              <Input
                type="text"
                name={field}
                value={input[field]}
                onChange={changeEventHandler}
                className="mt-2 border-gray-300 focus:border-blue-500"
              />
            </div>
          ))}

          <div>
            <Label className="text-gray-700">Company Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md transition-all hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Company"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
