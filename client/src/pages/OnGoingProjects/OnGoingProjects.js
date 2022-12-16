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

function OnGoingProjects({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [done, setDone] = useState(false);

  const [lastStateOfLatestOnGoingdProjects, setLastStateOfLatestGoingProjects] =
    useState("");
  const [
    lastStateOfMostViewsGoingProjects,
    setLastStateOfMostViewsGoingProjects,
  ] = useState("");
  const [lastStateOfTopGoingProjects, setLastStateOfTopGoingProjects] =
    useState("");

  const [latestGoingProjectsArray, setLatestGoingProjectsArray] = useState([]);
  const [mostViewsGoingProjectsArray, setMostViewsnterviewExperiencesArray] =
    useState([]);
  const [topGoingProjectsArray, setTopGoingProjectsArray] = useState([]);

  const [
    hasMoreDataForLatestGoingProjects,
    setHasMoreDataForLatestGoingProjects,
  ] = useState(true);
  const [
    hasMoreDataForMostViewsGoingProjects,
    setHasMoreDataForMostViewsGoingProjects,
  ] = useState(true);
  const [hasMoreDataForTopGoingProjects, setHasMoreDataForTopGoingProjects] =
    useState(true);

  const [activeOption, setActiveOption] = useState("Latest");

  useEffect(() => {
    if (activeOption === "Latest") {
      setHasMoreDataForLatestGoingProjects(true);
      const getGoingProjects = async () => {
        setDone(false);

        const q = query(
          collection(db, "projects"),
          where("status", "==", "development"),
          orderBy("requestedOn", "desc"),
          limit(21)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempGoingProjectsArray = [];
            let lastVisible = lastStateOfLatestOnGoingdProjects;
            querySnapshot.forEach((doc) => {
              tempGoingProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setLatestGoingProjectsArray(tempGoingProjectsArray);
            setLastStateOfLatestGoingProjects(lastVisible);
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
      getGoingProjects();
    } else if (activeOption === "Most Views") {
      setHasMoreDataForMostViewsGoingProjects(true);
      const getGoingProjects = async () => {
        setDone(false);
        const q = query(
          collection(db, "projects"),
          where("status", "==", "development"),
          orderBy("requestedOn", "desc"),
          orderBy("totalViews", "desc"),
          limit(21)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempGoingProjectsArray = [];
            let lastVisible = lastStateOfMostViewsGoingProjects;
            querySnapshot.forEach((doc) => {
              tempGoingProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setMostViewsnterviewExperiencesArray(tempGoingProjectsArray);
            setLastStateOfMostViewsGoingProjects(lastVisible);
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
      getGoingProjects();
    } else {
      setHasMoreDataForMostViewsGoingProjects(true);
      const getGoingProjects = async () => {
        setDone(false);
        let q = query(
          collection(db, "projects"),
          where("status", "==", "development"),
          orderBy("requestedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          limit(21)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempGoingProjectsArray = [];
            let lastVisible = lastStateOfTopGoingProjects;
            querySnapshot.forEach((doc) => {
              tempGoingProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setTopGoingProjectsArray(tempGoingProjectsArray);
            setLastStateOfTopGoingProjects(lastVisible);
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
      getGoingProjects();
    }
  }, [activeOption, navigate]);

  const fetchMoreItems = async () => {
    if (activeOption === "Latest") {
      const getGoingProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "development"),
          orderBy("requestedOn", "desc"),
          startAfter(lastStateOfLatestOnGoingdProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempGoingProjectsArray = [];
            let lastVisible = lastStateOfLatestOnGoingdProjects;
            querySnapshot.forEach((doc) => {
              tempGoingProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempGoingProjectsArray.length === 0) {
              setHasMoreDataForLatestGoingProjects(false);
            } else {
              setLatestGoingProjectsArray([
                ...latestGoingProjectsArray,
                ...tempGoingProjectsArray,
              ]);
              setLastStateOfLatestGoingProjects(lastVisible);
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
      getGoingProjects();
    } else if (activeOption === "Most Views") {
      const getGoingProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "development"),
          orderBy("requestedOn", "desc"),
          orderBy("totalViews", "desc"),
          startAfter(lastStateOfMostViewsGoingProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempGoingProjectsArray = [];
            let lastVisible = lastStateOfMostViewsGoingProjects;
            querySnapshot.forEach((doc) => {
              tempGoingProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempGoingProjectsArray.length === 0) {
              setHasMoreDataForMostViewsGoingProjects(false);
            } else {
              setMostViewsnterviewExperiencesArray([
                ...mostViewsGoingProjectsArray,
                ...tempGoingProjectsArray,
              ]);
              setLastStateOfMostViewsGoingProjects(lastVisible);
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
      getGoingProjects();
    } else {
      const getGoingProjects = async () => {
        let q = query(
          collection(db, "projects"),
          where("status", "==", "development"),
          orderBy("requestedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          startAfter(lastStateOfTopGoingProjects),
          limit(12)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempGoingProjectsArray = [];
            let lastVisible = lastStateOfTopGoingProjects;
            querySnapshot.forEach((doc) => {
              tempGoingProjectsArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempGoingProjectsArray.length === 0) {
              setHasMoreDataForTopGoingProjects(false);
            } else {
              setTopGoingProjectsArray([
                ...topGoingProjectsArray,
                ...tempGoingProjectsArray,
              ]);
              setLastStateOfTopGoingProjects(lastVisible);
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
      getGoingProjects();
    }
  };

  const loader =
    activeOption === "Latest" ? (
      hasMoreDataForLatestGoingProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : activeOption === "Most Views" ? (
      hasMoreDataForMostViewsGoingProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : hasMoreDataForTopGoingProjects === true ? (
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
        <title>Ongoing Projects</title>

        <meta
          name="keywords"
          keywords="Ongoing Projects, Find Project, Join Team, Make Team, Online Project , Project Ideas, Project Blogs,Create Team, Join Team, Project Blog, Make Projects"
        ></meta>

        <link href="https://buildcode.org/ongoing-projects" rel="canonical" />

        <meta content="Ongoing Projects" itemprop="name" />

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
          content="https://buildcode.org/ongoing-projects"
          property="og:url"
        />

        <meta content="buildcode.org" property="og:site_name" />

        <meta content="Ongoing Projects" property="og:title" />

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

        <meta content="Ongoing Projects" name="twitter:title" />

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
                ? hasMoreDataForLatestGoingProjects
                : activeOption === "Most Views"
                ? hasMoreDataForMostViewsGoingProjects
                : hasMoreDataForTopGoingProjects
            }
            loader={loader}
          >
            <div className="card-container">
              {activeOption === "Latest" ? (
                latestGoingProjectsArray.length > 0 ? (
                  latestGoingProjectsArray.map((data) => (
                    <RequestCard
                      key={data.id}
                      data={data.data}
                      id={data.id}
                      isOnGoing={true}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Ongoing Projects</span>
                    </div>
                  </div>
                )
              ) : activeOption === "Most Views" ? (
                mostViewsGoingProjectsArray.length > 0 ? (
                  mostViewsGoingProjectsArray.map((data) => (
                    <RequestCard
                      key={data.id}
                      data={data.data}
                      id={data.id}
                      isOnGoing={true}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Ongoing Projects</span>
                    </div>
                  </div>
                )
              ) : topGoingProjectsArray.length > 0 ? (
                topGoingProjectsArray.map((data) => (
                  <RequestCard
                    key={data.id}
                    data={data.data}
                    id={data.id}
                    isOnGoing={true}
                  />
                ))
              ) : (
                <div className="no-found-main-grid">
                  <div className="no-found-grid">
                    <span>We couldn’t find any Ongoing Projects</span>
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

export default OnGoingProjects;
