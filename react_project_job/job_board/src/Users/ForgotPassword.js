import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function ForgotPassword() {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/update/${id}`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.ok) {
        setSuccessMessage(
          "Password reset link sent successfully. Check your email."
        );
        setErrorMessage("");
      } else {
        const data = await response.json();
        setSuccessMessage("");
        setErrorMessage(data.message || "Password reset request failed.");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("An error occurred during password reset request.");
    }
  };

  return (
    <div>
      <section className="home-section">
        <Navbar />
      </section>

      <section>
        <div className="bg-[#f4f5f7] justify-center w-full items-center p-2 ">
          <div className="text-3xl font-['Poppins'] font-medium ">
            Forgot Password
          </div>
        </div>
      </section>
      <section className="bg-cover bg-no-repeat lg:h-[455px] items-start md:pl-1 md:pr-3">
        <div className="flex min-h-full flex-1 flex-col justify-center">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm border-2 p-10 rounded-lg">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="email"
                    // onChange={handleEmail}
                    // onBlur={emailValidation}
                    // value={email}
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#004e3d] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  // onClick={(e) => login(e)}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#004e3d] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#054d3d] hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#054d3d]"
                >
                  Forgot Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <h2>Forgot Password</h2>
      {successMessage && <div className="text-green-600">{successMessage}</div>}
      {errorMessage && <div className="text-red-600">{errorMessage}</div>} */}
      {/* <form onSubmit={handlePasswordReset}>
        <div>
          <label>Email:</label>
          <input type="email" onChange={handleEmail} value={email} required />
        </div>
        <button type="submit">Request Password Reset</button>
      </form>
      <Link to="/">Back to Login</Link> */}

      <section>
        <Footer />
      </section>
    </div>
  );
}
