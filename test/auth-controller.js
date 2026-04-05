import { expect } from "chai";
import sinon from "sinon";
import User from "../models/user.js";
import { postLogin } from "../controllers/auth.js";

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
