const mongoose = require("mongoose");
require('dotenv').config()

const username = process.env.DBUSERNAME
const password = process.env.DBPASSWORD
const datebase = process.env.DBNAME
const string = process.env.DBSTRING
db = mongoose.connect(
  `mongodb+srv://${username}:${password}@${string}/${datebase}?retryWrites=true&w=majority`,
  (err) => {
    if (err) {
      console.log(err);
      return
    }
    console.log("Database connected");
  }
);
module.exports = { db };
