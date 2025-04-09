import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Graphic Designer",
  "Software Developer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Carousel>
        <CarouselContent>
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="basis-2/3 md:basis-1/2 lg:basis-1/3"
            >
              <Button
                onClick={() => searchJobHandler(cat)}
                variant="outline"
                className="rounded-full text-sm text-gray-800 bg-white hover:bg-yellow-400 hover:text-black focus:outline-none focus:ring-0 w-full"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
