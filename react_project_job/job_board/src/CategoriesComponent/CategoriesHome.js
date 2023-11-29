import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JbApi from "../Helper/JbApi";

const CategoriesHome = () => {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(5);
  const isLoggedIn = !!localStorage.getItem("user-info");
  const token = localStorage.getItem("user-token");

  const fetchData = async () => {
    const response = await JbApi("GET", "/categories", token);
    const data = response?.data;
    setCategories(data?.category);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div>
      <section>
        <div className="bg-[#f6f7fa]">
          <div className="whitespace-nowrap text-3xl font-['Poppins'] font-semibold leading-[80px] w-full">
            All Popular Categories
          </div>
          {isLoggedIn ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categories.slice(0, visibleCategories).map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="bg-white relative flex flex-col w-232px h-191px items-center pt-8 pb-20 px-20"
                >
                  <div className="w-1/2 text-xl font-['Poppins'] font-semibold leading-[80px] absolute top-24 left-16 h-20">
                    {category.name}
                  </div>
                  <div className="bg-[url(https://file.rendit.io/n/syb5jbXT4XF7xGGYRGN7.svg)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-center w-20 h-20 shrink-0 items-center">
                    <img
                      src="https://file.rendit.io/n/L69V60YZM0RaUXmELNLa.svg"
                      className="min-h-0 min-w-0 w-6"
                      alt=""
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <h1>Please Login First</h1>
          )}
        </div>
        <Link to={"/categories"}>
          <div className="flex justify-center">
            <div className="bg-[#338573] flex justify-center items-center w-40 h-12 rounded-lg">
              <button className="text-white text-base font-semibold hover:opacity-80 focus:outline-none">
                View More
              </button>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default CategoriesHome;
