import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValues, setSelectedValues] = useState({
    Location: "",
    Industry: "",
    Salary: "",
  });

  const dispatch = useDispatch();

  const changeHandler = (type, value) => {
    setSelectedValues((prev) => ({ ...prev, [type]: value }));
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValues));
  }, [selectedValues]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3 mb-4" />
      {filterData.map((data, index) => (
        <div key={index} className="mb-4">
          <h1 className="font-semibold mb-2">{data.filterType}</h1>
          <RadioGroup
            value={selectedValues[data.filterType]}
            onValueChange={(val) => changeHandler(data.filterType, val)}
          >
            {data.array.map((item, idx) => {
              const itemId = `${data.filterType}-${idx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
