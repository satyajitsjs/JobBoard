import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Loading from "../image/Loading";
import Apply from "./Apply";
import JbApi from "../Helper/JbApi";

const JobPage = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const token = localStorage.getItem("user-token");

  const handleApplyClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  async function fetchJobData() {
    const response = await JbApi("GET", `/jobs/${id}`, token);
    let data = response.data;
    setJobDetails(data?.jobList);
  }

  useEffect(() => {
    fetchJobData();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <Navbar />
      {jobDetails ? (
        <div className="bg-white p-8 mt-4 rounded-lg">
          <div className="text-3xl font-medium mb-2">
            {" "}
            Title : {jobDetails.title}
          </div>
          <div className="text-xl font-light text-[#616161] mb-4">
            Job Type : {jobDetails.job_type} <br />
            Company Name : {jobDetails.company_name}
            <br />
            Location : {jobDetails.location}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div>
              <div className="text-2xl font-bold mb-2">Job Description</div>
              <div className="text-lg font-light text-[#616161] mb-4 text-left">
                {jobDetails.description} to build web applications for our
                company. In this role, you will design and create projects using
                Laravel framework and PHP, and assist the team in delivering
                high-quality web applications, services, and tools for our
                business.
                <br />
                <br />
                <b> Skills Needed : </b> {jobDetails.requirements}
                <br />
                <b>Experince : </b> {jobDetails.experience}
                <br />
                <b>Qulafication : </b> {jobDetails.qualification}
                <br />
                <b>Salray : </b> {jobDetails.salry_range}
                <br />
                <br />
                {jobDetails.description}
                To ensure success as a Laravel developer you should be adept at
                utilizing Laravel's GUI and be able to design a PHP application
                from start to finish. A top-notch Laravel developer will be able
                to leverage their expertise and experience of the framework to
                independently produce complete solutions in a short turnaround
                time.
              </div>

              <div className="text-2xl font-bold mb-2">Responsibilities</div>
            </div>
            <br />

            <ul className="list-disc list-inside ml-6 text-left">
              <li>
                Discussing project aims with the client and development team.
              </li>
              <li>Designing and building web applications using Laravel.</li>
              <li>
                Troubleshooting issues in the implementation and debug builds.
              </li>
              <li>
                Working with front-end and back-end developers on projects.
              </li>
              <li>Testing functionality for users and the backend.</li>
              <li>Ensuring that integrations run smoothly.</li>
              <li>Scaling projects based on client feedback.</li>
              <li>Recording and reporting on work done in Laravel.</li>
              <li>Maintaining web-based applications.</li>
              <li>Presenting work in meetings with clients and management.</li>
            </ul>
          </div>
          {userInfo.user_role === "jobseeker" ? (
            <div className="flex gap-4 mt-5">
              <button
                onClick={handleApplyClick} // Show the Apply popup when clicked
                className="text-base font-semibold px-6 py-3 bg-[#338573] text-white rounded-lg hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors duration-200"
              >
                Apply This Job
              </button>
            </div>
          ) : (
            <div className="flex gap-4 mt-5">
              <Link to={`/jobinfo/${id}`}>
                <button className="text-base font-semibold px-6 py-3 bg-[#338573] text-white rounded-lg hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors duration-200">
                  View Who Apply
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
      {showPopup && <Apply jobId={id} onClose={handleClosePopup} />}{" "}
      {/* Render the Apply popup */}
      <Footer />
    </div>
  );
};

export default JobPage;
