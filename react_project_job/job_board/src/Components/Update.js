import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Multiselect from "multiselect-react-dropdown";

export default function Update() {
  const { id } = useParams();
  const token = localStorage.getItem("user-token");
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({ jobList: {}, categories: [] });
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const handelcompanyName = (e) => {
    setJobData({ ...jobData, company_name: e.target.value });
  };

  const handleDescription = (e) => {
    setJobData({ ...jobData, description: e.target.value });
  };

  const handelRequirements = (e) => {
    setJobData({ ...jobData, requirements: e.target.value });
  };

  const handelTitle = (e) => {
    setJobData({ ...jobData, title: e.target.value });
  };

  const handelLocation = (e) => {
    setJobData({ ...jobData, location: e.target.value });
  };

  const handelExperience = (e) => {
    setJobData({ ...jobData, experience: e.target.value });
  };

  const handelSalryRange = (e) => {
    setJobData({ ...jobData, salry_range: e.target.value });
  };

  const handelQualification = (e) => {
    setJobData({ ...jobData, qualification: e.target.value });
  };

  const handelJobType = (e) => {
    setJobData({ ...jobData, job_type: e.target.value });
  };

  const handleSelectionChange = (selectedList) => {
    const selectedIds = selectedList.map((item) => item.id);
    setSelectedIds(selectedIds);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories");
      const data = await response.json();
      setCategories(data.category);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function fetchJobData() {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      let jobd = response.data;
      setJobData(jobd?.jobList);
    } catch (error) {
      console.log("Error:", error);
    }
  }
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const updatedJobData = {
        ...jobData,
        categories: selectedIds,
      };
      const response = await axios.put(
        `http://127.0.0.1:8000/api/jobs/${id}`,
        updatedJobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response) {
        toast("Job Updated SuccessFully", response);
        navigate("/");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJobData();
      fetchData();
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="bg-[#f4f5f7] flex flex-col justify-center w-full items-center pt-3 pb-4 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="text-3xl font-['Poppins'] font-medium leading-[3rem] md:leading-[4rem] lg:leading-[5rem] w-full md:w-[80%] lg:w-[70%] xl:w-[60%]">
          Update a Job
        </div>
      </div>

      <div className="border-solid border-[#d6d6d6] bg-white flex flex-col justify-end gap-8 w-full h-[1661px]s px-4 py-4 border rounded-lg">
        <div className="flex flex-row gap-12 items-center text-center mb-10 ml-2">
          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Company
            {"  "}
            Name
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col justify-center w-full h-16 px-10 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="Name"
                onChange={handelcompanyName}
                value={jobData.company_name}
              />
            </div>
          </div>

          <div className="whitespace-nowrap text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left ">
            Job Title
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pl-8 py-4 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="Title"
                onChange={handelTitle}
                value={jobData.title}
              />
            </div>
          </div>

          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Job Type
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <select
                className="text-xl font-['Inter'] font-bold text-[#112e2c] px-4 w-full focus:outline-none"
                placeholder="Full Time"
                onChange={handelJobType}
                selectedValues={jobData.job_type}
              >
                <option value="FullTime" className="h-5">
                  Full Time
                </option>
                <option value="PartTime" className="h-5">
                  Part Time
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-12 items-center mb-12 ml-2 mr-1">
          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Job Location
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="Location"
                onChange={handelLocation}
                value={jobData.location}
              />
            </div>
          </div>

          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Salary Range
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="3 Lpa - 7 Lpa"
                onChange={handelSalryRange}
                value={jobData.salry_range}
              />
            </div>
          </div>

          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Experience
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="5 Year"
                onChange={handelExperience}
                value={jobData.experience}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-12 items-center mb-12 ml-2 mr-1">
          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Qualification
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="B.tech"
                onChange={handelQualification}
                value={jobData.qualification}
              />
            </div>
          </div>
          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Requirement
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="Html , Css , JavaScript"
                onChange={handelRequirements}
                value={jobData.requirements}
              />
            </div>
          </div>
          <div className="text-2xl font-Poppins font-medium leading-[80px] w-full md:w-auto text-left">
            Job Category
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full md:w-auto items-start pt-5 pb-6 pl-12 border rounded-lg">
              <Multiselect
                className="text-xl font-Inter font-bold text-[#112e2c] h-full px-4 w-full md:w-auto focus:outline-none"
                displayValue="name"
                selectedValues={jobData.categories}
                options={categories}
                onSelect={handleSelectionChange}
                onRemove={handleSelectionChange}
              />
            </div>
          </div>
        </div>

        <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
          Job Description
          <textarea
            value={jobData.description}
            onChange={handleDescription}
            className="border-solid border-[#d6d6d6] bg-white w-full h-80 items-start pt-5 pb-6 pl-12 border rounded-lg"
          ></textarea>
        </div>

        <div className="bg-[#338573] self-end flex flex-col justify-center mr-1 h-16 shrink-0 items-center rounded-lg">
          <button
            onClick={handleUpdateJob}
            className="whitespace-nowrap text-3xl font-['Inter'] font-bold text-white w-3/5 mx-12"
          >
            Update Job
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
