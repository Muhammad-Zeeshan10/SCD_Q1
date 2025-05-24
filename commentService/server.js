const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected "))
  .catch(err => console.error("MongoDB  failed", err));

const commentSchema = new mongoose.Schema({
  blogId: String,
  content: String,
  userId: String,
});
const Comment = mongoose.model("Comment", commentSchema);

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Token missing");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
}

app.post("/comments", authMiddleware, async (req, res) => {
  const comment = new Comment({ ...req.body, userId: req.user.userId });
  await comment.save();
  res.send(comment);
});

app.get("/comments/:blogId", async (req, res) => {
  const comments = await Comment.find({ blogId: req.params.blogId });
  res.send(comments);
});

//comments service
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
