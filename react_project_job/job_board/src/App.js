import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Users/Register";
import Login from "./Users/Login";
import Home from "./Components/Home";
import Joblists from "./Jobs/Joblists";
import Categories from "./CategoriesComponent/Categories";
import UserHome from "./Components/UserHome";
import RecruterHome from "./Components/RecruterHome";
import ViewJob from "./Jobs/ViewJob";
import PostJob from "./Jobs/PostJob";
import Apply from "./Jobs/Apply";
import CategoriesJobs from "./CategoriesComponent/CategoriesJobs";
import ForgotPassword from "./Users/ForgotPassword";
import Protected from "./Users/Protected";
import ProtectedAuth from "./Users/ProtectedAuth";
import Update from "./Components/Update";
import JobInfo from "./Jobs/JobInfo";
import ProtectedRole from "./Users/ProtectedRole";
import ProtectedUser from "./Users/ProtecedUser";
import CreateCategories from "./CategoriesComponent/CreateCategories";
import CreateBlogPost from "./Posts/CreateBlogPost";
import UpdateBlogPost from "./Posts/UpdataBlogPost";
import ViewOwnPosts from "./Posts/ViewOwnPosts";
import JobList from "./Jobs/JobList";
import ViewBlogHome from "./Posts/ViewBlogHome";
import ViewBlogPost from "./Posts/ViewBlogPost";
import ViewPostWithComments from "./Posts/ViewPostWithComments";
import ViewApplicant from "./Jobs/ViewApplicant";
import CategoriesHome from "./CategoriesComponent/CategoriesHome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Protected Component={Home} />} />
          <Route
            exact
            path="/userhome"
            element={<Protected Component={UserHome} />}
          />
          <Route
            exact
            path="/recruterhome"
            element={<ProtectedRole Component={RecruterHome} />}
          />
          <Route path="/login" element={<ProtectedAuth Component={Login} />} />
          <Route
            path="/register"
            element={<ProtectedAuth Component={Register} />}
          />
          <Route
            path="/categories"
            element={<Protected Component={Categories} />}
          />
          <Route path="/" element={<Protected Component={CategoriesHome} />} />
          <Route
            path="/categories/:categoryId"
            element={<Protected Component={CategoriesJobs} />}
          />
          <Route
            path="/joblists"
            element={<Protected Component={Joblists} />}
          />
          <Route
            path="/viewjobs/:id"
            element={<Protected Component={ViewJob} />}
          />
          <Route
            path="/postjob"
            element={<ProtectedRole Component={PostJob} />}
          />
          <Route
            path="/applyjob/:id"
            element={<ProtectedUser Component={Apply} />}
          />
          <Route
            path="/forgot-password"
            element={<ProtectedAuth Component={ForgotPassword} />}
          />
          <Route
            path="/update/:id"
            element={<ProtectedUser Component={Update} />}
          />
          <Route
            path="/JobInfo/:id"
            element={<ProtectedRole Component={JobInfo} />}
          />
          <Route
            path="/createcategories"
            element={<Protected Component={CreateCategories} />}
          />
          <Route path="/joblist" element={<Protected Component={JobList} />} />

          <Route
            path="/createblogpost"
            element={<Protected Component={CreateBlogPost} />}
          />

          <Route path="/viewbloghome" element={<ViewBlogHome />} />
          <Route
            path="/updatepost/:id"
            element={<Protected Component={UpdateBlogPost} />}
          />
          <Route
            path="/viewownpost"
            element={<Protected Component={ViewOwnPosts} />}
          />
          <Route path="/viewpost" element={<ViewBlogPost />} />
          <Route
            path="/viewpostwithcomments/:id"
            element={<Protected Component={ViewPostWithComments} />}
          />

          <Route
            path="/JobInfo/:jobId/view/:applicantId"
            element={<Protected Component={ViewApplicant} />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
