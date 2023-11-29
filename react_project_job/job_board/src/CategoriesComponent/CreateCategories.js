import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import JbApi from "../Helper/JbApi";

export default function CreateCategories() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("user-token");

  function handleCategories(e) {
    setName(e.target.value);
  }

  const fetchData = async () => {
    let item = { name };
    const response = await JbApi("POST", "/categories", token, item);

    if (response.data && response.data.message) {
      toast.success(response.data.message, {
        position: "top-center",
      });
      navigate("/");
    } else {
      toast.error("The name is alread Take.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-[#f4f5f7] flex flex-col justify-center items-center pt-3 pb-4 px-4 sm:px-10">
        <div className="container mx-auto mt-5 px-4">
          <div className="text-center text-3xl font-semibold mb-5">
            Category Name
          </div>
          <input
            type="text"
            value={name}
            onChange={handleCategories}
            className="w-full p-2 border border-indigo-950 rounded-lg mb-3"
            placeholder="Enter Category Name"
          />
          <button
            className="w-full py-2 rounded bg-green-900 hover:bg-emerald-500 text-white font-semibold"
            onClick={fetchData}
          >
            Submit
          </button>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
