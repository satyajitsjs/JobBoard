import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import "./viewpost.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../Components/Pagination";
import JbApi from "../Helper/JbApi";
import SearchBar from "../Helper/SearchBar";

export default function ViewPost() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const token = localStorage.getItem("user-token");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const showMessage = () => {
    toast("Please Login First", {
      position: "top-center",
    });
  };

  useEffect(() => {
    const fetchPosts = async (pageNumber) => {
      try {
        const response = await JbApi("GET", `/posts?page=${pageNumber}`, token);
        const sortedPosts = response?.data?.Posts?.data?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPosts();
  }, [currentPage, token]);

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
  };

  // const filteredPosts = posts.filter((post) =>
  //   post.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);
  // const offset = currentPage * itemsPerPage;
  // const displayedPosts = filteredPosts.slice(offset, offset + itemsPerPage);

  return (
    <>
      <section>
        <Navbar />
      </section>
      <section className="justify-end items-end bg-teal-600">
        {" "}
        <SearchBar onSearch={handleSearch} />
      </section>

      <section className="bg-teal-600">
        <div className="grid gap-4 md:grid-cols-2 bg-teal-600 xl:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#E2D1F9] shadow-lg rounded-lg p-4 mt-2"
            >
              <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
              <div className="mb-4">
                <img
                  src={`http://localhost:8000/storage/images/${post.image_path}`}
                  alt={post.image_path}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <p className="mb-4">{post.content}</p>
              <p className="text-gray-500 mb-2">
                <span className="font-bold">Slug:</span> {post.slug}
              </p>
              {post.user && (
                <p className="text-gray-500 mb-2">
                  <span className="font-bold">User Name:</span> {post.user.name}
                </p>
              )}
              <p className="text-gray-500 mb-2">
                <span className="font-bold">Status:</span> {post.status}
              </p>
              {userInfo ? (
                <div className="flex flex-wrap mt-5">
                  <Link to={`/viewpostwithcomments/${post.id}`}>
                    <button className="bg-[#338573] text-white px-6 py-3 rounded-lg hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors duration-200 w-full md:w-auto md:mr-4">
                      View Details
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap mt-5">
                  <button
                    onClick={showMessage}
                    className="bg-[#338573] text-white px-6 py-3 rounded-lg hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors duration-200 w-full md:w-auto md:mr-4"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <div className="mt-4 md:mt-6">
        {posts.length > 0 && posts.last_page > 1 && (
          <Pagination
            pageCount={posts.last_page}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            previousPageUrl={posts.prev_page_url}
            nextPageUrl={posts.next_page_url}
          />
        )}
      </div>
      <section>
        <Footer />
      </section>
    </>
  );
}
