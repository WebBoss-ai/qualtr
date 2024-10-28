import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="text-center px-4 py-16 bg-gradient-to-r from-zinc-900 to-gray-800 text-white">
      <div className="flex flex-col gap-5 my-10 items-center">
        <span className="px-4 py-2 rounded-full bg-white text-[#6A38C2] font-medium">Connecting Brands with Top Digital Marketing Agencies</span>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Find the Perfect <br /> <span className="text-[#F83002]">Marketing Partner</span> for Your Brand
        </h1>
        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
          Discover and collaborate with the best agencies to boost your brand's online presence. Compare portfolios, case studies, and more!
        </p>
        <div className="flex w-full md:w-[60%] lg:w-[40%] shadow-xl border border-transparent pl-3 rounded-full items-center gap-4 mx-auto bg-white">
          <input
            type="text"
            placeholder="Search for agencies or services"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full text-black py-2 px-4 rounded-l-full"
          />
          <Button onClick={searchHandler} className="rounded-r-full bg-[#F83002] hover:bg-[#D72D0C] transition duration-300 ease-in-out">
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
