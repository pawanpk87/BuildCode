import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import RequestCard from "../../components/RequestCard/RequestCard";
import db from "../../firebase/firebase-config";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import InfiniteScroll from "react-infinite-scroller";
import { FadingBalls } from "react-cssfx-loading";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./RequestedProjects.css";

function RequestedProjects({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const navigate = useNavigate();

  const [done, setDone] = useState(false);

  const [
    lastStateOfLatestRequestedProjects,
    setLastStateOfLatestRequestedProjects,
  ] = useState("");
  const [
    lastStateOfMostViewsRequestedProjects,
    setLastStateOfMostViewsRequestedProjects,
  ] = useState("");
  const [lastStateOfTopRequestedProjects, setLastStateOfTopRequestedProjects] =
    useState("");

  const [latestRequestedProjectsArray, setLatestRequestedProjectsArray] =
    useState([]);
  const [
    mostViewsRequestedProjectsArray,
    setMostViewsnterviewExperiencesArray,
  ] = useState([]);
  const [topRequestedProjectsArray, setTopRequestedProjectsArray] = useState(
    []
  );

  const [
    hasMoreDataForLatestRequestedProjects,
    setHasMoreDataForLatestRequestedProjects,
  ] = useState(true);
  const [
    hasMoreDataForMostViewsRequestedProjects,
    setHasMoreDataForMostViewsRequestedProjects,
  ] = useState(true);
  const [
    hasMoreDataForTopRequestedProjects,
    setHasMoreDataForTopRequestedProjects,
  ] = useState(true);

  const [activeOption, setActiveOption] = useState("Latest");

  useEffect(() => {
    if (activeOption === "Latest") {
      setHasMoreDataForLatestRequestedProjects(true);
      const getRequestedProjects = async () => {
        setDone(false);
        /**
         * query for latest interview Experience
         */
        const q = query(
          collection(db, "projects"),
          where("status", "==", "pending"),
          orderBy("requestedOn", "desc"),
          limit(21)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempRequestedProjectsArray = [];
            let lastVisible = lastStateOfLatestRequestedProjects;
            querySnapshot.forEach((doc) => {
              tempRequestedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setLatestRequestedProjectsArray(tempRequestedProjectsArray);
            setLastStateOfLatestRequestedProjects(lastVisible);
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
      getRequestedProjects();
    } else if (activeOption === "Most Views") {
      setHasMoreDataForMostViewsRequestedProjects(true);
      const getRequestedProjects = async () => {
        setDone(false);
        const q = query(
          collection(db, "projects"),
          where("status", "==", "pending"),
          orderBy("requestedOn", "desc"),
          orderBy("totalViews", "desc"),
          limit(21)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempRequestedProjectsArray = [];
            let lastVisible = lastStateOfMostViewsRequestedProjects;
            querySnapshot.forEach((doc) => {
              tempRequestedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setMostViewsnterviewExperiencesArray(tempRequestedProjectsArray);
            setLastStateOfMostViewsRequestedProjects(lastVisible);
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
      getRequestedProjects();
    } else {
      setHasMoreDataForMostViewsRequestedProjects(true);
      const getRequestedProjects = async () => {
        setDone(false);
        let q = query(
          collection(db, "projects"),
          where("status", "==", "pending"),
          orderBy("requestedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          limit(21)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempRequestedProjectsArray = [];
            let lastVisible = lastStateOfTopRequestedProjects;
            querySnapshot.forEach((doc) => {
              tempRequestedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setTopRequestedProjectsArray(tempRequestedProjectsArray);
            setLastStateOfTopRequestedProjects(lastVisible);
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
      getRequestedProjects();
    }
  }, [activeOption, navigate]);

  const fetchMoreItems = async () => {
    if (activeOption === "Latest") {
      const getRequestedProjects = async () => {
        /**
         * query for latest interview Experience
         */
        let q = query(
          collection(db, "projects"),
          where("status", "==", "pending"),
          orderBy("requestedOn", "desc"),
          startAfter(lastStateOfLatestRequestedProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempRequestedProjectsArray = [];
            let lastVisible = lastStateOfLatestRequestedProjects;
            querySnapshot.forEach((doc) => {
              tempRequestedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempRequestedProjectsArray.length === 0) {
              setHasMoreDataForLatestRequestedProjects(false);
            } else {
              setLatestRequestedProjectsArray([
                ...latestRequestedProjectsArray,
                ...tempRequestedProjectsArray,
              ]);
              setLastStateOfLatestRequestedProjects(lastVisible);
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
      getRequestedProjects();
    } else if (activeOption === "Most Views") {
      const getRequestedProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "pending"),
          orderBy("requestedOn", "desc"),
          orderBy("totalViews", "desc"),
          startAfter(lastStateOfMostViewsRequestedProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempRequestedProjectsArray = [];
            let lastVisible = lastStateOfMostViewsRequestedProjects;
            querySnapshot.forEach((doc) => {
              tempRequestedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempRequestedProjectsArray.length === 0) {
              setHasMoreDataForMostViewsRequestedProjects(false);
            } else {
              setMostViewsnterviewExperiencesArray([
                ...mostViewsRequestedProjectsArray,
                ...tempRequestedProjectsArray,
              ]);
              setLastStateOfMostViewsRequestedProjects(lastVisible);
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
      getRequestedProjects();
    } else {
      const getRequestedProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "pending"),
          orderBy("requestedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          startAfter(lastStateOfTopRequestedProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempRequestedProjectsArray = [];
            let lastVisible = lastStateOfTopRequestedProjects;
            querySnapshot.forEach((doc) => {
              tempRequestedProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempRequestedProjectsArray.length === 0) {
              setHasMoreDataForTopRequestedProjects(false);
            } else {
              setTopRequestedProjectsArray([
                ...topRequestedProjectsArray,
                ...tempRequestedProjectsArray,
              ]);
              setLastStateOfTopRequestedProjects(lastVisible);
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
      getRequestedProjects();
    }
  };

  const loader =
    activeOption === "Latest" ? (
      hasMoreDataForLatestRequestedProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : activeOption === "Most Views" ? (
      hasMoreDataForMostViewsRequestedProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : hasMoreDataForTopRequestedProjects === true ? (
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
        <title>Requested Projects</title>

        <meta
          name="keywords"
          keywords="Requested Projects, Find Project, Join Team, Make Team, Online Project , Project Ideas, Project Blogs,Create Team, Join Team, Project Blog, Make Project"
        ></meta>

        <link href="https://buildcode.org/requested-projects" rel="canonical" />

        <meta content="Requested Projects" itemprop="name" />

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
          content="https://buildcode.org/requested-projects"
          property="og:url"
        />

        <meta content="buildcode.org" property="og:site_name" />

        <meta content="Requested Projects" property="og:title" />

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

        <meta content="Requested Projects" name="twitter:title" />

        <meta
          content="Find an interesting project and join the team."
          name="twitter:description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          name="twitter:image"
        />
      </Helmet>
      <div className="requested-pro-main-grid">
        <br />
        <div className="requested-projects-home-page-tag">
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
                ? hasMoreDataForLatestRequestedProjects
                : activeOption === "Most Views"
                ? hasMoreDataForMostViewsRequestedProjects
                : hasMoreDataForTopRequestedProjects
            }
            loader={loader}
          >
            <div className="card-container">
              {activeOption === "Latest" ? (
                latestRequestedProjectsArray.length > 0 ? (
                  latestRequestedProjectsArray.map((data) => (
                    <RequestCard key={data.id} data={data.data} id={data.id} />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Requested Projects</span>
                    </div>
                  </div>
                )
              ) : activeOption === "Most Views" ? (
                mostViewsRequestedProjectsArray.length > 0 ? (
                  mostViewsRequestedProjectsArray.map((data) => (
                    <RequestCard key={data.id} data={data.data} id={data.id} />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Requested Projects</span>
                    </div>
                  </div>
                )
              ) : topRequestedProjectsArray.length > 0 ? (
                topRequestedProjectsArray.map((data) => (
                  <RequestCard key={data.id} data={data.data} id={data.id} />
                ))
              ) : (
                <div className="no-found-main-grid">
                  <div className="no-found-grid">
                    <span>We couldn’t find any Requested Projects</span>
                  </div>
                </div>
              )}
            </div>
          </InfiniteScroll>
        )}
        <br />
        <br />
        <br />
        <br />
      </div>
    </>
  );
}

export default RequestedProjects;
