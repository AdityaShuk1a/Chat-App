const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
