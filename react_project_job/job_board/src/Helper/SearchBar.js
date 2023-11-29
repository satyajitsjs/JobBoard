// SearchBar.js
import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  return (
    <section className="justify-end items-end bg-teal-600">
      <div className="flex flex-col bg-teal-600 ml-96">
        <div className="bg-teal-600 mt-2 flex flex-row justify-between w-12 h-18 md:h-12 pl-4 md:pl-8 items-center rounded-lg shadow-sm">
          <input
            placeholder="Search by post title..."
            className="flex-grow text-lg font-bold text-[#171a20] h-full bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#01614c] focus:ring-[#015240] rounded-md  focus:ring-1 px-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="bg-[#338573] flex justify-center items-center rounded-lg hover:bg-[#004e3d] cursor-pointer h-full">
            <button className="text-2xl font-bold text-white px-6 py-3">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
