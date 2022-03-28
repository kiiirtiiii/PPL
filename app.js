require("dotenv").config();
require("./serverDB");
const express = require("express");
const app = express();
const { errorHandler, urlHandler } = require("./middlewares/error-handler");

const parser = require("body-parser");
app.use(parser.json());

const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

app.use("/user", userRoute);
app.use("/post", postRoute);

app.use(errorHandler);
app.use("*", urlHandler);

module.exports = { app };
