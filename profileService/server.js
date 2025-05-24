const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected "))
  .catch(err => console.error("MongoDB failed", err));

const profileSchema = new mongoose.Schema({
  userId: String,
  bio: String,
});
const Profile = mongoose.model("Profile", profileSchema);

function authMiddleware(req, res, nesxt) {

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Token missing");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();S
  } catch {
    res.status(403).send("Invalid token");
  }
}

app.post("/profile", authMiddleware, async (req, res) => {
  const profile = new Profile({ userId: req.user.userId, ...req.body });
  await profile.save();
  res.send(profile);
});

app.put("/profile", authMiddleware, async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.userId },
    req.body,
    { new: true }
  );
  res.send(profile);
});

app.get("/profile", authMiddleware, async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.userId });
  res.send(profile);
});



//profile service
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
