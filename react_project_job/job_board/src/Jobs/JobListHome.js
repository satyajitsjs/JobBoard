import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loadings from "../image/Loading";
import JbApi from "../Helper/JbApi";

export default function JobListHome() {
  const [jobData, setJobData] = useState([]);
  const token = localStorage.getItem("user-token");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const userRole = userInfo.user_role;

  async function fetchJobData() {
    const response = await JbApi("GET", "/jobs", token);
    let data = response?.data;
    const sortedJobs = data?.Joblists.sort((a, b) => {
      return new Date(b?.job?.created_at) - new Date(a?.job?.created_at);
    });
    setJobData(sortedJobs);
  }

  useEffect(() => {
    if (token) {
      fetchJobData();
    }
  }, []);

  const displayedJobs = jobData ? jobData.slice(0, 5) : [];

  if (!jobData || jobData.length === 0) {
    return "The Joblist is empty";
  }

  return (
    <>
      <div className="whitespace-nowrap text-3xl font-['Poppins'] font-semibold leading-[80px] w-full">
        All Popular Listed jobs
      </div>
      <section className="w-full">
        {displayedJobs.length > 0 ? (
          displayedJobs.map((job) => (
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
                        <div className="text-m font-[Poppins] font-semibold flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 justify-center"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>{" "}
                          :{job?.applications_count}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-m font-[Poppins] font-semibold flex items-center">
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
                    <div className="text-m font-[Poppins] font-semibold flex items-center">
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
                    <Link to={`/viewjobs/${job?.job.id}`}>
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
            <Loadings />
          </>
        )}
        <br />
        <Link to={"/joblist"}>
          <div className="flex justify-center">
            <div className="bg-[#338573] flex justify-center items-center w-40 h-12 rounded-lg">
              <button className="text-white text-base font-semibold hover:opacity-80 focus:outline-none">
                View More
              </button>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}
