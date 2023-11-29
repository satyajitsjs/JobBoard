import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user-info");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("user-token");
        localStorage.removeItem("user-info");
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-[#004e3d] text-white py-4 sm:py-6">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          to="/"
          className="text-left text-4xl font-bold capitalize hover:text-slate-900"
        >
          JobsPortal
        </Link>

        <div className="hidden sm:flex space-x-4">
          {isLoggedIn && userInfo ? (
            <>
              {/* {userInfo.user_Name && (
                <div className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">
                  Welcome {userInfo.user_Name}
                </div>
              )} */}

              {userInfo.user_role === "recruter" ? (
                <>
                  <Link
                    to={"/recruterhome"}
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Welcome {userInfo.user_Name}
                  </Link>
                  <Link
                    to="/"
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Home
                  </Link>
                  <Link
                    to={"/postjob"}
                    className="text-center font-bold text-white rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Post a job
                  </Link>
                  <Link
                    to="/joblist"
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Joblists
                  </Link>
                </>
              ) : userInfo.user_role === "jobseeker" ? (
                <>
                  <Link
                    to={"/userhome"}
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Welcome {userInfo.user_Name}
                  </Link>
                  <Link
                    to="/"
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Home
                  </Link>
                  <Link
                    to="/categories"
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/joblist"
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Joblists
                  </Link>
                </>
              ) : (
                <>
                  {" "}
                  <Link
                    to={"/"}
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Welcome {userInfo.user_Name}
                  </Link>{" "}
                  <Link
                    to="/createcategories"
                    className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Create Categories
                  </Link>
                </>
              )}

              <Link
                to="/createblogpost"
                className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
              >
                Create Blog
              </Link>
              <Link
                to="/viewpost"
                className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
              >
                View Blog
              </Link>
              <button
                onClick={handleLogout}
                className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
              >
                Register
              </Link>
              <Link
                to="/viewpost"
                className="font-medium rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
              >
                View Blog
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
