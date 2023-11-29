import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination";
import DeleteConfirmation from "../Helper/DeleteConfirmation";
import JbApi from "../Helper/JbApi";
import Loading from "../image/Loading";

const JobInfo = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const token = localStorage.getItem("user-token");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDownload = (id) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/download/resume/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Resume not found");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `resume_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleDelete = (id) => {
    toast.info(
      <DeleteConfirmation
        fetchData={fetchApplicantsForJob}
        url={`/apply/${id}`}
        token={token}
      />,
      {
        position: "top-right",
      }
    );
  };

  async function fetchApplicantsForJob() {
    setLoading(true);
    const response = await JbApi("GET", `/applicants/${id}`, token);
    const data = response?.data;
    setApplicants(data?.applicants || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchApplicantsForJob();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const getLatestStatus = (applicationStatusList) => {
    if (applicationStatusList && applicationStatusList.length > 0) {
      const sortedStatusList = applicationStatusList.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      return sortedStatusList[0].status;
    }
    return "No Status";
  };

  return (
    <div className="container mx-auto px-4">
      <Navbar />

      <section>
        <section>
          <div className="flex flex-col w-full">
            <div className="bg-[#f4f5f7] flex flex-col justify-center items-center pt-3 pb-4 px-4 sm:px-10">
              <div className="text-3xl font-['Poppins'] font-medium leading-[80px]">
                <h2 className="text-3xl font-medium mb-4" key={applicants?.id}>
                  Applicants for : {applicants.joblist?.title}
                  <br />
                  Job ID : {applicants.joblist?.id}
                  {errorMessage && <p>{errorMessage}</p>}
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cover bg-no-repeat lg:h-[700px] items-start md:pl-1 md:pr-3">
          <br />{" "}
          <table className="w-full">
            <thead>
              <tr>
                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Id
                </th>
                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Title
                </th>

                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Company Name
                </th>

                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Applicant Name
                </th>

                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Applicant Email
                </th>

                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Cover Latter
                </th>

                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Resume
                </th>

                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Status
                </th>

                <th
                  className="border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  Action
                </th>
              </tr>
            </thead>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <tbody>
                  <tr key={applicant.id}>
                    <td
                      className="pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      {" "}
                      {applicant.id}{" "}
                    </td>

                    <td
                      className=" pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      {" "}
                      {applicant.joblist.title}{" "}
                    </td>
                    <td
                      className="pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      {" "}
                      {applicant.joblist.company_name}{" "}
                    </td>
                    <td
                      className="pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      {" "}
                      {applicant.users.name}{" "}
                    </td>
                    <td
                      className="pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      {" "}
                      {applicant.users.email}{" "}
                    </td>
                    <td
                      className="pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      {" "}
                      {applicant.cover_letter}{" "}
                    </td>
                    <td
                      className="pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      {" "}
                      {applicant.resume_file_path}{" "}
                    </td>

                    <td
                      className={`pt-4 border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0 ${
                        getLatestStatus(applicant.application_status) ===
                        "Pending"
                          ? "text-blue-500"
                          : getLatestStatus(applicant.application_status) ===
                            "Approved"
                          ? "text-green-500"
                          : getLatestStatus(applicant.application_status) ===
                            "Rejected"
                          ? "text-red-500"
                          : ""
                      }`}
                      colSpan="2"
                    >
                      {getLatestStatus(applicant.application_status)}
                    </td>

                    <td
                      className="pt-4 border-solid border-[#353030]  mb-1 border-t border-b-0 border-x-0"
                      colSpan="2"
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={(e) => handleDownload(applicant.id)}
                          disabled={loading}
                          className="text-cyan-500 underline hover:text-cyan-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                        </button>
                        <Link
                          to={`/JobInfo/${applicant.joblist.id}/view/${applicant.id}`}
                        >
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        </Link>
                        <button
                          onClick={(e) => handleDelete(applicant.id)}
                          className="text-red-500 underline hover:text-red-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))
            ) : (
              <h1> Application Not Found </h1>
            )}
          </table>
          <div className="mt-4 md:mt-6">
            {applicants.length > 0 && (
              <Pagination
                pageCount={Math.ceil(applicants.length / itemsPerPage)}
                onPageChange={handlePageChange}
                previousLabel="← Previous"
                nextLabel="Next →"
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                containerClassName="pagination-container"
                subContainerClassName="pagination-pages"
                activeClassName="active-page"
              />
            )}
          </div>
          <br />
          <section className="mb-4">
            {/* Add the back button here */}
            <button
              onClick={() => navigate(-1)} // Use navigate with -1 to go back
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Back
            </button>
          </section>
        </section>
      </section>

      <Footer />
    </div>
  );
};

export default JobInfo;
