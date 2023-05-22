const mongoose = require("mongoose");

const dburl =
  "mongodb+srv://aritra8438:cRtyDoKOTpXnVJJL@cluster0.gownv1w.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(dburl)
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
