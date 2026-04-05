import "dotenv/config";
import { expect } from "chai";
import sinon from "sinon";
import User from "../models/user.js";
import { postLogin } from "../controllers/auth.js";
import mongoose from "mongoose";
import { getStatus } from "../controllers/status.js";

describe("Auth controller - login", () => {
  it("should throw an error if access to the database fails", async () => {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@example.com",
        password: "password",
      },
    };

    let caughtError;
    await postLogin(req, {}, (err) => {
      caughtError = err;
    });
    expect(caughtError).to.be.an("error");
    expect(caughtError).to.have.property("statusCode", 500);

    User.findOne.restore();
  });
});

describe("Status controller - getStatus", () => {
  it("should send a response with a valid user status for an existing user", async function () {
    this.timeout(10000);
    before(async () => {
      //before hook to set up the test environment by connecting to the MongoDB database and creating a test user, ensuring that the necessary data is available for the getStatus controller to function correctly during the test
      await mongoose.connect(process.env.MONGO_URI);
      const user = new User({
        email: "test@example.com",
        password: "password",
        name: "Test User",
        posts: [],
        _id: "64b8c0f1f1f1f1f1f1f1f1f1",
      });
      await user.save();
    });

    const req = { userId: "64b8c0f1f1f1f1f1f1f1f1f1" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    await getStatus(req, res, () => {});

    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal("I am new!");

    after(async () => {
      //after hook to clean up the test environment by deleting the test user from the database and disconnecting from MongoDB, ensuring that the test does not leave any residual data or connections that could affect other tests or the overall application
      await User.deleteMany({});
      await mongoose.disconnect();
    });
  });
});
