import axios from "axios";
import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("user-token");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const [imagePreview, setImagePreview] = useState(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    const slug = event.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
    setSlug(slug);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSlugChange = (event) => {
    setSlug(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("slug", slug);
    formData.append("status", status);
    formData.append("image_path", image);
    formData.append("user_id", userInfo.user_id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      if (response) {
        // const data = await response.json();
        navigate("/viewpost");
        toast("Blog Post created successfully:");
      }
    } catch (error) {
      toast("Error:", error);
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
        <h1 className="text-3xl font-bold mb-6">Create a New Blog Post</h1>
        <div className="mb-6">
          <label htmlFor="title" className="block font-semibold mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="input-create border rounded px-4 py-2 focus:outline-none bg-gray-100 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="slug" className="block font-semibold mb-2">
            Slug <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            className="input-create border rounded px-4 py-2 focus:outline-none bg-gray-100 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block font-semibold mb-2">
            Content <span className="text-red-400">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="input-create w-96 border rounded px-4 py-2 h-40 focus:outline-none bg-gray-100 focus:border-blue-500"
            require
          />
        </div>
        <div className="mb-6">
          <label htmlFor="image" className="block font-semibold mb-2">
            Upload Image <span className="text-red-400">*</span>
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
          {imagePreview && (
            <div>
              <img
                src={imagePreview}
                alt="Image Preview"
                className="max-w-xs h-48 mt-2"
              />
            </div>
          )}
        </div>
        <div className="mb-6">
          <label className="block font-semibold">
            Status <span className="text-red-400">*</span>
          </label>
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

export default CreateBlogPost;
