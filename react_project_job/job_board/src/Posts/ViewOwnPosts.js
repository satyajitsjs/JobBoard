import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../Components/Pagination";
import JbApi from "../Helper/JbApi";
import DeleteConfirmation from "../Helper/DeleteConfirmation";

export default function ViewOwnPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const token = localStorage.getItem("user-token");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const handleDelete = (id) => {
    toast.info(
      <DeleteConfirmation
        fetchData={fetchUserPosts}
        url={`/posts/${id}`}
        token={token}
      />,
      {
        position: "top-right",
      }
    );
  };

  const fetchUserPosts = async () => {
    const response = await JbApi("GET", "/user/posts", token);
    const sortedPosts = response.data.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setUserPosts(sortedPosts);
  };

  const offset = currentPage * itemsPerPage;
  const displayedUserPosts = userPosts.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);
  return (
    <div>
      <section>
        <div className="flex flex-col w-full">
          <div className="bg-[#f4f5f7] flex flex-col justify-center items-center pt-3 pb-4 px-4 sm:px-10">
            <div className="text-3xl font-['Poppins'] font-medium leading-[80px]">
              My Posts
            </div>
          </div>
        </div>
      </section>
      <table className="w-full">
        <thead>
          <tr>
            <th
              className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b"
              colSpan="2"
            >
              Id
            </th>
            <th
              className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b"
              colSpan="2"
            >
              Title
            </th>

            <th
              className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b"
              colSpan="2"
            >
              Content
            </th>
            <th
              className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b"
              colSpan="2"
            >
              Image
            </th>
            <th
              className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b"
              colSpan="2"
            >
              Status
            </th>
            <th
              className="border-solid px-4 pt-3 pb-3 border-[#353030] h-[2px] border-t border-b"
              colSpan="2"
            >
              Actoin
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedUserPosts.map((post) => (
            <tr key={post.id}>
              <td
                className="border-solid border-[#353030] h-px sm:h-[2px] border-t border-b"
                colSpan="2"
              >
                {" "}
                {post.id}{" "}
              </td>
              <td
                className="border-solid border-[#353030] h-px sm:h-[2px] border-t border-b"
                colSpan="2"
              >
                {" "}
                {post.title}{" "}
              </td>
              <td
                className="border-solid border-[#353030] h-px sm:h-[2px] border-t border-b"
                colSpan="2"
              >
                {" "}
                {post.content}{" "}
              </td>
              <td
                className="border-solid py-4 border-[#353030] h-px sm:h-[2px] border-t border-b"
                colSpan="2"
                style={{
                  justifyItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {" "}
                <img
                  src={`http://localhost:8000/storage/images/${post.image_path}`}
                  alt={post.image_path}
                  style={{
                    width: "50px",
                    height: "50px",
                    display:
                      "block" /* To remove any extra space and allow margin auto to work */,
                    margin: "auto" /* To center the image horizontally */,
                  }}
                />
              </td>

              <td
                className="border-solid border-[#353030] h-px sm:h-[2px] border-t border-b"
                colSpan="2"
              >
                {" "}
                {post.status}{" "}
              </td>
              <td
                className="border-solid border-[#353030]  mb-1 border-t border-b"
                colSpan="2"
              >
                <Link to={`/updatepost/${post.id}`}>
                  <button className="text-blue-700 underline hover:text-blue-900 focus:outline-none pt-4">
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                </Link>
                <button onClick={(e) => handleDelete(post.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-500 hover:text-red-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </td>
              <td>
                {/* <button onClick={() => handleEditPost(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post)}>Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 md:mt-6">
        {userPosts.length > 0 && (
          <Pagination
            pageCount={Math.ceil(userPosts.length / itemsPerPage)}
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
    </div>
  );
}
