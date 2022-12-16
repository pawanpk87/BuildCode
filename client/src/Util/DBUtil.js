import db from "../firebase/firebase-config";
import {
  collection,
  doc,
  getDocs,
  where,
  setDoc,
  query,
} from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import {
  generateKeyWordsForUsers,
  getBuildCodePic,
  reservedName,
} from "./Utils";

export const createUser = async (input) => {
  try {
    let generatedUrlName = input.email
      .match(/^([^@]*)@/)[1]
      .replaceAll(".", "");
    // check if user is present in database

    const q = query(
      collection(db, "users"),
      where("urlName", "==", generatedUrlName)
    );

    const querySnapshot = await getDocs(q);

    let flag = false;

    querySnapshot.forEach((doc) => {
      flag = true;
    });

    if (flag === true && input.lastUsedNumber !== 0) {
      generatedUrlName += input.lastUsedNumber;
    } else {
      if (reservedName.indexOf(generatedUrlName) !== -1) flag = true;
      else if (flag === true) {
        generatedUrlName += uuidv4();
      }
    }
    let newObj = {
      ...input,
      keywords: generateKeyWordsForUsers(input.userName),
      profilePic: getBuildCodePic(input.userName[0].toUpperCase()),
      urlName: generatedUrlName,
    };

    const usersRef = doc(db, "users", generatedUrlName);
    return await setDoc(usersRef, newObj);
  } catch (error) {
    return error;
  }
};
