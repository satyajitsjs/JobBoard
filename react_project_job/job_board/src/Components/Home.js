import React from "react";
import Navbar from "./Navbar";
import "./Home.css";
import Typing from "./Typing";
import Footer from "./Footer";
import ViewBlogHome from "../Posts/ViewBlogHome";
import CategoriesHome from "../CategoriesComponent/CategoriesHome";
import JobListHome from "../Jobs/JobListHome";

export default function Home() {
  const token = localStorage.getItem("user-token");

  return (
    <div>
      <Navbar />
      <section className="bg-[url(https://file.rendit.io/n/ZlYbw2iTA25CUHOXKbWa.png)] bg-cover bg-no-repeat w-full h-[300px] md:h-[500px] lg:h-[700px] items-start md:pl-12 md:pr-32">
        <div className="flex flex-col md:w-3/5">
          <div className="mt-20 ...">
            <Typing />
          </div>
        </div>
      </section>
      <section>
        <CategoriesHome />
      </section>
      {token ? (
        <section>
          <JobListHome />
        </section>
      ) : (
        <>
          <h1>Pleaase Login First</h1>
        </>
      )}

      <section>
        <ViewBlogHome />
      </section>
      <div>
        <Footer />
      </div>
    </div>
  );
}
