import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import BigArticleCard from "../../components/BigArticleCard/BigArticleCard";
import db from "../../firebase/firebase-config";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import InfiniteScroll from "react-infinite-scroller";
import { FadingBalls } from "react-cssfx-loading";
import CreatableSelect from "react-select/creatable";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

function InterviewExperiences({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const location = useLocation();
  const { company } = useParams();
  const [done, setDone] = useState(false);
  const [allCompanyTags, setAllCompanyTags] = useState([]);
  const [userSelectedCompanyName, setUserSelectedCompanyName] = useState([]);
  const [companyName, setCompanyName] = useState(company);

  const [
    lastStateOfLatestInterviewExperiences,
    setLastStateOfLatestInterviewExperiences,
  ] = useState("");
  const [
    lastStateOfMostViewsInterviewExperiences,
    setLastStateOfMostViewsInterviewExperiences,
  ] = useState("");
  const [
    lastStateOfTopInterviewExperiences,
    setLastStateOfTopInterviewExperiences,
  ] = useState("");

  const [latestInterviewExperiencesArray, setLatestInterviewExperiencesArray] =
    useState([]);
  const [
    mostViewsInterviewExperiencesArray,
    setMostViewsnterviewExperiencesArray,
  ] = useState([]);
  const [topInterviewExperiencesArray, setTopInterviewExperiencesArray] =
    useState([]);

  const [
    hasMoreDataForLatestInterviewExperiences,
    setHasMoreDataForLatestInterviewExperiences,
  ] = useState(true);
  const [
    hasMoreDataForMostViewsInterviewExperiences,
    setHasMoreDataForMostViewsInterviewExperiences,
  ] = useState(true);
  const [
    hasMoreDataForTopInterviewExperiences,
    setHasMoreDataForTopInterviewExperiences,
  ] = useState(true);

  const [activeOption, setActiveOption] = useState("Latest");

  const getLatestInterviewExperienceArticles = async () => {
    setDone(false);
    let q;
    if (
      company === "recent-interview-experience" ||
      company.trim() === "" ||
      company === "" ||
      company === undefined ||
      company === null
    ) {
      q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("isInterviewExperience", "==", 1),
        limit(30)
      );
    } else {
      q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("companyName", "==", company.trim()),
        where("isInterviewExperience", "==", 1),
        limit(30)
      );
    }
    await getDocs(q)
      .then((querySnapshot) => {
        let tempArticlesArray = [];
        let lastVisible = lastStateOfLatestInterviewExperiences;
        querySnapshot.forEach((doc) => {
          tempArticlesArray.push({ id: doc.id, data: doc.data() });
          lastVisible = doc;
        });
        setLatestInterviewExperiencesArray(tempArticlesArray);
        setLastStateOfLatestInterviewExperiences(lastVisible);
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

  const getMostViewsInterviewExperienceArticles = async () => {
    setDone(false);
    let q;
    if (
      company === "recent-interview-experience" ||
      company.trim() === "" ||
      company === "" ||
      company === undefined ||
      company === null
    ) {
      q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("isInterviewExperience", "==", 1),
        orderBy("totalViews", "desc"),
        limit(30)
      );
    } else {
      q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("companyName", "==", company.trim()),
        where("isInterviewExperience", "==", 1),
        orderBy("totalViews", "desc"),
        limit(30)
      );
    }
    await getDocs(q)
      .then((querySnapshot) => {
        let tempArticlesArray = [];
        let lastVisible = lastStateOfMostViewsInterviewExperiences;
        querySnapshot.forEach((doc) => {
          tempArticlesArray.push({ id: doc.id, data: doc.data() });
          lastVisible = doc;
        });
        setMostViewsnterviewExperiencesArray(tempArticlesArray);
        setLastStateOfMostViewsInterviewExperiences(lastVisible);
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

  const getTopInterviewExperienceArticles = async () => {
    setDone(false);
    let q;
    if (
      company === "recent-interview-experience" ||
      company.trim() === "" ||
      company === "" ||
      company === undefined ||
      company === null
    ) {
      q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("isInterviewExperience", "==", 1),
        orderBy("totalLikes", "desc"),
        orderBy("totalViews", "desc"),
        orderBy("totalComments", "desc"),
        limit(30)
      );
    } else {
      q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("companyName", "==", company.trim()),
        where("isInterviewExperience", "==", 1),
        orderBy("totalLikes", "desc"),
        orderBy("totalViews", "desc"),
        orderBy("totalComments", "desc"),
        limit(30)
      );
    }
    await getDocs(q)
      .then((querySnapshot) => {
        let tempArticlesArray = [];
        let lastVisible = lastStateOfTopInterviewExperiences;
        querySnapshot.forEach((doc) => {
          tempArticlesArray.push({ id: doc.id, data: doc.data() });
          lastVisible = doc;
        });
        setTopInterviewExperiencesArray(tempArticlesArray);
        setLastStateOfTopInterviewExperiences(lastVisible);
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

  useEffect(() => {
    if (
      company !== undefined &&
      company !== "recent-interview-experience" &&
      company.trim() !== ""
    ) {
      setUserSelectedCompanyName([{ label: company, value: company }]);
    }
  }, [company, location]);

  useEffect(() => {
    if (activeOption === "Latest") {
      setHasMoreDataForLatestInterviewExperiences(true);
      getLatestInterviewExperienceArticles();
    } else if (activeOption === "Most Views") {
      setHasMoreDataForMostViewsInterviewExperiences(true);
      getMostViewsInterviewExperienceArticles();
    } else {
      setHasMoreDataForTopInterviewExperiences(true);
      getTopInterviewExperienceArticles();
    }
  }, [activeOption, location, userSelectedCompanyName]);

  const fetchMoreItems = async () => {
    if (activeOption === "Latest") {
      const getArticles = async () => {
        /**
         * query for latest interview Experience
         */
        let q;

        if (
          company === "recent-interview-experience" ||
          company.trim() === "" ||
          company === "" ||
          company === undefined ||
          company === null
        ) {
          q = query(
            collection(db, "articles"),
            orderBy("postedOn", "desc"),
            where("isInterviewExperience", "==", 1),
            startAfter(lastStateOfLatestInterviewExperiences),
            limit(15)
          );
        } else {
          q = query(
            collection(db, "articles"),
            orderBy("postedOn", "desc"),
            where("companyName", "==", company.trim()),
            where("isInterviewExperience", "==", 1),
            startAfter(lastStateOfLatestInterviewExperiences),
            limit(15)
          );
        }
        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfLatestInterviewExperiences;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempArticlesArray.length === 0) {
              setHasMoreDataForLatestInterviewExperiences(false);
            } else {
              setLatestInterviewExperiencesArray([
                ...latestInterviewExperiencesArray,
                ...tempArticlesArray,
              ]);
              setLastStateOfLatestInterviewExperiences(lastVisible);
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
        let q;

        if (
          company === "recent-interview-experience" ||
          company.trim() === "" ||
          company === "" ||
          company === undefined ||
          company === null
        ) {
          q = query(
            collection(db, "articles"),
            orderBy("postedOn", "desc"),
            where("isInterviewExperience", "==", 1),
            orderBy("totalViews", "desc"),
            startAfter(lastStateOfMostViewsInterviewExperiences),
            limit(15)
          );
        } else {
          q = query(
            collection(db, "articles"),
            orderBy("postedOn", "desc"),
            where("companyName", "==", company.trim()),
            where("isInterviewExperience", "==", 1),
            orderBy("totalViews", "desc"),
            startAfter(lastStateOfMostViewsInterviewExperiences),
            limit(15)
          );
        }
        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfMostViewsInterviewExperiences;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempArticlesArray.length === 0) {
              setHasMoreDataForMostViewsInterviewExperiences(false);
            } else {
              setMostViewsnterviewExperiencesArray([
                ...mostViewsInterviewExperiencesArray,
                ...tempArticlesArray,
              ]);
              setLastStateOfMostViewsInterviewExperiences(lastVisible);
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
        let q;
        if (
          company === "recent-interview-experience" ||
          company.trim() === "" ||
          company === "" ||
          company === undefined ||
          company === null
        ) {
          q = query(
            collection(db, "articles"),
            orderBy("postedOn", "desc"),
            where("isInterviewExperience", "==", 1),
            orderBy("totalLikes", "desc"),
            orderBy("totalViews", "desc"),
            orderBy("totalComments", "desc"),
            startAfter(lastStateOfTopInterviewExperiences),
            limit(15)
          );
        } else {
          q = query(
            collection(db, "articles"),
            orderBy("postedOn", "desc"),
            where("companyName", "==", company.trim()),
            where("isInterviewExperience", "==", 1),
            orderBy("totalLikes", "desc"),
            orderBy("totalViews", "desc"),
            orderBy("totalComments", "desc"),
            startAfter(lastStateOfTopInterviewExperiences),
            limit(15)
          );
        }
        await getDocs(q)
          .then((querySnapshot) => {
            let tempArticlesArray = [];
            let lastVisible = lastStateOfTopInterviewExperiences;
            querySnapshot.forEach((doc) => {
              tempArticlesArray.push({ id: doc.id, data: doc.data() });
              lastVisible = doc;
            });
            if (tempArticlesArray.length === 0) {
              setHasMoreDataForTopInterviewExperiences(false);
            } else {
              setTopInterviewExperiencesArray([
                ...topInterviewExperiencesArray,
                ...tempArticlesArray,
              ]);
              setLastStateOfTopInterviewExperiences(lastVisible);
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

  const handleCompanyName = (tagOptions) => {
    setUserSelectedCompanyName(tagOptions);
    tagOptions.forEach((option) => {
      setCompanyName(option.value);
    });

    if (tagOptions.length > 1) {
      tagOptions.shift();
      setUserSelectedCompanyName(tagOptions);
      navigate(`/interview-experiences/${tagOptions[0].value}`);
    } else if (tagOptions.length === 1) {
      navigate(`/interview-experiences/${tagOptions[0].value}`);
    }

    if (tagOptions.length === 0) {
      setCompanyName("");
      navigate("/interview-experiences/recent-interview-experience");
    }
  };

  const addSelectedCompanyName = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-company-tags"),
        where("keywords", "array-contains", queryString),
        limit(30)
      );
      const documentSnapshots = await getDocs(q);
      let tempMatchingTags = [];
      documentSnapshots.forEach((doc) => {
        tempMatchingTags.push({
          label: doc.data().label,
          value: doc.data().value,
        });
      });
      setAllCompanyTags(tempMatchingTags);
    };
    setMatchingTags();
  };

  const loader =
    activeOption === "Latest" ? (
      hasMoreDataForLatestInterviewExperiences === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : activeOption === "Most Views" ? (
      hasMoreDataForMostViewsInterviewExperiences === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : (
        <div className="no-more-records">
          <span></span>
        </div>
      )
    ) : hasMoreDataForTopInterviewExperiences === true ? (
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

        <title>Interview Experiences</title>

        <meta
          name="keywords"
          keywords="Interview Experiences, interview, coding interview, Off campus Interview Experiences, On campus Interview Experiences, How to prepare for Interview, interview question and answer, interview questions sde, coding round preparation, coding round, how to crack product based company interview, interview"
        ></meta>

        <meta
          content="Explore Interview Experiences of top tech companies like Amazon, Google, Microsoft, LinkedIn."
          name="description"
        />

        <link
          href="https://buildcode.org/interview-experiences/recent-interview-experience"
          rel="canonical"
        />

        <meta content="Interview Experiences" itemprop="name" />

        <meta
          content="Interview Experiences of top tech companies for practice"
          itemprop="description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          itemprop="image"
        />

        <meta content="en_US" property="og:locale" />

        <meta content="articles" property="og:type" />

        <meta
          content="https://buildcode.org/interview-experiences/recent-interview-experience"
          property="og:url"
        />

        <meta content="buildcode.org" property="og:site_name" />

        <meta content="Interview Experiences" property="og:title" />

        <meta
          content="Latest Interview Experiences, Interview Experiences, and stories for students and developers."
          property="og:description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          property="og:image"
        />

        <meta property="og:image:alt" />
        <meta content="summary_large_image" name="twitter:card" />

        <meta content="Interview Experiences" name="twitter:title" />

        <meta
          content="Latest Interview Experiences, Interview Experiences, and stories for students and developers."
          name="twitter:description"
        />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          name="twitter:image"
        />
      </Helmet>
      <div className="articles-page-grid">
        <CreatableSelect
          onChange={(value) => handleCompanyName(value)}
          onInputChange={addSelectedCompanyName}
          value={userSelectedCompanyName}
          isMulti
          isClearable
          options={allCompanyTags}
          className="basic-multi-select "
          classNamePrefix="select"
          placeholder="Search company name"
        />
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
                  ? hasMoreDataForLatestInterviewExperiences
                  : activeOption === "Most Views"
                  ? hasMoreDataForMostViewsInterviewExperiences
                  : hasMoreDataForTopInterviewExperiences
              }
              loader={loader}
            >
              {activeOption === "Latest" ? (
                latestInterviewExperiencesArray.length > 0 ? (
                  latestInterviewExperiencesArray.map((data) => (
                    <BigArticleCard
                      key={data.id}
                      id={data.id}
                      data={data.data}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>
                        We couldn’t find any interview experience for{" "}
                        <span id="search-string">{company}</span>
                      </span>
                    </div>
                  </div>
                )
              ) : activeOption === "Most Views" ? (
                mostViewsInterviewExperiencesArray.length > 0 ? (
                  mostViewsInterviewExperiencesArray.map((data) => (
                    <BigArticleCard
                      key={data.id}
                      id={data.id}
                      data={data.data}
                    />
                  ))
                ) : (
                  <div className="no-found-main-grid">
                    <div className="no-found-grid">
                      <span>
                        We couldn’t find any interview experience for{" "}
                        <span id="search-string">{company}</span>
                      </span>
                    </div>
                  </div>
                )
              ) : topInterviewExperiencesArray.length > 0 ? (
                topInterviewExperiencesArray.map((data) => (
                  <BigArticleCard key={data.id} id={data.id} data={data.data} />
                ))
              ) : (
                <div className="no-found-main-grid">
                  <div className="no-found-grid">
                    <span>
                      We couldn’t find any interview experience for{" "}
                      <span id="search-string">{company}</span>
                    </span>
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

export default InterviewExperiences;
