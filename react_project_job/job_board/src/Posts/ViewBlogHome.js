import React, { useState, useEffect } from "react";

import "./viewpost.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import JbApi from "../Helper/JbApi";

export default function ViewBlogHome() {
  const [posts, setPosts] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const [visiblePosts, setVisiblePosts] = useState(3);

  const showMessage = () => {
    toast("Please Login First", {
      position: "top-center",
    });
  };

  const fetchData = async () => {
    const response = await JbApi("GET", "/posts");
    const data = response.data;
    const sortedPosts = data?.Posts?.data?.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setPosts(sortedPosts || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <section>
        <div className="whitespace-nowrap text-3xl font-['Poppins'] font-semibold leading-[80px] w-full">
          All Popular Posts
        </div>
        <div className="grid gap-4 md:grid-cols-2 bg-white xl:grid-cols-3">
          {posts.slice(0, visiblePosts).map((post) => (
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
                    <button
                      // onClick={() => handleShowComments(post.id)}
                      className="bg-[#338573] text-white px-6 py-3 rounded-lg hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors duration-200 w-full md:w-auto md:mr-4"
                    >
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
      <br />
      <Link to={"/viewpost"}>
        <div className="flex justify-center">
          <div className="bg-[#338573] flex justify-center items-center w-40 h-12 rounded-lg">
            <button className="text-white text-base font-semibold hover:opacity-80 focus:outline-none">
              View More
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}
