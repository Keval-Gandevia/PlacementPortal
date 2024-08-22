const express = require("express");
const multer = require("multer");
const path = require("path");
const http = require("http");
const proc = require("process");
const app = express();
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const hostingConfig = require("./Config/hostingConfig");
const StudentRouter = require("./Routers/StudentRouter");
const AnnoucementRouter = require("./Routers/AnnoucementRouter");
const CompanyRouter = require("./Routers/CompanyRouter");
const StudentPlacementRouter = require("./Routers/StudentPlacementRouter");
const StudentInternshipRouter = require("./Routers/StudentInternshipRouter");
const AnnouncementSubscibeRouter = require("./Routers/AnnouncementSubscribeRouter");
const NotificationRouter = require("./Routers/NotificationRouter");
const StudentLoginRouter = require("./Routers/StudentLoginRouter");
const CommentRouter = require("./Routers/CommentRouter");
const cookieParser = require("cookie-parser");
const MailerService = require("./Services/MailerService");
const SkillsAndAchievementsRouter = require("./Routers/SkillsAndAchievementRouter");
const AdminLoginRouter = require("./Routers/AdminLoginRouter");
const StudentProjectRouter = require("./Routers/StudentProjectRouter");
const StudentAchievementsInternshipsRouter = require("./Routers/StudentAchievementsInternshipsRouter");
const ReportsRouter = require("./Routers/ReportsRouter");
const LogoutRouter = require("./Routers/LogoutRouter");
const fileupload = require("express-fileupload");
const { exec } = require("child_process");

require("dotenv").config();

if (process.env.NODE_ENV == "production") {
  var writeStream = fs.createWriteStream("./Logs/test.log", {
    encoding: "utf8",
    flags: "w",
  });
  process.stdout = require("stream").Writable();
  process.stdout._write = function (chunk, encoding, callback) {
    writeStream.write(chunk, encoding, callback);
  };
  process.stderr = require("stream").Writable();
  process.stderr._write = function (chunk, encoding, callback) {
    writeStream.write(chunk, encoding, callback);
  };
  // process.stdout = require('stream').Writable();
}

// Middlewares
console.log(`App running in ${process.env.NODE_ENV}`);

try {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + "/public"));
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 1000 * 60, // 12 hour duration in milliseconds
      max: 500,
      message: "You exceeded the allowed requests. Please try again!",
      headers: true,
    })
  );



  // const port = hostingConfig.SERVER_PORT_NO
  if (process.env.NODE_ENV == "production") {
    app.listen(3000, '127.0.0.1', 511, () => {
      console.log(`Production server is running on port 3000`);
    });

    app.post("/monitorstats", (req, res) => {
      exec(`echo "-------------------------------------------";mpstat;echo "-------------------------------------------";iostat; echo "-------------------------------------------";vmstat;`, (error, stdout, stderr) => {
        if (error) {
          return res.send(error.toString())
        }
        if (stderr) {
          return res.send(stderr.toString())
        }
        // console.log(`stdout: ${stdout}`);
        return res.send(stdout.toString())
      });
    });
  }
  else {

    app.listen(process.env.PORT, () => {
      console.log(`Development server is running on port ${process.env.PORT}`);
    });
  }

  //routers
  app.use("/public", express.static(__dirname + "/public"));
  app.use("/student", StudentRouter);
  app.use("/studentLogin", StudentLoginRouter);
  app.use("/annoucement", AnnoucementRouter);
  app.use("/company", CompanyRouter);
  app.use("/studentplacement", StudentPlacementRouter);
  app.use("/studentinternship", StudentInternshipRouter);
  app.use("/subscribeannouncement", AnnouncementSubscibeRouter);
  app.use("/comment", CommentRouter);
  app.use("/notifications", NotificationRouter);
  app.use("/adminLogin", AdminLoginRouter);
  app.use("/skillsandachievements", SkillsAndAchievementsRouter);
  app.use("/studentproject", StudentProjectRouter);
  app.use(
    "/StudentAchievementsInternships",
    StudentAchievementsInternshipsRouter
  );
  app.use("/reports", ReportsRouter);
  app.use("/logout", LogoutRouter);

  if (process.env.NODE_ENV === "production") {
    if (process.env.HOSTENV == "heroku") {
      app.use(express.static(path.join(__dirname, "../Client", "/build")));
      app.get("*", (req, res) => {
        res.sendFile(
          path.resolve(__dirname, "../Client", "./build", "index.html")
        );
      });
    } else {
      console.log("Here");
      app.use(express.static(path.join(__dirname, "./build")));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./build", "index.html"));
      });
    }
  } else {
    app.get("/", (req, res) => {
      res.send("Working all right!");
    });
  }
} catch (err) {
  console.log(err.toString());
}
