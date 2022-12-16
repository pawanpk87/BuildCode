import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../../pages/Home/Home";
import RequestedProjects from "../../pages/RequestedProjects/RequestedProjects";
import Rooms from "../../pages/Rooms/Rooms";
import Profile from "../../pages/Profile/Profile";
import About from "../../pages/About/About";
import Error from "../../pages/BuildCodeError/Error/Error";
import ProjectRequestForm from "../../pages/ProjectRequestForm/ProjectRequestForm";
import RequestedProjectInfo from "../RequestedProjectInfo/RequestedProjectInfo";
import CompletedProjectInfo from "../CompletedProjectInfo/CompletedProjectInfo";
import WriteBlog from "../../pages/WriteBlog/WriteBlog";
import Articles from "../../pages/Articles/Articles";
import ViewArticle from "../../pages/ViewArticle/ViewArticle";
import FilterPage from "../../pages/FilterPage/FilterPage";
import TermsAndCondition from "../../pages/TermsAndCondition/TermsAndCondition";
import UserAchievementData from "../../pages/UserAchievementData/UserAchievementData";
import CompletedProjects from "../../pages/CompletedProjects/CompletedProjects";
import ViewProjectBlog from "../../pages/ViewProjectBlog/ViewProjectBlog";
import UpdateBlog from "../../pages/UpdateBlog/UpdateBlog";
import InterviewExperiences from "../../pages/InterviewExperiences/InterviewExperiences";
import BuildCodeEmailVerificaitonErrior from "../../pages/BuildCodeError/BuildCodeEmailVerificationError";
import OnGoingProjects from "../../pages/OnGoingProjects/OnGoingProjects";
import PrivacyPolicy from "../../pages/PrivacyPolicy/PrivacyPolicy";
import Disclaimer from "../../pages/Disclaimer/Disclaimer";
import ProjectBuilding from "../../pages/Blog/ProjectBuilding/ProjectBuilding";
import BuildCodeWarning from "../../pages/BuildCodeError/BuildCodeWarning";
import BuildCodeBug from "../../pages/BuildCodeError/BuildCodeBug";
import UpdateProjectBlog from "../../pages/UpdateProjectBlog/UpdateProjectBlog";
import ProjectRequestDetails from "../../pages/Blog/ProjectRequestDetails/ProjectRequestDetails";
import ProjectBlogDetails from "../../pages/Blog/ProjectBlogDetails/ProjectBlogDetails";
import MyList from "../../pages/MyList/MyList";
import UserAuthAction from "../../pages/UserAuthAction/UserAuthAction";
import ServerDown from "../../pages/BuildCodeError/ServerDown/ServerDown";

function Main({ setPageSidebar }) {
  return (
    <Routes>
      <Route path="/" element={<Home setPageSidebar={setPageSidebar} />} />

      <Route
        exact
        path="/write"
        element={<WriteBlog setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/write/interview-experience"
        element={
          <WriteBlog
            isInterviewExperience={true}
            setPageSidebar={setPageSidebar}
          />
        }
      />

      <Route
        exact
        path="/project-request"
        element={<ProjectRequestForm setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/projects/:projectUniqueID"
        element={<RequestedProjectInfo setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/projects/updateprojectblog/:projectBlogID"
        element={<UpdateProjectBlog setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/projects/completed/:completedprojectUniqueID"
        element={<CompletedProjectInfo setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/project-blog/:projectblogUniqueID"
        element={<ViewProjectBlog setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/requested-projects"
        element={<RequestedProjects setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/ongoing-projects"
        element={<OnGoingProjects setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/completed-projects"
        element={<CompletedProjects setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/articles/update/:articlUniqueID"
        element={<UpdateBlog setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/articles"
        element={<Articles setPageSidebar={setPageSidebar} />}
      />
      <Route
        exact
        path="/interview-experiences/:company"
        element={<InterviewExperiences setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/rooms/:roomId"
        element={<Rooms setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/users/:profileUserUniqueID"
        element={<Profile setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/users/:profileUserUniqueID/:type"
        element={<UserAchievementData setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/:articlUniqueID"
        element={<ViewArticle setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/search/keywords/:queryString"
        element={<FilterPage setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/search/projects/:skill"
        element={<FilterPage setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/search/tags/:tag"
        element={<FilterPage setPageSidebar={setPageSidebar} />}
      />

      <Route
        path="/__/auth/action"
        element={<UserAuthAction setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/search/peolpe/:people"
        element={<FilterPage setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/me/articles/mylist"
        element={<MyList setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/verify-email"
        element={
          <BuildCodeEmailVerificaitonErrior setPageSidebar={setPageSidebar} />
        }
      ></Route>

      <Route
        exact
        path="/aboutUs"
        element={<About setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/terms-and-conditions"
        element={<TermsAndCondition setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/privacy-policy"
        element={<PrivacyPolicy setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/disclaimer"
        element={<Disclaimer setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/error/:error"
        element={<BuildCodeWarning setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/bug/:error"
        element={<BuildCodeBug setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/server/server-down"
        element={<ServerDown setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/how-to-make-project"
        element={<ProjectBuilding setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/what-is-project-request"
        element={<ProjectRequestDetails setPageSidebar={setPageSidebar} />}
      />

      <Route
        exact
        path="/what-is-project-blog"
        element={<ProjectBlogDetails setPageSidebar={setPageSidebar} />}
      />

      <Route path="*" element={<Error setPageSidebar={setPageSidebar} />} />
    </Routes>
  );
}

export default Main;
