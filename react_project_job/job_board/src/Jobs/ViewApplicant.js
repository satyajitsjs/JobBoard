import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import Loadings from "../image/Loading";
import JbApi from "../Helper/JbApi";

export default function ViewApplicant() {
  const [loading, setLoading] = useState(false);
  const { jobId, applicantId } = useParams();
  const [applicant, setApplicant] = useState(null); // Change 'applicants' to 'applicant'
  const token = localStorage.getItem("user-token");
  const [status, setStatus] = useState("#");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  async function fetchApplicantDetails() {
    setLoading(true);
    const response = await JbApi(
      "GET",
      `/applicants/${jobId}/view/${applicantId}`,
      token
    );
    const data = response.data;
    setApplicant(data?.applicant || null);
    setLoading(false);
  }

  useEffect(() => {
    fetchApplicantDetails();
  }, []);

  if (loading) {
    return <Loadings />;
  }

  async function handleFormSubmit(applicantsId) {
    let item = {
      status,
      description,
      application_id: applicantsId,
    };
    await JbApi("POST", "/application/status", token, item);
    fetchApplicantDetails();
  }

  return (
    <>
      <section>
        <Navbar />
      </section>
      <div className="bg-gray-100 p-4">
        {applicant ? (
          <section className="bg-white rounded-lg shadow-md p-4">
            <section className="mb-4">
              <h2 className="text-3xl font-medium">
                Applicants for: {applicant.joblist.title}
                <br />
                Job ID: {applicant.joblist.id}
              </h2>
            </section>

            <section
              style={{
                textAlign: "left",
              }}
            >
              <h2>User Details</h2>
              <p>User ID: {applicant.users.id}</p>
              <p>Name: {applicant.users.name}</p>
              <p>Email: {applicant.users.email}</p>
              {/* Add other user data fields as needed */}
            </section>
            <br />
            <section
              className="mb-4"
              style={{
                textAlign: "left",
              }}
            >
              <h2>Statuses</h2>
              <ul>
                {applicant.application_status.map((statusData) => (
                  <li key={statusData.id} className="mb-2">
                    <p
                      className={`${
                        statusData.status === "Pending"
                          ? "text-blue-500"
                          : statusData.status === "Approved"
                          ? "text-green-500"
                          : statusData.status === "Rejected"
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      Status: {statusData.status}
                    </p>
                    <p>Comment: {statusData.discription}</p>
                    <p>
                      Status Time :{" "}
                      {new Date(statusData.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-4">
              <label htmlFor="status" className="mr-2">
                Status:
              </label>
              <select
                name="status"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1"
              >
                <option value="#" disabled>
                  {" "}
                  --Select--{" "}
                </option>
                <option value="Pending" className="text-blue-600">
                  Pending
                </option>
                <option value="Approved" className="text-green-600">
                  Approved
                </option>
                <option value="Rejected" className="text-red-600">
                  Rejected
                </option>
              </select>

              <label htmlFor="description" className="ml-4">
                Comment:
              </label>
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1"
              />
              <button
                onClick={() => handleFormSubmit(applicant.id)}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
              >
                Submit
              </button>
            </section>
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
        ) : (
          <h1 className="text-3xl font-medium">Application is Not Available</h1>
        )}
      </div>
      <section>
        <Footer />
      </section>
    </>
  );
}
