import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SearchBar from "../Helper/SearchBar";
import JbApi from "../Helper/JbApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("user-token");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section>
        <Navbar />
      </section>

      <section className="justify-end items-end bg-teal-600"> </section>
      <SearchBar onSearch={handleSearch} />
      <section>
        <div className="bg-[#f6f7fa]">
          <br />
          <div className="whitespace-nowrap text-3xl font-['Poppins'] font-semibold leading-[80px] w-full">
            All Popular Categories
          </div>
          <br />{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className={
                  "bg-white relative flex flex-col w-232px h-191px items-center pt-8 pb-20 px-20 "
                }
              >
                <div className="w-1/2 text-xl font-['Poppins'] font-semibold leading-[80px] absolute top-24 left-16 h-20">
                  {category.name}
                </div>
                <div className="bg-[url(https://file.rendit.io/n/syb5jbXT4XF7xGGYRGN7.svg)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-center w-20 h-20 shrink-0 items-center">
                  <img
                    src="https://file.rendit.io/n/L69V60YZM0RaUXmELNLa.svg"
                    className="min-h-0 min-w-0 w-6"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default Categories;
