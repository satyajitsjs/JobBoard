import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../Components/Footer";
import { emailValidation, passwordValidation } from "./JbFormValidation";
import Navbar from "../Components/Navbar";
import { RegisterHelper } from "../Helper/RegisterHelper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const login = async (e) => {
    e.preventDefault();

    if (!emailValidation(email) || !passwordValidation(password)) {
      return;
    }

    const item = { email, password };
    let response = await RegisterHelper("POST", "/users/login", item);
    response = response.data;
    if (response) {
      localStorage.setItem("user-info", JSON.stringify(response));
      localStorage.setItem("user-token", response.token);
      toast.success("Login Successfully", { position: "top-center" });
      navigate("/");
    } else {
      toast("Login failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login(e);
    }
  };

  return (
    <div>
      <section className="home-section">
        <Navbar />
      </section>

      <section>
        <div className="bg-[#f4f5f7] justify-center w-full items-center p-2 ">
          <div className="text-3xl font-['Poppins'] font-medium ">Login</div>
        </div>
      </section>

      <section className="bg-cover bg-no-repeat lg:h-[900px] items-start md:pl-1 md:pr-3">
        <div className="flex min-h-full flex-1 flex-col justify-center">
          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm border-2 p-10 rounded-lg">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email<span className="text-red-400">*</span>
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    onChange={handleEmail}
                    value={email}
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
                  <div className="text-sm">
                    <Link
                      to={"/forgot-password"}
                      className="font-semibold text-[#004e3d] hover:text-[#24977e]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    name="password"
                    onChange={handlePassword}
                    value={password}
                    required
                    onKeyPress={handleKeyPress}
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#004e3d] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={(e) => login(e)}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#004e3d] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#054d3d] hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#054d3d]"
                >
                  Sign In
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
