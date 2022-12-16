require("dotenv").config();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
var cors = require("cors");
const express = require("express");
const router = express.Router();
const app = express();

app.use(cors());
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BUILDCODE_USER,
    pass: process.env.BUILDCODE_PASS,
  },
});

app.get("/", (req, res) => {
  res.json({
    status: "success",
  });
});

app.post("/buildcode/send-mail-to", (req, res, next) => {
  let buildcodeDomainName = "https://buildcode.org";
  let email = "";
  var subject = req.body.subject;
  let name = "";
  let message = "";

  if (subject === "Welcome to BuildCode") {
    email = req.body.newUserEmail;
    name = req.body.newUserName;
    message = `
  <div style="width: 100%; height: 100%; color: black; font-size:1.2rem;">
        <div style="
          background-color: white;
          width: 100%;          
          border-radius: 10px;
          margin: auto;
          text-align: left;
          color:"black";
        ">
            <div>
                Hi ${name},
                <br/>
                <br /> 
                Welcome to BuildCode, BuildCode helps<br/>
                students  & software developers like you<br/>
                to efficiently grow your skills by making the<br/>
                projects and land the job of your dreams.<br />
                <br/>
                With BuildCode, I set out to solve the <br/>
                most common problems which i had when <br/> 
                I was pursuing my B.Tech. I always found it <br/>
                difficult: <br />
                <ul>
                    <li>
                        Find peers to make a project together.
                    </li>
                    <li>
                        Making project blog while developing the project.
                    </li>
                </ul>
              <br/>
                <div style="
              width: 100%;             
                     
            ">
                    <div style="  display: inline-block;">
                        <a href="${buildcodeDomainName}/project-request" target="_blank"> <button style="
              border: 2px solid blue;
              background: rgb(0, 26, 255);
              border-radius: 10px;
              padding: 0.8rem;
              cursor: pointer !important;
              font-size: 1rem;
              font-weight: 700;
              color: white;
            
            ">
            Make Project Request
          </button>
                    </div>

                    <br/>
                    <br/>


                    <div style="  display: inline-block;">
                        </a>
                        <a href="${buildcodeDomainName}/write" target="_blank">
                            <button style="
                border: 2px solid blue;
              background: rgb(0, 26, 255);
              border-radius: 10px;
              padding: 0.8rem;
              cursor: pointer !important;
              font-size: 1rem;
              font-weight: 700;
              color: white;
              ">
              Write Article
            </button>
                        </a>
                    </div>
                </div>
                <br /> We’re very happy to have you in the community,<br/>
                 and if there’s any way we can make your learning <br/>
                 experience better, please don’t hesitate to reach<br/>
                 out to me.[pawan.u@buildcode.org]
                <br />
                <br /> Happy learning!
                <br />
                <br />
                <a href="https://www.linkedin.com/in/pawan-kumar-923b04202/" target="_blank">Pawan Kumar Mehta</a
          ><br/>
          Founder and CEO @ BuildCode
            <br/>
            <br/>
            <small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>          
             <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
              </small>  
          </div>
        </div>
    </div>
  `;
  } else if (subject === "Requested for joining the project") {
    var teamLeaderName = req.body.teamLeaderName;
    name = teamLeaderName;
    var teamLeaderEmailID = req.body.teamLeaderEmailID;
    email = teamLeaderEmailID;
    var requestedProjectName = req.body.requestedProjectName;
    var requestedMemberName = req.body.requestedMemberName;
    var projectUniqueID = req.body.projectUniqueID;
    var requestedProjectDate = req.body.requestedProjectDate;
    var link = buildcodeDomainName + `/projects/${projectUniqueID}`;

    message = `
    <div style="width: 100%; height: 100%; color: black; font-size: 1.2rem">
        <div style="
          background-color: white;
          width: 100%;
          border-radius: 10px;
          margin: auto;
          text-align: left;
          color: black;
        ">
            <div>
                Hi ${teamLeaderName},<br />
                <br />
                <a href="${link}">
                    <div style="
                width: fit-content;
                padding: 0.6rem;
                border-radius: 0.2rem;
                background: rgb(30, 0, 255);
              ">
                        <span style="font-size: 1.2rem; color: rgb(255, 255, 255)">
                ${requestedProjectName}
              </span>
                    </div>
                </a>
          <small style="font-size: 0.8rem; color: rgb(160, 158, 158)">
            Requested on:<small style="color: black"
              > ${requestedProjectDate}</small
            >
          </small>
          <br />
          <br />
          We like to inform you that, ${requestedMemberName} <br />
          has requested to join the ${requestedProjectName} <br />
          project So please have a look at ${requestedMemberName}'s<br />
          profile to get to know whether ${requestedMemberName} <br />
          is capable to contribute in your project or not.
          <br/>
            <br/>
  
  <small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>
              <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
              </small>  
        </div>
      </div>
    </div>
    `;
  } else if (subject === "Request Accepted!!!") {
    var newMemberName = req.body.newMemberName;
    name = newMemberName;
    var newMemberEmailID = req.body.newMemberEmailID;
    email = newMemberEmailID;
    var requestedProjectName = req.body.requestedProjectName;
    var projectUniqueID = req.body.projectUniqueID;
    var requestedProjectDate = req.body.requestedProjectDate;
    var link = buildcodeDomainName + `/projects/${projectUniqueID}`;

    message = `
      <div style="width: 100%; height: 100%; color: black; font-size: 1.2rem">
        <div style="
          background-color: white;
          width: 100%;
          border-radius: 10px;
          margin: auto;
          text-align: left;
          color: black;
        ">
            Congratulation ${newMemberName}<br/><br/> 
            Your request for the 
            <a href='${link}'> 
            <span style="font-size: 1.2rem; color: blue">${requestedProjectName}</span
            ></a> project <br/></a>
            has been accepted by your team leader,<br/>
            we hope you will going to have a great <br/>
            learning experience with your team members,<br/>
            we wish for your bright future.
            <br/>
            <br/>
  
  <small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>
                      <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
              </small>  
        </div>
    </div>
      `;
  } else if (subject === "Request rejected!!!") {
    var rejectedUserName = req.body.rejectedUserName;
    name = rejectedUserName;
    var rejectedUserEmail = req.body.rejectedUserEmail;
    email = rejectedUserEmail;
    var requestedProjectName = req.body.requestedProjectName;
    var projectUniqueID = req.body.projectUniqueID;
    var requestedProjectDate = req.body.requestedProjectDate;
    var link = `${buildcodeDomainName}/projects/${projectUniqueID}`;
    message = `
      <div style="width: 100%; height: 100%; color: black; font-size: 1.2rem">
        <div style="
          background-color: white;
          width: 100%;
          border-radius: 10px;
          margin: auto;
          text-align: left;
          color: black;
        ">
            Hey ${rejectedUserName}, we hope you are doing <br/>
            absolutely great Sorry to inform you, that your<br/>
            request for the <a href='${link}'>
            <span style="font-size: 1.2rem; color: blue">${requestedProjectName}</span
            ></a> project <br/>
            has been denied. We hope you will keep on<br/>
            learning and this rejection will not going<br/> 
            to affect you.
            <br/>
            <br/>
  
  <small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>
                      <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
              </small>  
        </div>
    </div>
    </div>
      `;
  } else if (subject === "Someone have requested for submit the project!!!") {
    email = req.body.mailList;
    var requestedPerson = req.body.requestedPerson;
    var membersName = req.body.membersName;
    var teamLeaderName = req.body.teamLeaderName;
    var requestedProjectName = req.body.requestedProjectName;
    var projectUniqueID = req.body.projectUniqueID;
    var requestedProjectDate = req.body.requestedProjectDate;
    var link = `${buildcodeDomainName}/projects/${projectUniqueID}`;
    var membersList = "";
    for (let index = 0; index < membersName.length; index++) {
      membersList += `<li>${membersName[index]}</li>`;
    }
    var List = `<ol>${membersList}</ol>`;

    message = `
          <div style="width: 100%; height: 100%; color: black; font-size: 1.2rem">
          <div style="
            background-color: white;
            width: 100%;
            border-radius: 10px;
            margin: auto;
            text-align: left;
            color: black;
          ">
          <a href="${link}">
          <div style="
      width: fit-content;
      padding: 0.6rem;
      border-radius: 0.2rem;
      background: rgb(30, 0, 255);
    ">
              <span style="font-size: 1.2rem; color: rgb(255, 255, 255)">
      ${requestedProjectName}
    </span>
          </div>
      </a>
              <small style="font-size: 0.8rem; color: rgb(160, 158, 158)">
              Requested on:<small style="color: black"
                >${requestedProjectDate}</small
              >
              </small>
              <br/>
              <br />Team Member<br /> 
              ${List} <br /> 
              ${requestedPerson} have requested for<br /> 
              submit the Project.
              <br />
              <br /> 
              <small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>

              <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
              </small>    
          </div>
      </div>
    `;
  } else if (subject === "Team completed") {
    email = req.body.mailList;
    var membersName = req.body.membersName;
    var blogID = req.body.blogID;
    var rooomID = req.body.rooomID;
    var teamLeaderName = req.body.teamLeaderName;
    var requestedProjectName = req.body.requestedProjectName;
    var projectUniqueID = req.body.projectUniqueID;
    var requestedProjectDate = req.body.requestedProjectDate;
    var link = buildcodeDomainName + "/projects/" + projectUniqueID;
    var chatLink = buildcodeDomainName + "/rooms/" + rooomID;
    var blogLink =
      buildcodeDomainName + "/projects/updateprojectblog/" + blogID;
    var membersList = "";
    for (let index = 0; index < membersName.length; index++) {
      membersList += `<li>${membersName[index]}</li>`;
    }
    var List = `<ol>${membersList}</ol>`;

    message = `
    <div style="width: 100%; height: 100%; color: black; font-size: 1.2rem">
        <div style="
          background-color: white;
          width: 100%;
          border-radius: 10px;
          margin: auto;
          text-align: left;
          color: black;
        ">
            Congratulation Your team is ready to work on <br/> 
            the project <a href='${link}'>
            <span style="font-size: 1.2rem; color: blue">${requestedProjectName}</span
            ></a>
            <br/>
            <br/>
            Here is your chat <a href='${chatLink}'>room</a>,<br/> 
            where you can connect with your team members.<br/><br/>
            Here is your blog <a href='${blogLink}'>room</a>,<br/> 
            where you can write blog while developing the project.
            <br/>
            <br/> 

<small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>
                        <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
              </small>            
        </div>
    </div>
    </div>
    `;
  } else if (subject === "Project Completed !!!") {
    email = req.body.mailList;
    var membersName = req.body.membersName;
    var teamLeaderName = req.body.teamLeaderName;
    var requestedProjectName = req.body.requestedProjectName;
    var projectUniqueID = req.body.projectUniqueID;
    var requestedProjectDate = req.body.requestedProjectDate;
    var link = `${buildcodeDomainName}/projects/completed/${projectUniqueID}`;
    var membersList = "";
    for (let index = 0; index < membersName.length; index++) {
      membersList += `<li>${membersName[index]}</li>`;
    }
    var List = `<ol>${membersList}</ol>`;

    message = `
    <div style="width: 100%; height: 100%; color: black; font-size: 1.2rem">
        <div style="
          background-color: white;
          width: 100%;
          border-radius: 10px;
          margin: auto;
          text-align: left;
          color: black;
        ">
            <a href="${link}">
                    <div style="
                width: fit-content;
                padding: 0.6rem;
                border-radius: 0.2rem;
                background: rgb(30, 0, 255);
              ">
                        <span style="font-size: 1.2rem; color: rgb(255, 255, 255)">
                ${requestedProjectName}
              </span>
                    </div>
                </a>
          <small style="font-size: 0.8rem; color: rgb(160, 158, 158)">
            Requested on:<small style="color: black"
              >${requestedProjectDate}</small
            >
          </small>
        <br />Team Member<br />
        ${List}
        <br />       
        Congratulation !!! Your team leader ${teamLeaderName}<br />
        have successfully submitted the <a href='${link}'> 
        <span style="font-size: 1.2rem; color: blue">${requestedProjectName}</span
  ></a> Project.
        <br />
        <br />
        Share your Project with your's friends.
        <br />
        <br />

<small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>
                    <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
              </small>      
      </div>
    </div>
    `;
  } else if (subject === "Someone have sent message in Room!!!") {
    var teamMembers = req.body.teamMembers;
    var senderName = req.body.senderName;
    var senderMessage = req.body.senderMessage;
    var senderEmail = req.body.senderEmail;
    var roomId = req.body.roomId;
    var requestedProjectName = req.body.requestedProjectName;
    var requestedprojectUniqueID = req.body.requestedprojectUniqueID;
    var link = `${buildcodeDomainName}/rooms/${roomId}`;
    let membersList = "";
    let mailList = [];
    for (let memberObj of teamMembers) {
      membersList += `<li>${memberObj.name}</li>`;
      if (senderEmail !== memberObj.email) mailList.push(memberObj.email);
    }
    email = mailList;
    var List = `<ol>${membersList}</ol>`;

    message = `
    <div style="width: 100%; height: 100%; color: black; font-size: 1.2rem">
        <div style="
          background-color: white;
          width: 100%;
          border-radius: 10px;
          margin: auto;
          text-align: left;
          color: black;
        ">            
       
        <a href="https://www.buildcode.org/projects/${requestedprojectUniqueID}" >
                    <div style="
                width: fit-content;
                padding: 0.6rem;
                border-radius: 0.2rem;
                background: rgb(30, 0, 255);
              ">
                        <span style="font-size: 1.2rem; color: rgb(255, 255, 255)">
                ${requestedProjectName}
              </span>
                    </div>
                </a>   
        <br/>
        Team Member<br/>
        ${List}
        <br /> ${senderName} have sent a message in <a href="${link}">Chat Room</a>
        <br/>
        Message : ${senderMessage}             
        <br/>
        <br/>
        <small style="font-size: 0.8rem" > 
            If you have any queries reach us at: contact@buildcode.org<br/>
            Write to us: hello@buildcode.org
            </small>  
            <br/>
        <small style="font-size: 0.6rem" > ©2022 BuildCode. All rights reserved.
        </small>        
        </div>
    </div>
    `;
  }

  const mailOptions = {
    from: {
      name: "BuildCode",
      address: process.env.BUILDCODE_USER,
    },
    to: email,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      res.json({
        status: "error",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages!");
  }
});

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`server has started on ${PORT}`);
});
