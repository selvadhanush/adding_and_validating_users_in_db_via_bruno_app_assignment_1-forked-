const express = require("express");
const { resolve } = require("path");
require("dotenv").config();
const app = express();
const port = 3010;
const bcrypt = require("bcrypt");
app.use(express.json());

const UserModel = require("./schema");

const connection = require("./connection");
app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json("invalid");
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        res.status(500).json("internal server error");
      }
      const newUser = new UserModel({ username, email, password: hash });
      await newUser.save();
      res.status(200).json("registered sucessfully");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("serverErrror");
  }
});

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.log(error);
  }
});
