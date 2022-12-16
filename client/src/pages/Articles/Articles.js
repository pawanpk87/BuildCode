import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import BigArticleCard from "../../components/BigArticleCard/BigArticleCard";
import db from "../../firebase/firebase-config";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import InfiniteScroll from "react-infinite-scroller";
import { FadingBalls } from "react-cssfx-loading";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Articles.css";

function Articles({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [done, setDone] = useState(false);

  const [lastStateOfLatestArticles, setLastStateOfLatestArticles] =
    useState("");
  const [lastStateOfMostViewsArticles, setLastStateOfMostViewsArticles] =
    useState("");
  const [lastStateOfTopArticles, setLastStateOfTopArticles] = useState("");

  const [latestArticlesArray, setLatestArticlesArray] = useState([]);
  const [mostViewsArticlesArray, setMostViewsnterviewExperiencesArray] =
    useState([]);
  const [topArticlesArray, setTopArticlesArray] = useState([]);

  const [hasMoreDataForLatestArticles, setHasMoreDataForLatestArticles] =
    useState(true);
  const [hasMoreDataForMostViewsArticles, setHasMoreDataForMostViewsArticles] =
    useState(true);
  const [hasMoreDataForTopArticles, setHasMoreDataForTopArticles] =
    useState(true);

  const [activeOption, setActiveOption] = useState("Latest");

  useEffect(() => {
    if (activeOption === "Latest") {
      setHasMoreDataForLatestArticles(true);
      const getArticles = async () => {
        setDone(false);

        const q = query(
          collection(db, "articles"),
          orderBy("postedOn", "desc"),
          limit(30)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfLatestArticles;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setLatestArticlesArray(tempArticlesArray);
            setLastStateOfLatestArticles(lastVisible);
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
      getArticles();
    } else if (activeOption === "Most Views") {
      setHasMoreDataForMostViewsArticles(true);
      const getArticles = async () => {
        setDone(false);
        const q = query(
          collection(db, "articles"),
          orderBy("postedOn", "desc"),
          orderBy("totalViews", "desc"),
          limit(30)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfMostViewsArticles;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setMostViewsnterviewExperiencesArray(tempArticlesArray);
            setLastStateOfMostViewsArticles(lastVisible);
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
      getArticles();
    } else {
      setHasMoreDataForMostViewsArticles(true);
      const getArticles = async () => {
        setDone(false);
        let q = query(
          collection(db, "articles"),
          orderBy("postedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          limit(30)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfTopArticles;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            setTopArticlesArray(tempArticlesArray);
            setLastStateOfTopArticles(lastVisible);
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
      getArticles();
    }
  }, [activeOption, navigate]);

  const fetchMoreItems = async () => {
    if (activeOption === "Latest") {
      const getArticles = async () => {
        let q = query(
          collection(db, "articles"),
          orderBy("postedOn", "desc"),
          startAfter(lastStateOfLatestArticles),
          limit(15)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfLatestArticles;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempArticlesArray.length === 0) {
              setHasMoreDataForLatestArticles(false);
            } else {
              setLatestArticlesArray([
                ...latestArticlesArray,
                ...tempArticlesArray,
              ]);
              setLastStateOfLatestArticles(lastVisible);
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
      getArticles();
    } else if (activeOption === "Most Views") {
      const getArticles = async () => {
        let q = query(
          collection(db, "articles"),
          orderBy("postedOn", "desc"),
          orderBy("totalViews", "desc"),
          startAfter(lastStateOfMostViewsArticles),
          limit(15)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfMostViewsArticles;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempArticlesArray.length === 0) {
              setHasMoreDataForMostViewsArticles(false);
            } else {
              setMostViewsnterviewExperiencesArray([
                ...mostViewsArticlesArray,
                ...tempArticlesArray,
              ]);
              setLastStateOfMostViewsArticles(lastVisible);
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
      getArticles();
    } else {
      const getArticles = async () => {
        let q = query(
          collection(db, "articles"),
          orderBy("postedOn", "desc"),
          orderBy("totalLikes", "desc"),
          orderBy("totalViews", "desc"),
          orderBy("totalComments", "desc"),
          startAfter(lastStateOfTopArticles),
          limit(15)
        );

        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfTopArticles;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempArticlesArray.length === 0) {
              setHasMoreDataForTopArticles(false);
            } else {
              setTopArticlesArray([...topArticlesArray, ...tempArticlesArray]);
              setLastStateOfTopArticles(lastVisible);
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
      getArticles();
    }
  };

  const loader =
    activeOption === "Latest" ? (
      hasMoreDataForLatestArticles === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : activeOption === "Most Views" ? (
      hasMoreDataForMostViewsArticles === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : hasMoreDataForTopArticles === true ? (
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
        <meta charset="utf-8" />

        <meta content="width=device-width,initial-scale=1.0" name="viewport" />

        <meta content="noindex" name="robots" />

        <title>Articles</title>

        <meta
          name="keywords"
          keywords="Articles, Write an Article, Interview Experiences, interview, coding interview, Off campus Interview Experiences, On campus Interview Experiences, How to prepare for Interview, interview question and answer, interview questions sde, coding round preparation, coding round, how to crack product based company interview, Blogs"
        ></meta>

        <meta
          content="Latest Articles, Interview Experiences, and stories for students and developers."
          name="description"
        />

        <link href="https://buildcode.org/articles" rel="canonical" />

        <meta content="Articles" itemprop="name" />

        <meta
          content="Latest Articles, Interview Experiences, and stories for students and developers."
          itemprop="description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          itemprop="image"
        />

        <meta content="en_US" property="og:locale" />

        <meta content="articles" property="og:type" />

        <meta content="https://buildcode.org/articles" property="og:url" />

        <meta content="buildcode.org" property="og:site_name" />

        <meta content="Articles" property="og:title" />

        <meta
          content="Latest Articles, Interview Experiences, and stories for students and developers."
          property="og:description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          property="og:image"
        />

        <meta property="og:image:alt" />
        <meta content="summary_large_image" name="twitter:card" />

        <meta content="Articles" name="twitter:title" />

        <meta
          content="Latest Articles, Interview Experiences, and stories for students and developers."
          name="twitter:description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          name="twitter:image"
        />
      </Helmet>
      <div className="articles-page-grid">
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
          <>
            <InfiniteScroll
              loadMore={fetchMoreItems}
              hasMore={
                activeOption === "Latest"
                  ? hasMoreDataForLatestArticles
                  : activeOption === "Most Views"
                  ? hasMoreDataForMostViewsArticles
                  : hasMoreDataForTopArticles
              }
              loader={loader}
            >
              {activeOption === "Latest" ? (
                latestArticlesArray.length > 0 ? (
                  latestArticlesArray.map((data) => (
                    <BigArticleCard
                      key={data.id}
                      id={data.id}
                      data={data.data}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Articles</span>
                    </div>
                  </div>
                )
              ) : activeOption === "Most Views" ? (
                mostViewsArticlesArray.length > 0 ? (
                  mostViewsArticlesArray.map((data) => (
                    <BigArticleCard
                      key={data.id}
                      id={data.id}
                      data={data.data}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>We couldn’t find any Articles</span>
                    </div>
                  </div>
                )
              ) : topArticlesArray.length > 0 ? (
                topArticlesArray.map((data) => (
                  <BigArticleCard key={data.id} id={data.id} data={data.data} />
                ))
              ) : (
                <div className="no-found-main-grid">
                  <div className="no-found-grid">
                    <span>We couldn’t find any Articles</span>
                  </div>
                </div>
              )}
            </InfiniteScroll>
          </>
        )}
      </div>
    </>
  );
}

export default Articles;
