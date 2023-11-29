import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../image/Loading";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import JbApi from "../Helper/JbApi";

const CategoryJobs = () => {
  const { categoryId } = useParams();
  const [categoryJobs, setCategoryJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = !!localStorage.getItem("user-info");
  const token = localStorage.getItem("user-token");

  useEffect(() => {
    fetchCategoryJobs();
  }, [categoryId, token]);

  const fetchCategoryJobs = async () => {
    setLoading(true);
    setError(null);
    const response = await JbApi(
      "GET",
      `/categories/${categoryId}/jobs`,
      token
    );
    setCategoryJobs(response.data?.jobs);
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!categoryJobs || categoryJobs.length === 0) {
    return "The Joblist is empty";
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <section>
        <Navbar />
      </section>
      <section className="mb-2">
        <div className="container mx-auto my-4">
          <section className="bg-cover items-start md:pl-1 md:pr-3">
            {isLoggedIn ? (
              <>
                {categoryJobs.length > 0 ? (
                  categoryJobs.map((job) => (
                    <Link to={`/viewjobs/${job?.id}`} key={job?.id}>
                      <div
                        className="border-solid border-[#efeff0] shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.15)] bg-white flex flex-row items-center border rounded-lg"
                        key={job.id}
                      >
                        <div className="bg-[#004e3d] ml-10 px-8 py-2">
                          <div className="text-5xl font-['Poppins'] font-bold leading-[80px] text-white">
                            J
                          </div>
                        </div>
                        <div className="flex flex-col flex-grow p-6">
                          <div className="text-sm font-['Poppins'] leading-[20px] mb-3">
                            {job?.company_name}
                          </div>
                          <div className="text-2xl font-['Poppins'] font-semibold leading-[30px] mb-3">
                            {job.title}
                          </div>
                          <div className="flex flex-row justify-between items-center">
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
                              {job?.location}
                            </div>
                            <img
                              src="https://file.rendit.io/n/KbUv1Il0s0OQGo6TElYB.svg"
                              alt="Icon 2"
                              className="w-5 h-5"
                            />
                          </div>
                        </div>
                        <div className="p-6">
                          <div className=" mr-5 w-32 h-16 bg-[#338573] rounded-lg flex items-center justify-center">
                            <Link to={`/viewjobs/${job.id}`}>
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
                  <Loading />
                )}
              </>
            ) : (
              <>
                <div> PLease login First </div>
              </>
            )}
          </section>
        </div>
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
};

export default CategoryJobs;
