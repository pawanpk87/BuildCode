import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import db, { auth } from "../firebase/firebase-config";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { sendMailToNewUser } from "../Util/MailUtill";
import { createUser } from "../Util/DBUtil";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userUniqueId, setUserUniqueID] = useState(null);

  const getAndSetUserData = (email) => {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    onSnapshot(userQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUserData(doc.data());
        setUserUniqueID(doc.id);
      });
    });
  };

  useEffect(() => {
    /**
     * if user changes then check if user is Verified or not
     *
     * if email is verified then
     *  a) if user registered from Google.com
     *     then
     *
     *           I) if yes then set user UniqueId and Data
     *          II) if not then insert user into Databse and
     *              set user UniqueId and Data
     *
     *  a) if user registered with email and password
     *     then set user UniqueId and Data
     */
    if (user !== null) {
      if (user.emailVerified === true) {
        user.providerData.forEach((profile) => {
          if (profile.providerId === "google.com") {
            const checkUserPresentInDB = async () => {
              // check if user is present in database
              const q = query(
                collection(db, "users"),
                where("email", "==", profile.email)
              );
              await getDocs(q)
                .then((querySnapshot) => {
                  let flag = false;
                  let currentUserData = null;
                  let currentUserUniqueId;
                  querySnapshot.forEach((doc) => {
                    flag = true;
                    currentUserData = doc.data();
                    currentUserUniqueId = doc.id;
                  });
                  if (
                    flag === false ||
                    (currentUserData !== null &&
                      currentUserData !== undefined &&
                      flag === true &&
                      currentUserData.isDeleted === true)
                  ) {
                    // if not then insert current user into database
                    let tempLastUsedNumber = 0;

                    if (
                      currentUserData !== null &&
                      currentUserData !== undefined &&
                      flag === true &&
                      currentUserData.isDeleted === true
                    )
                      tempLastUsedNumber = currentUserData.lastUsedNumber + 1;

                    let input = {
                      profilePic: profile.photoURL,
                      userName: profile.email
                        .match(/^([^@]*)@/)[1]
                        .replaceAll(".", ""),
                      name:
                        profile.displayName === null
                          ? profile.email
                              .match(/^([^@]*)@/)[1]
                              .replaceAll(".", "")
                          : profile.displayName,
                      gender: "",
                      birthday: "",
                      email: profile.email,
                      role: "",
                      experience: "",
                      collegeOrCompany: "",
                      skills: [],
                      githubLink: "",
                      linkedInLink: "",
                      twitterLink: "",
                      codingProfileLink: "",
                      aboutMe: "",
                      completedProjects: [],
                      currentProjects: [],
                      articles: [],
                      totalLikes: 0,
                      joined: serverTimestamp(),
                      interestedDomain: [],
                      currentRooms: [
                        {
                          id: "BuildCode-chat-room33d3311e-a5fd-4569-8ae9-e9a4503e3801",
                          name: "BuildCode",
                        },
                      ],
                      askedQuestions: [],
                      answeredQuestions: [],
                      allActions: [],
                      signUpWith: "google",
                      keywords: [],
                      isDeleted: false,
                      location: "",
                      userVerion: "1",
                      redUser: false,
                      BuildCoders: false,
                      level: 1,
                      lastUsedNumber: tempLastUsedNumber,
                      myArticleList: [],
                      myProjectList: [],
                      myProjectBlogList: [],
                    };

                    createUser(input).then(() => {
                      getAndSetUserData(profile.email);
                      sendMailToNewUser(input.email, input.userName);
                    });
                  } else {
                    // if yes then set user UniqueId and Data
                    getAndSetUserData(profile.email);
                  }
                })
                .catch((error) => {});
            };
            checkUserPresentInDB();
          } else {
            /**
             * if user registered with email and password
             * then set user UniqueId and Data
             */
            getAndSetUserData(profile.email);
          }
        });
      } else {
        getAndSetUserData(user.email);
      }
    }
  }, [user]);

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  function logOut() {
    return signOut(auth);
  }

  function forgetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function deleteCurrentUser(email) {
    return deleteUser(email);
  }

  function verifyEmail() {
    return sendEmailVerification(auth.currentUser);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        signUp,
        user,
        logIn,
        logOut,
        deleteCurrentUser,
        googleSignIn,
        forgetPassword,
        userData,
        userUniqueId,
        verifyEmail,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
