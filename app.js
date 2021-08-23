"use strict";
const express = require("express");
const path = require("path");
const http = require("http");
const passport = require("./app/config/passport");
const app = express();
const helmet = require("helmet");
const models = require("./app/models");
const cors = require("cors");

const adminPath = path.join(__dirname, "../reswel-admin/build");
const clientPath = path.join(__dirname, "../reswel-frontend/build");

// Test API
app.get("/api/v1/auth/health", function (req, res) {
  return res
    .status(200)
    .send(
      "*** Welcome To Reswel *** \n Auth Service working 100%... \n " +
        new Date(Date.now())
    );
});
global.winston = require("./app/config/winston");

// Initialize Express
require("./app/config/express")(app, passport);

app.use(cors());

// app.use(helmet());
app.use("/static", express.static("public"));

//app.use(express_layout);
app.use(express.static(adminPath));
app.use(express.static(clientPath));

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// app.get('/', (req, res) => {
//   res.render('index.ejs')
// })

// Get port from environment and store in Express.
const port = process.env.PORT || "5000";

app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
server
  .listen(port, () => console.log(`API running on localhost:${port}`))
  .on("error", (error) => {
    console.log(error);
  });
console.log("Listening on port:", port);

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../reswel-frontend/build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../reswel-admin/build", "index.html"));
});

models.sequelize
  .sync({ force: false })
  .then(() => {
    winston.info("Database is Running");
  })
  .catch((e) => console.log(e));

const winston = require("winston");

module.exports = app;
