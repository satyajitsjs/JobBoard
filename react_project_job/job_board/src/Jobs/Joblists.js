import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../image/Loading";
import Pagination from "../Components/Pagination";
import JbApi from "../Helper/JbApi";

const Joblists = ({ totalDisplayJOb }) => {
  const [jobData, setJobData] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState("");
  const [salaryRangeFilter, setSalaryRangeFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobListUrls, setJobListUrls] = useState({});
  const token = localStorage.getItem("user-token");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const [currentPage, setCurrentPage] = useState(1);
  const userRole = userInfo.user_role;

  const handelLocationFilter = (e) => {
    setLocationFilter(e.target.value);
  };

  const handelExperienceFilter = (e) => {
    setExperienceFilter(e.target.value);
  };

  const handelQualificationFilter = (e) => {
    setQualificationFilter(e.target.value);
  };

  const handelSalryRangeFilter = (e) => {
    setSalaryRangeFilter(e.target.value);
  };

  const handelJobTypeFilter = (e) => {
    setJobTypeFilter(e.target.value);
  };

  async function fetchJobData(pageNumber) {
    setLoading(true);
    const response = await JbApi("GET", `/jobs?page=${pageNumber}`, token);
    let data = response.data;
    const sortedJobs = data?.Joblists.sort((a, b) => {
      return new Date(b?.job?.created_at) - new Date(a?.job?.created_at);
    });
    setJobListUrls(data?.JoblistUrls);
    setJobData(sortedJobs);
    setLoading(false);
  }

  useEffect(() => {
    if (token) {
      fetchJobData(currentPage);
    }
  }, [currentPage]);

  if (loading) {
    return <Loading />;
  }

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
  };

  const searchByLocation = async () => {
    try {
      setLoading(true);
      const response = await JbApi(
        "GET",
        `/jobs/search/location/${locationFilter}`,
        token
      );
      const data = response?.data?.result;
      setJobData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error while searching by location:", error);
      setLoading(false);
    }
  };

  // Modify the handleEnterKeyPress function to call the filterByLocation function
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter" && e.target.name === "location") {
      searchByLocation();
    }
  };

  // const displayedJobs = jobData.slice(0, totalDisplayJOb);

  if (!jobData || jobData.length === 0) {
    return "The Joblist is empty";
  }

  return (
    <>
      <div className="container mx-auto my-4 ">
        <section className="">
          <div className="grid-flow-col ">
            <div className="bg-white grid-flow-col justify-between w-full h-18 md:h-12 pl-4 md:pl-8 items-center rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Filter by location"
                className="flex-grow text-lg font-bold text-[#171a20] h-full bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#01614c] focus:ring-[#015240] rounded-md  focus:ring-1 px-4"
                value={locationFilter}
                onChange={handelLocationFilter}
                onKeyPress={handleEnterKeyPress}
                name="location"
              />
              <input
                type="text"
                placeholder="Filter by Exprience"
                className="flex-grow text-lg font-bold text-[#171a20] h-full bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#01614c] focus:ring-[#015240] rounded-md  focus:ring-1 px-4"
                value={experienceFilter}
                onChange={handelExperienceFilter}
              />
              <input
                type="text"
                placeholder="Filter by Qualifiaction"
                className="flex-grow text-lg font-bold text-[#171a20] h-full bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#01614c] focus:ring-[#015240] rounded-md  focus:ring-1 px-4"
                value={qualificationFilter}
                onChange={handelQualificationFilter}
              />
              <input
                type="text"
                placeholder="Filter by Salary"
                className="flex-grow text-lg font-bold text-[#171a20] h-full bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#01614c] focus:ring-[#015240] rounded-md  focus:ring-1 px-4"
                value={salaryRangeFilter}
                onChange={handelSalryRangeFilter}
              />
              <select
                className="flex-grow text-lg font-bold text-[#171a20] h-full bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#01614c] focus:ring-[#015240] rounded-md  focus:ring-1 px-4"
                placeholder="Full Time"
                onChange={handelJobTypeFilter}
                value={jobTypeFilter}
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
        </section>
        <br />
        <br />
        <br />
        <section className="w-full">
          {jobData.length > 0 ? (
            jobData.map((job) => (
              <Link to={`/viewjobs/${job?.job?.id}`} key={job?.job?.id}>
                <div
                  className="border-solid mt-4 md:mt-6 border-[#efeff0] shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.15)] bg-white flex flex-col md:flex-row items-center border rounded-lg w-full"
                  key={job?.job?.id}
                >
                  <div className="bg-[#004e3d] p-4 md:ml-10 md:px-8 md:py-2">
                    <div className="text-5xl font-['Poppins'] font-bold leading-[80px] text-white">
                      J
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <div className="text-sm font-['Poppins'] leading-[20px] mb-3">
                      {job?.job?.company_name}
                    </div>
                    <div className="text-2xl font-['Poppins'] font-semibold leading-[30px] mb-3">
                      {job?.job?.title}
                    </div>

                    <div className="flex flex-row justify-between items-center">
                      {userRole === "recruter" ? (
                        <>
                          <div className="text-xl font-[Poppins] font-semibold flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                              />
                            </svg>{" "}
                            :{job?.applications_count}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-xl font-[Poppins] font-semibold flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-teal-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                              />
                            </svg>
                            {job?.job?.location}
                          </div>
                        </>
                      )}
                      <div className="text-xl font-[Poppins] font-semibold flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-teal-600 inline"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {job?.time_distance_from_created}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mr-5 w-full md:w-32 h-16 bg-[#338573] hover:bg-[#19443a] rounded-lg flex items-center justify-center">
                      <Link to={`/viewjobs/${job?.job?.id}`}>
                        <button className="text-2xl font-['Poppins'] leading-[20px] text-white">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <>
              <Loading />
            </>
          )}

          <div className="mt-4 md:mt-6">
            {jobData.length > 0 && jobListUrls.last_page > 1 && (
              <Pagination
                pageCount={jobListUrls.last_page}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                previousPageUrl={jobListUrls.prev_page_url}
                nextPageUrl={jobListUrls.next_page_url}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
};
export default Joblists;
