// import supertest from "supertest"
// import sinon from "sinon"
// import { expect } from "chai"
// import Blocker from "../../server/models/Blocker.model"
// import app from "../../server/index"
// import { describe, it, beforeEach, afterEach, before, after } from "mocha"
// import jwt from "jsonwebtoken"

// describe("Blocker API", () => {
// 	describe("POST /api/blocker/add", () => {
// 		let createBlockerStub
// 		let tokenStub

// 		beforeEach(() => {
// 			// Create a Sinon stub for the Blocker.create() method
// 			createBlockerStub = sinon.stub(Blocker.prototype, "save")
// 			tokenStub = sinon.stub(jwt, "verify").returns({ userId: "123" })
// 		})

// 		afterEach(() => {
// 			// Restore the original method after each test
// 			createBlockerStub.restore()
// 			tokenStub.restore()
// 		})

// 		it("should create a new blocker with valid input", (done) => {
// 			// Set up variables for blocker attributes
// 			const time = "2060-02-13T07:00:00.000Z"
// 			const duration = 60
// 			const name = "Test Blocker"
// 			const description = "This is a test blocker"
// 			const user = "123"
// 			const token = jwt.sign({ userId: "123" }, "secret")

// 			// Set up the mock response from Blocker.create()
// 			createBlockerStub.resolves({
// 				_id: "123",
// 				time,
// 				duration,
// 				name,
// 				description,
// 				user,
// 			})

// 			// Make the request to create a new blocker
// 			supertest(app)
// 				.post("/api/blocker/add")
// 				.send({ token, time, duration, name, description })
// 				.expect(201)
// 				.end((err, res) => {
// 					if (err) return done(err)
// 					expect(res.body).to.have.property("blocker")
// 					expect(res.body.blocker).to.have.property("time")
// 					expect(res.body.blocker).to.have.property("duration", duration)
// 					expect(res.body.blocker).to.have.property("name", name)
// 					expect(res.body.blocker).to.have.property("description", description)
// 					expect(res.body.blocker).to.have.property("user", user)
// 					done()
// 				})
// 		})

// 		// it("should return a 400 error if duration is missing", (done) => {
// 		// 	// Make the request to create a new blocker without duration
// 		// 	supertest(app)
// 		// 		.post("/api/blocker/add")
// 		// 		.send({
// 		// 			time: "2060-02-13T07:00:00.000Z",
// 		// 			name: "Test Blocker",
// 		// 			description: "This is a test blocker",
// 		// 			user: "6140baf2f6d68d6c748fa6e1",
// 		// 		})
// 		// 		.expect(400)
// 		// 		.end((err, res) => {
// 		// 			if (err) return done(err)
// 		// 			expect(res.body).to.have.property("error", "duration is required")
// 		// 			done()
// 		// 		})
// 		// })
// 	})
// })
