import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import db from "../../firebase/firebase-config";
import UserRequestedCard from "../../components/RequestCard/UserRequestedCard";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Home.css";

function HomeRequestedProjects() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [requestedProjectsArray, setRequestedProjectsArray] = useState([]);

  useEffect(() => {
    const getRequestedProjects = async () => {
      const first = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        where("status", "==", "pending"),
        limit(63)
      );
      await getDocs(first)
        .then((documentSnapshots) => {
          let tempProjects = [];
          documentSnapshots.forEach((doc) => {
            tempProjects.push({ id: doc.id, data: doc.data() });
          });
          setRequestedProjectsArray(tempProjects);
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
  }, [navigate]);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 700px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 700px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  return (
    <>
      {done === false ? (
        <></>
      ) : (
        <>
          <div className="home-requested-card-container">
            {!matches === true ? (
              <></>
            ) : (
              <div id="latest-requested-project-intro-btn">
                <button>Latest Requested Projects</button>
                <ArrowDropDownIcon></ArrowDropDownIcon>
              </div>
            )}
            {requestedProjectsArray.map((data) => {
              return (
                <UserRequestedCard
                  key={data.id}
                  data={data.data}
                  id={data.id}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default HomeRequestedProjects;
