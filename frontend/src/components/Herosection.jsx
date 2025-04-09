import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import CategoryCarousel from "./CategoryCarousel";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Gradient Box */}
      <div className="w-[90%] md:w-[80%] lg:w-[75%] rounded-xl bg-gradient-to-r from-purple-800 to-purple-950 text-white py-10 px-6 text-center mt-10">
        {/* Tagline Badge */}
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white text-[#F83002] font-semibold text-sm shadow">
          The No.1 Job Hunt Website
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Search, Apply. <br />
          Land your <span className="text-yellow-400">Dream Job</span>
        </h1>

        {/* Subtext */}
        <p className="mb-6 text-gray-100 text-sm sm:text-base">
          Discover thousands of job opportunities and take the next step in your
          career today!
        </p>

        {/* Search Box */}
        <div className="flex max-w-xl mx-auto w-full bg-white rounded-full overflow-hidden shadow-md h-12 mb-6">
          <input
            type="text"
            placeholder="Find your dream job"
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 text-sm w-full text-gray-700 outline-none h-full"
          />
          <button
            onClick={searchJobHandler}
            className="bg-yellow-400 hover:bg-yellow-500 px-4 flex items-center justify-center h-full rounded-r-full text-black"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Category Carousel */}
        <CategoryCarousel />
      </div>

      {/* Trusted By Section (separated box) */}
      <div className="mt-12 w-[90%] md:w-[80%] lg:w-[75%] bg-white rounded-xl shadow-md py-6 px-6 text-center border border-gray-200">
        <h3 className="text-gray-800 text-xl font-bold mb-4">Trusted by</h3>
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <img
            src="/logos/th.jpg"
            alt="Microsoft"
            className="h-6 sm:h-8 object-contain"
          />
          <img
            src="/logos/th1.jpg"
            alt="Walmart"
            className="h-6 sm:h-8 object-contain"
          />
          <img
            src="/logos/th9.jpg"
            alt="Accenture"
            className="h-6 sm:h-8 object-contain"
          />
          <img
            src="/logos/th8.jpg"
            alt="Samsung"
            className="h-6 sm:h-8 object-contain"
          />
          <img
            src="/logos/th4.jpg"
            alt="Amazon"
            className="h-6 sm:h-8 object-contain"
          />
          <img
            src="/logos/th5.jpg"
            alt="Adobe"
            className="h-6 sm:h-8 object-contain"
          />
          <img
            src="/logos/th10.jpg"
            alt="Samsung"
            className="h-6 sm:h-8 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
