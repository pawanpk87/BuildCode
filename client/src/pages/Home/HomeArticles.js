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
import wandering from "../../assets/Images/Wandering.png";
import { Link, useNavigate } from "react-router-dom";

function HomeArticles() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [lastStateOfArticles, setLastStateOfArticles] = useState("");
  const [articlesArray, setArticlesArray] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    const getArticles = async () => {
      const q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        limit(30)
      );
      await getDocs(q)
        .then((querySnapshot) => {
          let tempArticlesArray = [];
          let lastVisible = lastStateOfArticles;
          querySnapshot.forEach((doc) => {
            tempArticlesArray.push({ id: doc.id, data: doc.data() });
            lastVisible = doc;
          });
          setArticlesArray(tempArticlesArray);
          setLastStateOfArticles(lastVisible);
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
  }, [navigate]);

  const fetchMoreItems = () => {
    const getMoreArticles = async () => {
      const q = query(
        collection(db, "articles"),
        orderBy("postedOn", "desc"),
        startAfter(lastStateOfArticles),
        limit(15)
      );
      await getDocs(q)
        .then((querySnapshot) => {
          let tempArticlesArray = [];
          let lastVisible = lastStateOfArticles;
          querySnapshot.forEach((doc) => {
            tempArticlesArray.push({ id: doc.id, data: doc.data() });
            lastVisible = doc;
          });
          if (tempArticlesArray.length > 0) {
            setArticlesArray([...articlesArray, ...tempArticlesArray]);
            setLastStateOfArticles(lastVisible);
          } else {
            setHasMoreData(false);
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
    getMoreArticles();
  };

  const loader =
    hasMoreData === true ? (
      <div key="loader" className="loader">
        <FadingBalls color={"blue"} height={"20px"} width={"75px"} />
      </div>
    ) : null;

  return (
    <>
      {done === false ? (
        <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
      ) : (
        <>
          <br />
          <div
            className="build-code-features"
            onClick={() => navigate("/project-request")}
          >
            <div id="img">
              <img src={wandering} alt="wandering" />
            </div>
            <div id="description">
              <h2>Want to build projects?</h2>
              <span>
                Not able to find peers or friends with whom you can make
                projects don't worry. Make a{" "}
                <span style={{ color: "blue" }}>Project Request</span> on
                BuildCode and{" "}
                <span style={{ color: "blue" }}>
                  Make Your Team &#38; Write Your Code
                </span>
              </span>
            </div>
          </div>
          <br />
          <div className="build-code-blog-card">
            <Link to="/how-to-make-project">
              <span>How to make Project on BuildCode?</span>
            </Link>
          </div>
          <InfiniteScroll
            loadMore={fetchMoreItems}
            hasMore={hasMoreData}
            loader={loader}
          >
            {articlesArray.map((data) => (
              <BigArticleCard key={data.id} id={data.id} data={data.data} />
            ))}
          </InfiniteScroll>
          <br />
          <br />
        </>
      )}
    </>
  );
}

export default HomeArticles;
