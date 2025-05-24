const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB connected "))
  .catch(err => console.error("MongoDB failed", err));


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await new User({ username, password: hashed }).save();

  res.send("User registered");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});


//auth service
app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/ready', (req, res) => {

  if (mongoose.connection.readyState === 1)
     {
    res.status(200).send('Ready');

  } else {

    res.status(500).send('Not ready');
  }
});



app.listen(process.env.PORT, () => console.log("Service running on port", process.env.PORT));
