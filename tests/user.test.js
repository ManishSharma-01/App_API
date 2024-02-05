const request = require("supertest");
const app = require(""); 
const User = require("../models/User");

describe("User API Routes", () => {
  // Mock User data for testing
  const mockUser = {
    username: "testuser",
    password: "testpassword",
  };

  let createdUserId;

  beforeAll(async () => {
  });

  afterAll(async () => {
  });

  it("should create a new user", async () => {
    const response = await request(app)
      .post("/register")
      .send(mockUser);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User created successfully");

    createdUserId = response.body.data._id;
  });

  it("should get a single user by ID", async () => {
    const response = await request(app)
      .get(`/getUser/${createdUserId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(createdUserId);
  });

});
