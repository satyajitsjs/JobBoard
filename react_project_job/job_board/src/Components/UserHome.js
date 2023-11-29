import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loadings from "../image/Loading";
import { toast } from "react-toastify";
import ViewOwnPosts from "../Posts/ViewOwnPosts";
import JbApi from "../Helper/JbApi";
import DeleteConfirmation from "../Helper/DeleteConfirmation";

export default function UserHome() {
  const [apply, setApply] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("user-token");

  const handleDelete = (id) => {
    toast.info(
      <DeleteConfirmation
        fetchData={fetchData}
        url={`/apply/${id}`}
        token={token}
      />,
      {
        position: "top-right",
      }
    );
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await JbApi("GET", "/apply", token);
    const data = response?.data;
    setApply(data?.Apply || []);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) {
    return <Loadings />;
  }

  return (
    <div>
      <Navbar />
      <section>
        <div className="flex flex-col w-full">
          <div className="bg-[#f4f5f7] flex flex-col justify-center items-center pt-3 pb-4 px-4 sm:px-10">
            <div className="text-3xl font-['Poppins'] font-medium leading-[80px]">
              My Applied List
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cover bg-no-repeat lg:h-[700px] items-start md:pl-1 md:pr-3">
        <br />{" "}
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Id
              </th>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Title
              </th>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Company Name
              </th>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Location
              </th>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Cover Letter
              </th>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Resume
              </th>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Status
              </th>
              <th className="border-solid px-4 py-3 border-[#353030] h-[2px]">
                Comment
              </th>
              <th className="border-solid border-[#353030] h-[2px]"></th>
            </tr>
          </thead>
          <tbody>
            {apply.length > 0 ? (
              apply.map((app) => (
                <tr key={app.id}>
                  <td className="border-solid border-[#353030]">{app.id}</td>
                  <td className="border-solid border-[#353030]">{app.title}</td>
                  <td className="border-solid border-[#353030]">
                    {app.company_name}
                  </td>
                  <td className="border-solid border-[#353030]">
                    {app.location}
                  </td>
                  <td className="border-solid border-[#353030]">
                    {app.cover_letter}
                  </td>
                  <td className="border-solid border-[#353030]">
                    {app.resume_file_path}
                  </td>
                  <td
                    className={`border-solid border-[#353030] ${
                      app.status === "Pending"
                        ? "text-blue-600"
                        : app.status === "Approved"
                        ? "text-green-600"
                        : app.status === "Rejected"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {app.status}
                  </td>
                  <td className="border-solid border-[#353030]">
                    {app.discription}
                  </td>
                  <td className="border-solid border-[#353030]">
                    <button
                      onClick={(e) => handleDelete(app.id)}
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
        <ViewOwnPosts />
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}
