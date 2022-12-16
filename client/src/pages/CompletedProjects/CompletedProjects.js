import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../../firebase/firebase-config";
import DoneProjectCard from "../../components/DoneProjectCard/DoneProjectCard";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import InfiniteScroll from "react-infinite-scroller";
import { FadingBalls } from "react-cssfx-loading";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./CompletedProjects.css";

function CompletedProjects({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [done, setDone] = useState(false);

  const [
    lastStateOfLatestCompletedProjects,
    setLastStateOfLatestCompletedProjects,
  ] = useState("");
  const [
    lastStateOfMostViewsCompletedProjects,
    setLastStateOfMostViewsCompletedProjects,
  ] = useState("");
  const [lastStateOfTopCompletedProjects, setLastStateOfTopCompletedProjects] =
    useState("");

  const [latestCompletedProjectsArray, setLatestCompletedProjectsArray] =
    useState([]);
  const [
    mostViewsCompletedProjectsArray,
    setMostViewsnterviewExperiencesArray,
  ] = useState([]);
  const [topCompletedProjectsArray, setTopCompletedProjectsArray] = useState(
    []
  );

  const [
    hasMoreDataForLatestCompletedProjects,
    setHasMoreDataForLatestCompletedProjects,
  ] = useState(true);
  const [
    hasMoreDataForMostViewsCompletedProjects,
    setHasMoreDataForMostViewsCompletedProjects,
  ] = useState(true);
  const [
    hasMoreDataForTopCompletedProjects,
    setHasMoreDataForTopCompletedProjects,
  ] = useState(true);

  const [activeOption, setActiveOption] = useState("Latest");

  useEffect(() => {
    if (activeOption === "Latest") {
      setHasMoreDataForLatestCompletedProjects(true);
      const getCompletedProjects = async () => {
        setDone(false);
        const q = query(
          collection(db, "projects"),
          where("status", "==", "completed"),
          orderBy("requestedOn", "desc"),
          limit(21)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempCompletedProjectsArray = [];
            let lastVisible = lastStateOfLatestCompletedProjects;
            querySnapshot.forEach((doc) => {
              tempCompletedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setLatestCompletedProjectsArray(tempCompletedProjectsArray);
            setLastStateOfLatestCompletedProjects(lastVisible);
            setDone(true);
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      getCompletedProjects();
    } else if (activeOption === "Most Views") {
      setHasMoreDataForMostViewsCompletedProjects(true);
      const getCompletedProjects = async () => {
        setDone(false);
        const q = query(
          collection(db, "projects"),
          where("status", "==", "completed"),
          orderBy("requestedOn", "desc"),
          orderBy("totalViews", "desc"),
          limit(21)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempCompletedProjectsArray = [];
            let lastVisible = lastStateOfMostViewsCompletedProjects;
            querySnapshot.forEach((doc) => {
              tempCompletedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setMostViewsnterviewExperiencesArray(tempCompletedProjectsArray);
            setLastStateOfMostViewsCompletedProjects(lastVisible);
            setDone(true);
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      getCompletedProjects();
    } else {
      setHasMoreDataForMostViewsCompletedProjects(true);
      const getCompletedProjects = async () => {
        setDone(false);
        let q = query(
          collection(db, "projects"),
          where("status", "==", "completed"),
          orderBy("requestedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          limit(21)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempCompletedProjectsArray = [];
            let lastVisible = lastStateOfTopCompletedProjects;
            querySnapshot.forEach((doc) => {
              tempCompletedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setTopCompletedProjectsArray(tempCompletedProjectsArray);
            setLastStateOfTopCompletedProjects(lastVisible);
            setDone(true);
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      getCompletedProjects();
    }
  }, [activeOption, navigate]);

  const fetchMoreItems = async () => {
    if (activeOption === "Latest") {
      const getCompletedProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "completed"),
          orderBy("requestedOn", "desc"),
          startAfter(lastStateOfLatestCompletedProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempCompletedProjectsArray = [];
            let lastVisible = lastStateOfLatestCompletedProjects;
            querySnapshot.forEach((doc) => {
              tempCompletedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempCompletedProjectsArray.length === 0) {
              setHasMoreDataForLatestCompletedProjects(false);
            } else {
              setLatestCompletedProjectsArray([
                ...latestCompletedProjectsArray,
                ...tempCompletedProjectsArray,
              ]);
              setLastStateOfLatestCompletedProjects(lastVisible);
            }
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      getCompletedProjects();
    } else if (activeOption === "Most Views") {
      const getCompletedProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "completed"),
          orderBy("requestedOn", "desc"),
          orderBy("totalViews", "desc"),
          startAfter(lastStateOfMostViewsCompletedProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempCompletedProjectsArray = [];
            let lastVisible = lastStateOfMostViewsCompletedProjects;
            querySnapshot.forEach((doc) => {
              tempCompletedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempCompletedProjectsArray.length === 0) {
              setHasMoreDataForMostViewsCompletedProjects(false);
            } else {
              setMostViewsnterviewExperiencesArray([
                ...mostViewsCompletedProjectsArray,
                ...tempCompletedProjectsArray,
              ]);
              setLastStateOfMostViewsCompletedProjects(lastVisible);
            }
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      getCompletedProjects();
    } else {
      const getCompletedProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "completed"),
          orderBy("requestedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          startAfter(lastStateOfTopCompletedProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempCompletedProjectsArray = [];
            let lastVisible = lastStateOfTopCompletedProjects;
            querySnapshot.forEach((doc) => {
              tempCompletedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempCompletedProjectsArray.length === 0) {
              setHasMoreDataForTopCompletedProjects(false);
            } else {
              setTopCompletedProjectsArray([
                ...topCompletedProjectsArray,
                ...tempCompletedProjectsArray,
              ]);
              setLastStateOfTopCompletedProjects(lastVisible);
            }
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      getCompletedProjects();
    }
  };

  const loader =
    activeOption === "Latest" ? (
      hasMoreDataForLatestCompletedProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : activeOption === "Most Views" ? (
      hasMoreDataForMostViewsCompletedProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : hasMoreDataForTopCompletedProjects === true ? (
      <div key="loader" className="loader">
        <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
      </div>
    ) : (
      <div className="no-more-records">
        <span></span>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Completed Projects</title>

        <meta
          name="keywords"
          keywords="Completed Projects, Find Project, Join Team, Make Team, Online Project , Project Ideas, Project Blogs,Create Team, Join Team, Project Blog, Project Blog, Projects"
        ></meta>

        <link href="https://buildcode.org/completed-projects" rel="canonical" />

        <meta content="Completed Projects" itemprop="name" />

        <meta
          content="Find an interesting project and join the team."
          itemprop="description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          itemprop="image"
        />

        <meta content="en_US" property="og:locale" />

        <meta content="projects" property="og:type" />

        <meta
          content="https://buildcode.org/completed-projects"
          property="og:url"
        />

        <meta content="buildcode.org" property="og:site_name" />

        <meta content="Completed Projects" property="og:title" />

        <meta
          content="Find an interesting project and join the team."
          property="og:description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          property="og:image"
        />

        <meta property="og:image:alt" />

        <meta content="summary_large_image" name="twitter:card" />

        <meta content="Completed Projects" name="twitter:title" />

        <meta
          content="Find an interesting project and join the team."
          name="twitter:description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          name="twitter:image"
        />
      </Helmet>
      <br />
      <div className="completed-pro-main-grid">
        <div className="completed-projects-home-page-tag">
          <ul>
            <li>
              <button
                className={activeOption === "Latest" ? "active-option" : ""}
                onClick={() => setActiveOption("Latest")}
              >
                Latest
              </button>
            </li>
            <li>
              <button
                className={activeOption === "Most Views" ? "active-option" : ""}
                onClick={() => setActiveOption("Most Views")}
              >
                Most Views
              </button>
            </li>
            <li>
              <button
                className={activeOption === "Top" ? "active-option" : ""}
                onClick={() => setActiveOption("Top")}
              >
                Top
              </button>
            </li>
          </ul>
        </div>
        <br />
        <br />
        {done === false ? (
          <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
        ) : (
          <InfiniteScroll
            loadMore={fetchMoreItems}
            hasMore={
              activeOption === "Latest"
                ? hasMoreDataForLatestCompletedProjects
                : activeOption === "Most Views"
                ? hasMoreDataForMostViewsCompletedProjects
                : hasMoreDataForTopCompletedProjects
            }
            loader={loader}
          >
            <div className="completed-card-container">
              {activeOption === "Latest" ? (
                latestCompletedProjectsArray.length > 0 ? (
                  latestCompletedProjectsArray.map((data) => (
                    <DoneProjectCard
                      key={data.id}
                      id={data.id}
                      data={data.data}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Completed Projects</span>
                    </div>
                  </div>
                )
              ) : activeOption === "Most Views" ? (
                mostViewsCompletedProjectsArray.length > 0 ? (
                  mostViewsCompletedProjectsArray.map((data) => (
                    <DoneProjectCard
                      key={data.id}
                      id={data.id}
                      data={data.data}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Completed Projects</span>
                    </div>
                  </div>
                )
              ) : topCompletedProjectsArray.length > 0 ? (
                topCompletedProjectsArray.map((data) => (
                  <DoneProjectCard
                    key={data.id}
                    id={data.id}
                    data={data.data}
                  />
                ))
              ) : (
                <div className="no-found-main-grid">
                  <div className="no-found-grid">
                    <span>We couldn’t find any Completed Projects</span>
                  </div>
                </div>
              )}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}

export default CompletedProjects;
