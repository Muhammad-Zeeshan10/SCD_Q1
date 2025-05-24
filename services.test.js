const request = require("supertest");

const AUTH_URL = "http://localhost:3001";
const BLOG_URL = "http://localhost:3002";
const COMMENT_URL = "http://localhost:3003";
const PROFILE_URL = "http://localhost:3004";

let token = "";
let blogId = "";

describe(" Tests", () => {
  beforeAll(async () => {
    
    await request(AUTH_URL)
      .post("/register")
      .send({ email: "zeeshan@gmail.com", password: "123456" });

    const res = await request(AUTH_URL)
      .post("/login")
      .send({ email: "zeeshan@gmail.com", password: "123456" });

    token = res.body.token;
  });

  // Blog Service 
  test("Create blog with valid JWT", async () => {
    const res = await request(BLOG_URL)

      .post("/blogs")

      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My Blog", content: "This is a blog post." });

    expect(res.statusCode).toBe(201);

    expect(res.body).toHaveProperty("_id");
    blogId = res.body._id;
  });

  //  Comment Service test
  test("Add comment with valid JWT", async () => {
    const res = await request(COMMENT_URL)

      .post("/comments")

      .set("Authorization", `Bearer ${token}`)

      .send({ blogId, content: "Nice post!" });

    expect(res.statusCode).toBe(201);
  });

  test("Reject comment without token", async () => {

    const res = await request(COMMENT_URL)


      .post("/comments")
      .send({ blogId, content: "Hacker post" });

    expect(res.statusCode).toBe(401);
  });

  // Profile Service 
  test("Fetch profile with valid JWT", async () => {

    const res = await request(PROFILE_URL)

      .get("/profile")

      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email");
  });

  test("updating another user's profile", async () => {

    const res = await request(PROFILE_URL)

      .put("/profile/fakeUserId123")
      .set("Authorization", `Bearer ${token}`)
      
      .send({ bio: "Unauthorized edit" });

    expect(res.statusCode).toBe(403);
  });
});
