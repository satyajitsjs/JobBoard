import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../Components/Footer";
import {
  nameValidation,
  emailValidation,
  passwordValidation,
} from "./JbFormValidation";
import Navbar from "../Components/Navbar";
import { RegisterHelper } from "../Helper/RegisterHelper";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const signUp = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    if (
      !nameValidation(name) ||
      !emailValidation(email) ||
      !passwordValidation(password)
    ) {
      return;
    }

    try {
      const item = { name, email, password, role };
      const response = await RegisterHelper("POST", "/users/register", item);
      if (response.status === 200) {
        toast.success("Register Successfully", {
          position: "top-center",
        });
        navigate("/login");
      } else {
        toast.error("Register failed. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred during Register. Please try again.", {
        position: "top-center",
      });
      console.error(error);
    }
  };

  return (
    <div>
      <section className="home-section">
        <Navbar />
      </section>

      <section>
        <div className="bg-[#f4f5f7] justify-center w-full items-center p-2 ">
          <div className="text-3xl font-['Poppins'] font-medium ">Register</div>
        </div>
      </section>

      <section className="bg-cover bg-no-repeat lg:h-[900px] items-start md:pl-1 md:pr-3">
        <div className="flex min-h-full flex-1 flex-col justify-center">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm border-2 p-10 rounded-lg">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Name<span className="text-red-400">*</span>
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    onChange={handleInputChange}
                    value={formData.name}
                    name="name"
                    id="name"
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#004e3d] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email<span className="text-red-400">*</span>
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="email"
                    onChange={handleInputChange}
                    value={formData.email}
                    name="email"
                    id="email"
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#004e3d] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Password<span className="text-red-400">*</span>
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    name="password"
                    id="password"
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#004e3d] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Role<span className="text-red-400">*</span>
                  </label>
                </div>
                <div className="mt-2">
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="recruter"
                      onChange={handleInputChange}
                      checked={formData.role === "recruter"}
                      required
                      className="default:ring-2 ..."
                    />
                    Recruiter
                  </label>{" "}
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="jobseeker"
                      onChange={handleInputChange}
                      checked={formData.role === "jobseeker"}
                      required
                      className="default:ring-2 ..."
                    />
                    JobSeeker
                  </label>
                </div>
              </div>

              <div>
                <button
                  onClick={(e) => signUp(e)}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#004e3d] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#054d3d] hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}
