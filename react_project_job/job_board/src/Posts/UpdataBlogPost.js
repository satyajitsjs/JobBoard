import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import "./viewpost.css";
import JbApi from "../Helper/JbApi";

const UpdateBlogPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [image_path, setImage_path] = useState(null);
  const token = localStorage.getItem("user-token");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSlugChange = (event) => {
    setSlug(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    const fetchBlogPost = async () => {
      const response = await JbApi("GET", `/posts/${id}`, token);
      const postData = response.data.posts;
      setTitle(postData.title);
      setContent(postData.content);
      setSlug(postData.slug);
      setStatus(postData.status);
      setImage_path(postData.image_path);
    };

    fetchBlogPost();
  }, [id, token]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage_path(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("slug", slug);
    formData.append("status", status);
    formData.append("user_id", userInfo.user_id);

    if (image_path) {
      formData.append("image_path", image_path);
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "X-HTTP-Method-Override": "PUT",
            Accept: "application/json",
          },
        }
      );
      if (response) {
        toast("Blog Post Updated successfully:");
        navigate("/viewpost");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col justify-between"
      style={{
        textAlign: "left",
      }}
    >
      <section>
        <Navbar />
      </section>
      <div className="container mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Update The Blog Post</h1>
        <div className="mb-6">
          <label htmlFor="title" className="block font-semibold mb-2">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="input-create rounded px-4 py-2 focus:outline-none bg-white focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="slug" className="block font-semibold mb-2">
            Slug:
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            className="input-create rounded px-4 py-2 focus:outline-none bg-gray-100 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block font-semibold mb-2">
            Content:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="input-create rounded px-4 py-2 h-40 focus:outline-none bg-gray-100 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="image" className="block font-semibold mb-2">
            Upload Image:
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            accept=".jpeg,.jpg,.png,.gif"
            className="block w-full text-sm text-white
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-black file:text-white  
          hover:file:bg-indigo-700 hover:file:text-[#a6dacf]"
          />
        </div>
        {imagePreviewUrl && (
          <div className="mb-6">
            <label className="block font-semibold">Selected Image:</label>
            <img
              src={imagePreviewUrl}
              alt="Selected"
              className="h-40 object-contain rounded"
            />
          </div>
        )}

        {image_path && <p>Selected Image: {image_path.name}</p>}

        <div className="mb-6">
          <label className="block font-semibold">Status:</label>
          <div className="mt-2">
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                name="status"
                value="draft"
                onChange={handleStatusChange}
                checked={status === "draft"}
                className="form-radio text-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <span className="ml-2">Draft</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="publish"
                onChange={handleStatusChange}
                checked={status === "publish"}
                className="form-radio text-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <span className="ml-2">Publish</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Submit
        </button>
      </div>

      <section>
        <Footer />
      </section>
    </div>
  );
};

export default UpdateBlogPost;
