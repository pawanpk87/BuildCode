import axios from "axios";

const buildCodeMailDomain = "https://buildcode-apis.herokuapp.com";
//const buildCodeMailDomain = "http://localhost:3030";

export const sendMailToNewUser = async (userEmail, userName) => {
  const subject = "Welcome to BuildCode";
  const newUserEmail = userEmail;
  const newUserName = userName;

  const body = {
    newUserEmail,
    newUserName,
    subject,
  };

  await axios
    .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => {
      return true;
    })
    .catch((error) => {
      console.log(error.message);
      return false;
    });
};
