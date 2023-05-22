const mongoose = require("mongoose");

const dburl = "Your Connection String";

mongoose.set("strictQuery", false);
mongoose
  .connect(dburl)
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
