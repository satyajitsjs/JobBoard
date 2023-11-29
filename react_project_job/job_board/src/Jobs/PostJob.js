import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import JbApi from "../Helper/JbApi";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [company_name, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [salry_range, setSalryRange] = useState("");
  const [job_type, setJobType] = useState("#");
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("user-token");

  const userInfo = getUserInfo();

  function getUserInfo() {
    return JSON.parse(localStorage.getItem("user-info"));
  }

  const handelcompanyName = (e) => {
    setCompanyName(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handelRequirements = (e) => {
    setRequirements(e.target.value);
  };

  const handelTitle = (e) => {
    setTitle(e.target.value);
  };

  const handelLocation = (e) => {
    setLocation(e.target.value);
  };

  const handelExperience = (e) => {
    setExperience(e.target.value);
  };

  const handelSalryRange = (e) => {
    setSalryRange(e.target.value);
  };

  const handelQualification = (e) => {
    setQualification(e.target.value);
  };

  const handelJobType = (e) => {
    setJobType(e.target.value);
  };

  const fetchData = async () => {
    const response = await JbApi("GET", "/categories", token);
    const data = response?.data;
    setCategories(data.category);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectionChange = (selectedList) => {
    const selectedIds = selectedList.map((item) => item.id);
    setSelectedIds(selectedIds);
  };

  const handlePostJob = async () => {
    if (
      !title ||
      !description ||
      !requirements ||
      !company_name ||
      !location ||
      !job_type ||
      !experience ||
      !qualification ||
      !salry_range ||
      selectedIds.length === 0
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }
    let item = {
      title,
      description,
      requirements,
      company_name,
      employerId: userInfo.user_id,
      categories: selectedIds,
      location,
      job_type,
      experience,
      qualification,
      salry_range,
    };
    const response = await JbApi("POST", "/jobs", token, item);

    if (response) {
      navigate("/joblist");
      toast.success("Job Created Successfully", {
        position: "top-center",
      });
    } else {
      toast.error("An error occurred during job creation. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-[#f4f5f7] flex flex-col justify-center w-full items-center pt-3 pb-4 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="text-3xl font-['Poppins'] font-medium leading-[3rem] md:leading-[4rem] lg:leading-[5rem] w-full md:w-[80%] lg:w-[70%] xl:w-[60%]">
          Create a Job
        </div>
      </div>

      <div className="border-solid border-[#d6d6d6] bg-white flex flex-col justify-end gap-8 w-full h-[1661px]s px-4 py-4 border rounded-lg">
        <div className="flex flex-row gap-12 items-center text-center mb-10 ml-2">
          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Company
            {"  "}
            Name <span className="text-red-400">*</span>
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col justify-center w-full h-16 px-10 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="Name"
                onChange={handelcompanyName}
                value={company_name}
                required
              />
            </div>
          </div>

          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Company
            {"  "}
            Website
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col justify-center w-full h-16 px-10 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="Website Link"
              />
            </div>
          </div>
        </div>

        <div className="whitespace-nowrap text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left ">
          Job Title<span className="text-red-400">*</span>
          <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pl-8 py-4 border rounded-lg">
            <input
              className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
              placeholder="Title"
              onChange={handelTitle}
              value={title}
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center mb-12 ml-2 mr-1">
          <div className="text-2xl font-Poppins font-medium leading-[80px] w-full md:w-auto text-left">
            Job Category<span className="text-red-400">*</span>
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full md:w-auto items-start pt-5 pb-6 pl-12 border rounded-lg">
              <Multiselect
                className="text-xl font-Inter font-bold text-[#112e2c] h-full px-4 w-full md:w-auto focus:outline-none"
                displayValue="name"
                options={categories}
                onSelect={handleSelectionChange}
                onRemove={handleSelectionChange}
              />
            </div>
          </div>

          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Job Type<span className="text-red-400">*</span>
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <select
                className="text-xl font-['Inter'] font-bold text-[#112e2c] px-4 w-full focus:outline-none"
                placeholder="Full Time"
                onChange={handelJobType}
                value={job_type}
              >
                <option value="#" className="h-5" disabled>
                  --Selecte--
                </option>
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
            Job Location<span className="text-red-400">*</span>
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="Location"
                onChange={handelLocation}
                value={location}
                required
              />
            </div>
          </div>

          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Salary Range<span className="text-red-400">*</span>
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="3 Lpa - 7 Lpa"
                onChange={handelSalryRange}
                value={salry_range}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-12 items-center mb-12 ml-2 mr-1">
          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Experience<span className="text-red-400">*</span>
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="5 Year"
                onChange={handelExperience}
                value={experience}
                required
              />
            </div>
          </div>

          <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
            Qualification<span className="text-red-400">*</span>
            <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
              <input
                className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
                placeholder="B.tech"
                onChange={handelQualification}
                value={qualification}
                required
              />
            </div>
          </div>
        </div>

        <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
          Requirement<span className="text-red-400">*</span>
          <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
            <input
              className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
              placeholder="Html , Css , JavaScript"
              onChange={handelRequirements}
              value={requirements}
              required
            />
          </div>
        </div>

        <div className="text-2xl font-['Poppins'] font-medium leading-[80px] w-full text-left">
          Job Application Link URL
          <div className="border-solid border-[#d6d6d6] bg-white flex flex-col w-full h-16 items-start pt-5 pb-6 pl-12 border rounded-lg">
            <input
              className="text-xl font-['Inter'] font-bold text-[#112e2c] h-full px-4 w-full focus:outline-none"
              placeholder="Job Application Link URL"
            />
          </div>
        </div>

        <div className="text-2xl font-['Poppins'] font-medium w-full text-left">
          Job Description<span className="text-red-400">*</span>
          <textarea
            value={description}
            onChange={handleDescription}
            placeholder="Enter Description"
            className="border-solid border-[#d6d6d6] font-['Poppins'] bg-white w-full h-80 items-start pt-4 pl-12 border rounded-lg"
          ></textarea>
        </div>

        <div className="bg-[#338573] self-end flex flex-col justify-center mr-1 h-16 shrink-0 items-center rounded-lg">
          <button
            onClick={handlePostJob}
            className="whitespace-nowrap text-3xl font-['Inter'] font-bold text-white w-3/5 mx-12"
          >
            Post Job
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
