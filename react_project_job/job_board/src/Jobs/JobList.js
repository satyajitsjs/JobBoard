import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Joblists from "./Joblists";

export default function JobList() {
  return (
    <div>
      <section>
        <Navbar />
      </section>
      <section>
        <Joblists />
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}
