const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// AUTH
app.use("/auth", async (req, res) => {
  const url = `http://localhost:3001${req.path}`;
  const method = req.method.toLowerCase();
  try {
    const result = await axios({ method, url, data: req.body });
    res.status(result.status).send(result.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || "Error");
  }
});

// BLOGS
app.use("/blogs", async (req, res) => {
  const url = `http://localhost:3002${req.path}`;
  const method = req.method.toLowerCase();
  try {
    const result = await axios({
      method,
      url,
      data: req.body,
      headers: { Authorization: req.headers.authorization }
    });
    res.status(result.status).send(result.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || "Error");
  }
});

// COMMENTS
app.use("/comments", async (req, res) => {
  const url = `http://localhost:3003${req.path}`;
  const method = req.method.toLowerCase();
  try {
    const result = await axios({
      method,
      url,
      data: req.body,
      headers: { Authorization: req.headers.authorization }
    });
    res.status(result.status).send(result.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || "Error");
  }
});

// PROFILE
app.use("/profile", async (req, res) => {
  const url = `http://localhost:3004${req.path}`;
  const method = req.method.toLowerCase();
  try {
    const result = await axios({
      method,
      url,
      data: req.body,
      headers: { Authorization: req.headers.authorization }
    });
    res.status(result.status).send(result.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || "Error");
  }
});

app.listen(3000, () => console.log("API Gateway running on port 3000"));
