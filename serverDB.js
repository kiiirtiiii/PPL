const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/PPL", () => {
  console.log("connected to mongoDB");
});
