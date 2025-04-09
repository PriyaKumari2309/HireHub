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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const navigate = useNavigate();

  const filteredCompanies = useMemo(() => {
    if (!searchCompanyByText) return companies;
    return companies.filter((company) =>
      company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
  }, [companies, searchCompanyByText]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Companies List
      </h2>
      <Table className="w-full border border-gray-200">
        <TableCaption className="text-gray-600">
          Recently registered companies
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow className="text-gray-700">
            <TableHead className="px-4 py-3 text-left">Logo</TableHead>
            <TableHead className="px-4 py-3 text-left">Name</TableHead>
            <TableHead className="px-4 py-3 text-left">Date</TableHead>
            <TableHead className="px-4 py-3 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies?.map((company) => (
            <TableRow
              key={company._id}
              className="hover:bg-gray-100 transition duration-200 border-b border-gray-300"
            >
              <TableCell className="px-4 py-3">
                <Avatar className="h-12 w-12 shadow-md">
                  {company.logo ? (
                    <AvatarImage
                      src={company.logo}
                      alt={company.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center h-12 w-12 bg-gray-300 rounded-full text-gray-700 font-semibold">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Avatar>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-800 font-medium">
                {company.name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600">
                {company.createdAt.split("T")[0]}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <Popover>
                  <PopoverTrigger className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-36 bg-white shadow-lg rounded-lg py-2">
                    <div
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-300 cursor-pointer transition duration-200 rounded-md"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
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

export default CompaniesTable;
