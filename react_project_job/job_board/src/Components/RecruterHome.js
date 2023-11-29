import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loadings from "../image/Loading";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ViewOwnPosts from "../Posts/ViewOwnPosts";
import Pagination from "./Pagination";
import JbApi from "../Helper/JbApi";
import DeleteConfirmation from "../Helper/DeleteConfirmation";

export default function RecruterHome() {
  const token = localStorage.getItem("user-token");
  const [jobData, setJobData] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  async function fetchJobData() {
    setLoading(true);
    const response = await JbApi("GET", "/jobs", token);
    const data = response?.data?.Joblists;
    console.log(data);
    data.sort(
      (a, b) =>
        new Date(b?.time_distance_from_created) -
        new Date(a?.time_distance_from_created)
    );
    setJobData(data);
    setLoading(false);
  }

  useEffect(() => {
    if (token) {
      fetchJobData();
    }
  }, []);

  if (loading) {
    return <Loadings />;
  }

  const handleDelete = (id) => {
    toast.info(
      <DeleteConfirmation
        fetchData={fetchJobData}
        url={`/jobs/${id}`}
        token={token}
      />,
      {
        position: "top-right",
      }
    );
  };

  const keys = [
    "id",
    "title",
    "requirements",
    "company_name",
    "location",
    "Applied",
    "Posted",
  ];

  const offset = currentPage * itemsPerPage;
  const displayedJobs = jobData
    ? jobData.slice(offset, offset + itemsPerPage)
    : [];

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const sortedDisplayedJobs = displayedJobs.slice().reverse();

  return (
    <div>
      <Navbar />
      <section className="items-start">
        <div className="flex flex-col w-full">
          <div className="bg-[#f4f5f7] flex flex-col justify-center items-center pt-3 pb-4 px-4 sm:px-10">
            <div className="text-3xl font-['Poppins'] font-medium leading-[80px]">
              My Jobs List
            </div>
          </div>
        </div>
      </section>
      <section className="items-start md:pl-1 md:pr-3">
        <br />
        <table className="w-full">
          <thead>
            <tr>
              {" "}
              {keys.map((k, i) => (
                <th
                  className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                  key={i}
                >
                  {k}
                </th>
              ))}
              <th
                className="border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                colSpan="2"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDisplayedJobs.map((d, i) => (
              <tr key={i}>
                <td
                  className="border-solid border-[#353030] h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  {" "}
                  {d?.job?.id}{" "}
                </td>

                <td
                  className="border-solid border-[#353030] mb-1 h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  {" "}
                  {d?.job?.title}{" "}
                </td>

                <td
                  className="border-solid border-[#353030] mb-1 h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  {" "}
                  {d?.job?.requirements}{" "}
                </td>
                <td
                  className="border-solid border-[#353030] mb-1 h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  {" "}
                  {d?.job?.company_name}{" "}
                </td>
                <td
                  className="border-solid border-[#353030]  mb-1 h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  {" "}
                  {d?.job?.location}{" "}
                </td>
                <td
                  className="border-solid border-[#353030]  mb-1 h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  {" "}
                  {d?.applications_count}{" "}
                </td>
                <td
                  className="border-solid border-[#353030]  mb-1 h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  {" "}
                  {d?.time_distance_from_created}{" "}
                </td>
                <td
                  className="border-solid border-[#353030] w-48  mb-1 h-px sm:h-[2px] border-t border-b-0 border-x-0"
                  colSpan="2"
                >
                  <Link to={`/update/${d?.job?.id}`}>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-600 hover:text-blue-900"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(d?.job?.id)}
                    className="text-red-500 underline hover:text-red-700 focus:outline-none py-5 pr-4"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 mb-5">
          {displayedJobs.length > 0 && (
            <Pagination
              pageCount={Math.ceil(jobData.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <br />
        <section>
          <ViewOwnPosts />
        </section>
      </section>
      <footer>
        <section>
          <Footer />
        </section>
      </footer>
    </div>
  );
}
