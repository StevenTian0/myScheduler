import { expect } from "chai"
import { describe, it, beforeEach, afterEach } from "mocha"
import mongoose, { Error as MongooseError } from "mongoose"
import User, { UiColor, LanguagePref } from "../../server/models/User.model"

const sinon = require("sinon")
const chai = require("chai")
const expect = chai.expect
const request = require("supertest")
const app = require("../../server/index")

describe("POST /api/user/signUp", () => {
	let createUserStub

	beforeEach(() => {
		createUserStub = sinon.stub(User.prototype, "save")
	})

	afterEach(() => {
		createUserStub.restore()
	})

	it("should fail to create a user with an existing email", (done) => {
		// Set up the mock response from User.save()
		const error = new Error("Email already exists") as any
		error.name = "MongoError"
		error.code = 11000
		createUserStub.rejects(error)

		// Make the request to create a new user with an existing email
		request(app)
			.post("/api/user/signUp")
			.send({
				email: "testuser@example.com",
				username: "testuser",
				password: "testpassword",
			})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body.error).to.equal("Email already exists")
				done()
			})
	})
})
