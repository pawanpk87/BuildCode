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
import RequestCard from "../../components/RequestCard/RequestCard";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import db from "../../firebase/firebase-config";
import DoneProjectCard from "../../components/DoneProjectCard/DoneProjectCard";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import InfiniteScroll from "react-infinite-scroller";
import { FadingBalls } from "react-cssfx-loading";
import BigArticleCard from "../../components/BigArticleCard/BigArticleCard";
import { uuidv4 } from "@firebase/util";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Helmet } from "react-helmet";
import "./FilterPage.css";

function FilterPage({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const location = useLocation();

  const { queryString, skill, tag, people } = useParams();
  const [done, setDone] = useState(false);
  const [activeOption, setActiveOption] = useState("Articles");

  const [lastStateOfRequestedProjects, setLastStateOfRequestedProjects] =
    useState(null);
  const [requestedProjectsArray, setRequestedProjectsArray] = useState([]);
  const [hasMoreDataForRequestedProjects, setHasMoreDataForRequestedProjects] =
    useState(false);

  const [lastStateOfOnGoingProjects, setLastStateOfOnGoingProjects] =
    useState(null);
  const [onGoingProjectsArray, setOnGoingProjectsArray] = useState([]);
  const [hasMoreDataForOnGoingProjects, setHasMoreDataForOnGoingProjects] =
    useState(false);

  const [lastStateOfCompletedProjects, setLastStateOfCompletedProjects] =
    useState(null);
  const [completedProjectsArray, setCompletedProjectsArray] = useState([]);
  const [hasMoreDataForCompletedProjects, setHasMoreDataForCompletedProjects] =
    useState(false);

  const [lastStateOfArticles, setLastStateOfArticles] = useState(null);
  const [articlesArray, setArticlesArray] = useState([]);
  const [hasMoreDataForArticles, setHasMoreDataForArticles] = useState(false);
  const [noMoreDataForArticles, setNoMoreDataForArticles] = useState(false);

  const [lastStateOfInterviewExperiences, setLastStateOfInterviewExperiences] =
    useState(null);
  const [interviewExperiences, setInterviewExperiences] = useState([]);
  const [
    hasMoreDataForInterviewExperiences,
    setHasMoreDataForInterviewExperiences,
  ] = useState(false);
  const [
    noMoreDataForInterviewExperiences,
    setNoMoreDataForInterviewExperiences,
  ] = useState(false);

  const [lastStateOfPeople, setLastStateOfPeople] = useState(null);
  const [peopleArray, setPeopleArray] = useState([]);
  const [hasMoreDataForPeople, setHasMoreDataForPeople] = useState(false);

  const [lastStateOfTags, setLastStateOfTags] = useState(null);
  const [tagsArray, setTagsArray] = useState([]);
  const [hasMoreDataForTags, setHasMoreDataForTags] = useState(false);

  useEffect(() => {
    if (tag !== null && tag !== undefined) {
      setActiveOption("Articles");
    } else if (people !== null && people !== undefined) {
      setActiveOption("People");
    } else if (skill !== null && skill !== undefined) {
      setActiveOption("Requested Projects");
    }
  }, [location, tag, skill, people]);

  const getArticles = async (tempQueryString) => {
    setDone(false);
    let first;
    if (tag !== null && tag !== undefined && tag.trim() !== "") {
      first = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("tags", "array-contains", tempQueryString),
        limit(30)
      );
    } else {
      first = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("keywords", "array-contains", tempQueryString),
        limit(30)
      );
    }

    await getDocs(first)
      .then((documentSnapshots) => {
        let tempArticles = [];
        documentSnapshots.forEach((doc) => {
          tempArticles.push({ id: doc.id, data: doc.data() });
        });
        setArticlesArray(tempArticles);
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastStateOfArticles(lastVisible);
        setDone(true);
        if (tempArticles.length > 0) {
          setHasMoreDataForArticles(true);
        } else {
          setNoMoreDataForArticles(true);
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
  const getInterviewExperiences = async (tempQueryString) => {
    setDone(false);
    let first;
    if (tag !== null && tag !== undefined && tag.trim() !== "") {
      first = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("tags", "array-contains", tempQueryString),
        where("isInterviewExperience", "==", 1),
        limit(30)
      );
    } else {
      first = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        where("keywords", "array-contains", tempQueryString),
        where("isInterviewExperience", "==", 1),
        limit(30)
      );
    }

    await getDocs(first)
      .then((documentSnapshots) => {
        let tempArticles = [];
        documentSnapshots.forEach((doc) => {
          tempArticles.push({ id: doc.id, data: doc.data() });
        });
        setInterviewExperiences(tempArticles);
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastStateOfInterviewExperiences(lastVisible);
        setDone(true);
        if (tempArticles.length > 0) {
          setHasMoreDataForInterviewExperiences(true);
        } else {
          setNoMoreDataForInterviewExperiences(true);
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
  const getRequestedProjects = async (tempQueryString) => {
    setDone(false);
    let first;
    if (skill !== null && skill !== undefined && skill.trim() !== "") {
      first = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        where("status", "==", "pending"),
        where("skills", "array-contains", skill),
        limit(30)
      );
    } else if (tag !== null && tag !== undefined && tag.trim() !== "") {
      first = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        where("status", "==", "pending"),
        where("tags", "array-contains", tempQueryString),
        limit(30)
      );
    } else {
      first = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        where("status", "==", "pending"),
        where("keywords", "array-contains", tempQueryString),
        limit(30)
      );
    }

    await getDocs(first)
      .then((documentSnapshots) => {
        let tempProjects = [];
        documentSnapshots.forEach((doc) => {
          tempProjects.push({ id: doc.id, data: doc.data() });
        });
        setRequestedProjectsArray(tempProjects);
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastStateOfRequestedProjects(lastVisible);
        setDone(true);
        if (tempProjects.length > 0) setHasMoreDataForRequestedProjects(true);
      })
      .catch((error) => {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      });
  };
  const getOnGoingdProjects = async (tempQueryString) => {
    setDone(false);
    let first;
    if (skill !== null && skill !== undefined && skill.trim() !== "") {
      first = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        where("status", "==", "development"),
        where("skills", "array-contains", skill),
        limit(30)
      );
    } else if (tag !== null && tag !== undefined && tag.trim() !== "") {
      first = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        where("status", "==", "development"),
        where("tags", "array-contains", tempQueryString),
        limit(30)
      );
    } else {
      first = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        where("status", "==", "development"),
        where("keywords", "array-contains", tempQueryString),
        limit(30)
      );
    }

    await getDocs(first)
      .then((documentSnapshots) => {
        let tempProjects = [];
        documentSnapshots.forEach((doc) => {
          tempProjects.push({ id: doc.id, data: doc.data() });
        });
        setOnGoingProjectsArray(tempProjects);
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastStateOfOnGoingProjects(lastVisible);
        setDone(true);
        if (tempProjects.length > 0) setHasMoreDataForOnGoingProjects(true);
      })
      .catch((error) => {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      });
  };
  const getCompletedProjects = async (tempQueryString) => {
    setDone(false);
    let first;
    if (skill !== null && skill !== undefined && skill.trim() !== "") {
      first = query(
        collection(db, "projects"),
        orderBy("completedOn", "desc"),
        where("status", "==", "completed"),
        where("skills", "array-contains", skill),
        limit(30)
      );
    } else if (tag !== null && tag !== undefined && tag.trim() !== "") {
      first = query(
        collection(db, "projects"),
        orderBy("completedOn", "desc"),
        where("status", "==", "cpmpleted"),
        where("tags", "array-contains", tempQueryString),
        limit(30)
      );
    } else {
      first = query(
        collection(db, "projects"),
        orderBy("completedOn", "desc"),
        where("status", "==", "completed"),
        where("keywords", "array-contains", tempQueryString),
        limit(30)
      );
    }
    await getDocs(first)
      .then((documentSnapshots) => {
        let tempProjects = [];
        documentSnapshots.forEach((doc) => {
          tempProjects.push({ id: doc.id, data: doc.data() });
        });
        setCompletedProjectsArray(tempProjects);
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastStateOfCompletedProjects(lastVisible);
        setDone(true);
        if (tempProjects.length > 0) setHasMoreDataForCompletedProjects(true);
      })
      .catch((error) => {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      });
  };
  const getPeople = async (tempQueryString) => {
    setDone(false);
    const first = query(
      collection(db, "users"),
      where("keywords", "array-contains", tempQueryString),
      limit(30)
    );
    await getDocs(first)
      .then((documentSnapshots) => {
        let tempPeoples = [];
        documentSnapshots.forEach((doc) => {
          tempPeoples.push({ id: doc.id, data: doc.data() });
        });
        setPeopleArray(tempPeoples);
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastStateOfPeople(lastVisible);
        setDone(true);
        if (tempPeoples.length > 0) setHasMoreDataForPeople(true);
      })
      .catch((error) => {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      });
  };
  const getTags = async (tempQueryString) => {
    setDone(false);
    const first = query(
      collection(db, "build-code-tags"),
      orderBy("addedOn", "desc"),
      where("keywords", "array-contains", tempQueryString),
      limit(200)
    );
    await getDocs(first)
      .then((documentSnapshots) => {
        let tempTags = [];
        documentSnapshots.forEach((doc) => {
          tempTags.push(doc.data().value);
        });
        setTagsArray(tempTags);
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastStateOfTags(lastVisible);
        setDone(true);
        if (tempTags.length > 0) setHasMoreDataForTags(true);
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
    let tempQueryString = "BuildCode";
    if (tag !== null && tag !== undefined) tempQueryString = tag;
    else if (people !== null && people !== undefined) tempQueryString = people;
    else if (queryString !== null && queryString !== undefined)
      tempQueryString = queryString;
    else if (skill !== null && skill !== undefined) tempQueryString = skill;
    if (activeOption === "Articles") {
      getArticles(tempQueryString);
    } else if (activeOption === "Requested Projects") {
      getRequestedProjects(tempQueryString);
    } else if (activeOption === "Ongoing Projects") {
      getOnGoingdProjects(tempQueryString);
    } else if (activeOption === "Completed Projects") {
      getCompletedProjects(tempQueryString);
    } else if (activeOption === "People") {
      getPeople(tempQueryString);
    } else if (activeOption === "Interview Experience") {
      getInterviewExperiences(tempQueryString);
    } else {
      getTags(tempQueryString);
    }
  }, [location, queryString, skill, tag, people, activeOption]);

  const fetchMoreItems = async () => {
    let tempQueryString = "BuildCode";
    if (tag !== null && tag !== undefined) tempQueryString = tag;
    else if (people !== null && people !== undefined) tempQueryString = people;
    else if (queryString !== null && queryString !== undefined)
      tempQueryString = queryString;
    else if (skill !== null && skill !== undefined) tempQueryString = skill;
    if (activeOption === "Articles") {
      if (
        (lastStateOfArticles === null || lastStateOfArticles === undefined) &&
        noMoreDataForArticles === false
      ) {
        getArticles(tempQueryString);
      } else {
        if (articlesArray.length > 0) {
          const getNextData = async () => {
            let next;
            if (tag !== null && tag !== undefined && tag.trim() !== "") {
              next = query(
                collection(db, "articles"),
                orderBy("postedOn", "desc"),
                where("tags", "array-contains", tempQueryString),
                startAfter(lastStateOfArticles),
                limit(15)
              );
            } else {
              next = query(
                collection(db, "articles"),
                orderBy("postedOn", "desc"),
                where("keywords", "array-contains", tempQueryString),
                startAfter(lastStateOfArticles),
                limit(15)
              );
            }

            await getDocs(next)
              .then((documentSnapshots) => {
                let tempArticles = [];
                documentSnapshots.forEach((doc) => {
                  tempArticles.push({ id: doc.id, data: doc.data() });
                });
                if (tempArticles.length !== 0) {
                  setArticlesArray([...articlesArray, ...tempArticles]);
                  const lastVisible =
                    documentSnapshots.docs[documentSnapshots.docs.length - 1];
                  setLastStateOfArticles(lastVisible);
                } else {
                  setHasMoreDataForArticles(false);
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
          getNextData();
        }
      }
    } else if (activeOption === "Requested Projects") {
      if (
        lastStateOfRequestedProjects === null ||
        lastStateOfRequestedProjects === undefined
      ) {
        getRequestedProjects(tempQueryString);
      } else {
        const getNextData = async () => {
          let next;
          if (skill !== null && skill !== undefined && skill.trim() !== "") {
            next = query(
              collection(db, "projects"),
              orderBy("requestedOn", "desc"),
              where("status", "==", "pending"),
              where("skills", "array-contains", skill),
              startAfter(lastStateOfRequestedProjects),
              limit(15)
            );
          } else if (tag !== null && tag !== undefined && tag.trim() !== "") {
            next = query(
              collection(db, "projects"),
              orderBy("requestedOn", "desc"),
              where("status", "==", "pending"),
              where("tags", "array-contains", tempQueryString),
              startAfter(lastStateOfRequestedProjects),
              limit(15)
            );
          } else {
            next = query(
              collection(db, "projects"),
              orderBy("requestedOn", "desc"),
              where("status", "==", "pending"),
              where("keywords", "array-contains", tempQueryString),
              startAfter(lastStateOfRequestedProjects),
              limit(15)
            );
          }
          await getDocs(next)
            .then((documentSnapshots) => {
              let tempProjects = [];
              documentSnapshots.forEach((doc) => {
                tempProjects.push({ id: doc.id, data: doc.data() });
              });
              if (tempProjects.length !== 0) {
                setRequestedProjectsArray([
                  ...requestedProjectsArray,
                  ...tempProjects,
                ]);
                const lastVisible =
                  documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setLastStateOfRequestedProjects(lastVisible);
              } else {
                setHasMoreDataForRequestedProjects(false);
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
        getNextData();
      }
    } else if (activeOption === "Ongoing Projects") {
      if (
        lastStateOfOnGoingProjects === null ||
        lastStateOfOnGoingProjects === undefined
      ) {
        getOnGoingdProjects(tempQueryString);
      } else {
        const getNextData = async () => {
          let next;
          if (skill !== null && skill !== undefined && skill.trim() !== "") {
            next = query(
              collection(db, "projects"),
              orderBy("requestedOn", "desc"),
              where("status", "==", "development"),
              where("skills", "array-contains", skill),
              startAfter(lastStateOfOnGoingProjects),
              limit(15)
            );
          } else if (tag !== null && tag !== undefined && tag.trim() !== "") {
            next = query(
              collection(db, "projects"),
              orderBy("requestedOn", "desc"),
              where("status", "==", "development"),
              where("tags", "array-contains", tempQueryString),
              startAfter(lastStateOfOnGoingProjects),
              limit(15)
            );
          } else {
            next = query(
              collection(db, "projects"),
              orderBy("requestedOn", "desc"),
              where("status", "==", "development"),
              where("keywords", "array-contains", tempQueryString),
              startAfter(lastStateOfOnGoingProjects),
              limit(15)
            );
          }
          await getDocs(next)
            .then((documentSnapshots) => {
              let tempProjects = [];
              documentSnapshots.forEach((doc) => {
                tempProjects.push({ id: doc.id, data: doc.data() });
              });
              if (tempProjects.length !== 0) {
                setOnGoingProjectsArray([
                  ...requestedProjectsArray,
                  ...tempProjects,
                ]);
                const lastVisible =
                  documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setLastStateOfOnGoingProjects(lastVisible);
              } else {
                setHasMoreDataForOnGoingProjects(false);
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
        getNextData();
      }
    } else if (activeOption === "Completed Projects") {
      if (
        lastStateOfCompletedProjects === null ||
        lastStateOfCompletedProjects === undefined
      ) {
        getCompletedProjects(tempQueryString);
      } else {
        const getNextData = async () => {
          let next;
          if (skill !== null && skill !== undefined && skill.trim() !== "") {
            next = query(
              collection(db, "projects"),
              orderBy("completedOn", "desc"),
              where("status", "==", "completed"),
              where("skills", "array-contains", skill),
              startAfter(lastStateOfCompletedProjects),
              limit(15)
            );
          } else if (tag !== null && tag !== undefined && tag.trim() !== "") {
            next = query(
              collection(db, "projects"),
              orderBy("completedOn", "desc"),
              where("status", "==", "cpmpleted"),
              where("tags", "array-contains", tempQueryString),
              startAfter(lastStateOfCompletedProjects),
              limit(15)
            );
          } else {
            next = query(
              collection(db, "projects"),
              orderBy("completedOn", "desc"),
              where("status", "==", "completed"),
              where("keywords", "array-contains", tempQueryString),
              startAfter(lastStateOfCompletedProjects),
              limit(15)
            );
          }
          await getDocs(next)
            .then((documentSnapshots) => {
              let tempProjects = [];
              documentSnapshots.forEach((doc) => {
                tempProjects.push({ id: doc.id, data: doc.data() });
              });
              if (tempProjects.length !== 0) {
                setCompletedProjectsArray([
                  ...requestedProjectsArray,
                  ...tempProjects,
                ]);
                const lastVisible =
                  documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setLastStateOfCompletedProjects(lastVisible);
              } else {
                setHasMoreDataForCompletedProjects(false);
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
        getNextData();
      }
    } else if (activeOption === "People") {
      if (lastStateOfPeople === null || lastStateOfPeople === undefined) {
        getPeople(tempQueryString);
      } else {
        const getNextData = async () => {
          const next = query(
            collection(db, "users"),
            where("keywords", "array-contains", tempQueryString),
            startAfter(lastStateOfPeople),
            limit(15)
          );
          await getDocs(next)
            .then((documentSnapshots) => {
              let tempPeople = [];
              documentSnapshots.forEach((doc) => {
                tempPeople.push({ id: doc.id, data: doc.data() });
              });
              if (tempPeople.length !== 0) {
                setPeopleArray([...peopleArray, ...tempPeople]);
                const lastVisible =
                  documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setLastStateOfPeople(lastVisible);
              } else {
                setHasMoreDataForPeople(false);
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
        getNextData();
      }
    } else if (activeOption === "Interview Experience") {
      if (
        (lastStateOfInterviewExperiences === null ||
          lastStateOfInterviewExperiences === undefined) &&
        noMoreDataForInterviewExperiences === false
      ) {
        getInterviewExperiences(tempQueryString);
      } else {
        const getNextData = async () => {
          let next;
          if (tag !== null && tag !== undefined && tag.trim() !== "") {
            next = query(
              collection(db, "articles"),
              orderBy("postedOn", "desc"),
              where("isInterviewExperience", "==", 1),
              where("tags", "array-contains", tempQueryString),
              startAfter(lastStateOfArticles),
              limit(15)
            );
          } else {
            next = query(
              collection(db, "articles"),
              orderBy("postedOn", "desc"),
              where("isInterviewExperience", "==", 1),
              where("keywords", "array-contains", tempQueryString),
              startAfter(lastStateOfArticles),
              limit(15)
            );
          }
          await getDocs(next)
            .then((documentSnapshots) => {
              let tempArticles = [];
              documentSnapshots.forEach((doc) => {
                tempArticles.push({ id: doc.id, data: doc.data() });
              });
              if (tempArticles.length !== 0) {
                setInterviewExperiences([
                  ...interviewExperiences,
                  ...tempArticles,
                ]);
                const lastVisible =
                  documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setLastStateOfInterviewExperiences(lastVisible);
              } else {
                setHasMoreDataForInterviewExperiences(false);
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
        getNextData();
      }
    } else {
      if (lastStateOfTags === null || lastStateOfTags === undefined) {
        getTags(tempQueryString);
      } else {
        const getNextData = async () => {
          const next = query(
            collection(db, "build-code-tags"),
            orderBy("addedOn", "desc"),
            where("keywords", "array-contains", tempQueryString),
            startAfter(lastStateOfTags),
            limit(200)
          );
          await getDocs(next)
            .then((documentSnapshots) => {
              let tempTags = [];
              documentSnapshots.forEach((doc) => {
                tempTags.push(doc.data().value);
              });

              if (tempTags.length !== 0) {
                setTagsArray([...tagsArray, ...tempTags]);
                const lastVisible =
                  documentSnapshots.docs[documentSnapshots.docs.length - 1];
                setTagsArray(lastVisible);
              } else {
                setHasMoreDataForTags(false);
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
        getNextData();
      }
    }
  };

  const loader =
    activeOption === "Articles" ? (
      hasMoreDataForArticles === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : null
    ) : activeOption === "Requested Projects" ? (
      hasMoreDataForRequestedProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : null
    ) : activeOption === "Ongoing Projects" ? (
      hasMoreDataForOnGoingProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : null
    ) : activeOption === "Completed Projects" ? (
      hasMoreDataForCompletedProjects === true ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : null
    ) : activeOption === "People" ? (
      hasMoreDataForPeople ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : null
    ) : activeOption === "Tags" ? (
      hasMoreDataForTags ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : null
    ) : activeOption === "Interview Experience" ? (
      hasMoreDataForInterviewExperiences ? (
        <div key="loader" className="loader">
          <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
        </div>
      ) : null
    ) : null;

  return (
    <>
      <Helmet>
        <meta charset="utf-8" />

        <meta content="width=device-width,initial-scale=1.0" name="viewport" />

        <meta content="noindex" name="robots" />

        <title>Search on BuildCode</title>

        <meta
          name="keywords"
          keywords="Articles,  Interview Experiences, Requested Projects, Completed Projects,Users, Tags, Coding, interview, coding interview, Off campus Interview Experiences, On campus Interview Experiences, How to prepare for Interview, interview question and answer, interview questions sde, coding round preparation, coding round, how to crack product based company interview, Blogs"
        ></meta>

        <meta
          content="Latest Articles, Interview Experiences, and stories for students and developers."
          name="description"
        />

        <link href="https://buildcode.org/articles" rel="canonical" />

        <meta content="Articles" itemprop="name" />

        <meta
          content="Latest Articles, Interview Experiences, Requested Projects, Completed Projects,  and stories for students and developers."
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
      <div className="filter-page-grid">
        <div className="query-string-details">
          <h4>
            Search results for{" "}
            <strong style={{ color: "black" }}>
              {tag !== null && tag !== undefined
                ? tag + " tag"
                : people !== null && people !== undefined
                ? people
                : queryString !== null && queryString !== undefined
                ? queryString
                : skill !== null && skill !== undefined
                ? skill + " skill"
                : " "}
            </strong>
          </h4>
        </div>
        <div className="requested-projects-home-page-tag">
          <ul>
            <li>
              <button
                className={activeOption === "Articles" ? "active-option" : ""}
                onClick={() => setActiveOption("Articles")}
              >
                Articles
              </button>
            </li>
            <li>
              <button
                className={
                  activeOption === "Interview Experience" ? "active-option" : ""
                }
                onClick={() => setActiveOption("Interview Experience")}
              >
                Interview Experience
              </button>
            </li>
            <li>
              <button
                className={
                  activeOption === "Requested Projects" ? "active-option" : ""
                }
                onClick={() => setActiveOption("Requested Projects")}
              >
                Requested Projects
              </button>
            </li>
            <li>
              <button
                className={
                  activeOption === "Ongoing Projects" ? "active-option" : ""
                }
                onClick={() => setActiveOption("Ongoing Projects")}
              >
                Ongoing Projects
              </button>
            </li>
            <li>
              <button
                className={
                  activeOption === "Completed Projects" ? "active-option" : ""
                }
                onClick={() => setActiveOption("Completed Projects")}
              >
                Completed Projects
              </button>
            </li>
            <li>
              <button
                className={activeOption === "People" ? "active-option" : ""}
                onClick={() => setActiveOption("People")}
              >
                People
              </button>
            </li>
            <li>
              <button
                className={activeOption === "Tags" ? "active-option" : ""}
                onClick={() => setActiveOption("Tags")}
              >
                Tags
              </button>
            </li>
          </ul>
        </div>
        <br />
        {done === false ? (
          <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
        ) : (
          <InfiniteScroll
            loadMore={fetchMoreItems}
            hasMore={
              activeOption === "Articles"
                ? hasMoreDataForArticles
                : activeOption === "Requested Projects"
                ? hasMoreDataForRequestedProjects
                : activeOption === "Completed Projects"
                ? hasMoreDataForCompletedProjects
                : activeOption === "People"
                ? hasMoreDataForPeople
                : activeOption === "Tags"
                ? hasMoreDataForTags
                : activeOption === "Interview Experience"
                ? hasMoreDataForInterviewExperiences
                : false
            }
            loader={loader}
          >
            <div className="filter-page-content">
              {activeOption === "Articles" ? (
                <>
                  {articlesArray.length > 0 ? (
                    articlesArray.map((data) => (
                      <BigArticleCard
                        key={data.id}
                        id={data.id}
                        data={data.data}
                      />
                    ))
                  ) : articlesArray.length === 0 ? (
                    <div className="no-found-main-grid">
                      <div className="no-found-grid">
                        <span>
                          We couldn’t find any search results for{" "}
                          <span id="search-string">
                            {queryString !== null && queryString !== undefined
                              ? queryString
                              : skill !== null && skill !== undefined
                              ? skill
                              : tag !== null && tag !== undefined
                              ? tag
                              : people !== null && people !== undefined
                              ? people
                              : ""}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : activeOption === "Requested Projects" ? (
                <>
                  {requestedProjectsArray.length > 0 ? (
                    <div className="card-container">
                      {requestedProjectsArray.map((data) => {
                        return (
                          <RequestCard
                            key={data.id}
                            data={data.data}
                            id={data.id}
                          />
                        );
                      })}
                    </div>
                  ) : requestedProjectsArray.length === 0 ? (
                    <div className="no-found-main-grid">
                      <div className="no-found-grid">
                        <span>
                          We couldn’t find any search results for{" "}
                          <span id="search-string">
                            {" "}
                            {queryString !== null && queryString !== undefined
                              ? queryString
                              : skill !== null && skill !== undefined
                              ? skill
                              : tag !== null && tag !== undefined
                              ? tag
                              : people !== null && people !== undefined
                              ? people
                              : ""}{" "}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : activeOption === "Ongoing Projects" ? (
                <>
                  {onGoingProjectsArray.length > 0 ? (
                    <div className="card-container">
                      {onGoingProjectsArray.map((data) => {
                        return (
                          <RequestCard
                            key={data.id}
                            data={data.data}
                            id={data.id}
                            isOnGoing={true}
                          />
                        );
                      })}
                    </div>
                  ) : onGoingProjectsArray.length === 0 ? (
                    <div className="no-found-main-grid">
                      <div className="no-found-grid">
                        <span>
                          We couldn’t find any search results for{" "}
                          <span id="search-string">
                            {" "}
                            {queryString !== null && queryString !== undefined
                              ? queryString
                              : skill !== null && skill !== undefined
                              ? skill
                              : tag !== null && tag !== undefined
                              ? tag
                              : people !== null && people !== undefined
                              ? people
                              : ""}{" "}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : activeOption === "Completed Projects" ? (
                <>
                  {completedProjectsArray.length > 0 ? (
                    <div className="completed-card-container">
                      {completedProjectsArray.map((data) => (
                        <DoneProjectCard
                          key={data.id}
                          id={data.id}
                          data={data.data}
                        />
                      ))}
                    </div>
                  ) : completedProjectsArray.length === 0 ? (
                    <div className="no-found-main-grid">
                      <div className="no-found-grid">
                        <span>
                          We couldn’t find any search results for{" "}
                          <span id="search-string">
                            {" "}
                            {queryString !== null && queryString !== undefined
                              ? queryString
                              : skill !== null && skill !== undefined
                              ? skill
                              : tag !== null && tag !== undefined
                              ? tag
                              : people !== null && people !== undefined
                              ? people
                              : ""}{" "}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : activeOption === "People" ? (
                <>
                  {peopleArray.length > 0 ? (
                    <div className="user-profile-container">
                      {peopleArray.map((data) => (
                        <UserProfileCard
                          key={data.id}
                          id={data.id}
                          data={data.data}
                        />
                      ))}
                    </div>
                  ) : peopleArray.length === 0 ? (
                    <div className="no-found-main-grid">
                      <div className="no-found-grid">
                        <span>
                          We couldn’t find any search results for{" "}
                          <span id="search-string">
                            {" "}
                            {queryString !== null && queryString !== undefined
                              ? queryString
                              : skill !== null && skill !== undefined
                              ? skill
                              : tag !== null && tag !== undefined
                              ? tag
                              : people !== null && people !== undefined
                              ? people
                              : ""}{" "}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : activeOption === "Interview Experience" ? (
                <>
                  {interviewExperiences.length > 0 ? (
                    interviewExperiences.map((data) => (
                      <BigArticleCard
                        key={data.id}
                        id={data.id}
                        data={data.data}
                      />
                    ))
                  ) : interviewExperiences.length === 0 ? (
                    <div className="no-found-main-grid">
                      <div className="no-found-grid">
                        <span>
                          We couldn’t find any search results for{" "}
                          <span id="search-string">
                            {" "}
                            {queryString !== null && queryString !== undefined
                              ? queryString
                              : skill !== null && skill !== undefined
                              ? skill
                              : tag !== null && tag !== undefined
                              ? tag
                              : people !== null && people !== undefined
                              ? people
                              : ""}{" "}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {tagsArray.length > 0 ? (
                    <div className="view-article-tags">
                      <i className="las la-tags"></i>
                      {tagsArray.map((tag) => (
                        <a key={uuidv4()} href={`/search/tags/${tag}`}>
                          <small>
                            <span>#</span>
                            {tag}
                          </small>
                        </a>
                      ))}
                    </div>
                  ) : tagsArray.length === 0 ? (
                    <div className="no-found-main-grid">
                      <div className="no-found-grid">
                        <span>
                          We couldn’t find any search results for{" "}
                          <span id="search-string">
                            {" "}
                            {queryString !== null && queryString !== undefined
                              ? queryString
                              : skill !== null && skill !== undefined
                              ? skill
                              : tag !== null && tag !== undefined
                              ? tag
                              : people !== null && people !== undefined
                              ? people
                              : ""}{" "}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}

export default FilterPage;
