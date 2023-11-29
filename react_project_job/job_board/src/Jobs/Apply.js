import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Apply.css";
import { toast } from "react-toastify";

const Apply = () => {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const handleResumeChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleCoverLetterChange = (event) => {
    setCoverLetter(event.target.value);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("joblist_id", id);
    formData.append("user_id", userInfo.user_id);
    formData.append("cover_letter", coverLetter);
    formData.append("resume_file_path", resume);

    const token = localStorage.getItem("user-token");

    axios
      .post("http://127.0.0.1:8000/api/apply", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-center",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  };

  return (
    <div className="apply-popup">
      <div className="apply-popup-content">
        <h2>Apply for the Job</h2>
        <textarea
          value={coverLetter}
          onChange={handleCoverLetterChange}
          placeholder="Type your cover letter here.."
          rows={6}
          cols={50}
        />
        <input
          type="file"
          onChange={handleResumeChange}
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-  
      hover:file:bg-[#00221b] hover:file:text-[#a6dacf]"
        />
        <button onClick={handleUpload}>Submit</button>{" "}
        <button className="cancel" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Apply;
