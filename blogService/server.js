const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB failed", err));

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
});
const Blog = mongoose.model("Blog", blogSchema);

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

app.post("/blogs", authMiddleware, async (req, res) => {
  const blog = new Blog({ ...req.body, userId: req.user.userId });
  await blog.save();
  res.send(blog);
});

app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.send(blogs);
});

app.delete("/blogs/:id", authMiddleware, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.userId !== req.user.userId) {
    return res.status(403).send("Not Found");
  }
  await blog.deleteOne();
  res.send("Blog deleted");
});



//blog service
app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/ready', (req, res) => {

  if (mongoose.connection.readyState === 1)
     {
    res.status(200).send('Ready');

  } else {

    res.status(500).send('Not ready');
  }
});


app.listen(process.env.PORT, () => console.log("Blog Service running on port", process.env.PORT));
