// tests/app.test.js
require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const cors = require("cors");
const csvModel = require("../models/DataModel.js"); // Adjust the path as necessary
const routeTable = require("../routes/routeTable.js");
const path = require("path")

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routeTable);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URL);
});

afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("uploadCsv Endpoint", () => {
    it("should return an error when sent no file", async () => {
        const response = await request(app)
            .post("/api/uploadCsv")

        // console.log(response)

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Error: No file received");
        });

    it("should return an error what sent non-csv file", async () => {
        const validCsvPath = path.join(__dirname, "test_files/invalidExt.txt")
        const response = await request(app)
            .post("/api/uploadCsv")
            .set("Content-Type", "multipart/form-data")
            .attach("file", validCsvPath);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Error: Invalid file type");
    });

    it("should parse and store csv into database", async () => {
        const validCsvPath = path.join(__dirname, "test_files/validData.csv")
        const response = await request(app)
            .post("/api/uploadCsv")
            .set("Content-Type", "multipart/form-data")
            .attach("file", validCsvPath);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "File successfully uploaded and saved.");
    });
});

describe("getData Endpoint", () => {
    beforeAll(async () => {
        await csvModel.deleteMany({});
        const csvFilePath = path.join(__dirname, "test_files/data.csv")
        await request(app)
            .post("/api/uploadCsv")
            .set("Content-Type", "multipart/form-data")
            .attach("file", csvFilePath);
    })

    it("should fetch the first page of entries", async () => {
        const response = await request(app).get("/api/getData")

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBe(10);
    })

    it("should return no entries if page exceeds max number of entries", async () => {
        const response = await request(app).get("/api/getData?page=51")

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBe(0);
    })

    it("should return 4 entries with params search=asm", async () => {
        const response = await request(app).get("/api/getData?search=asm")

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBe(4);
    })

    it("should return 7 entries with params search=lat&page=5", async () => {
        const response = await request(app).get("/api/getData?search=lat&page=5")

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBe(7);
    })
    
    it("should return 7 entries with params page=5&search=lat", async () => {
        const response = await request(app).get("/api/getData?page=5&search=lat")

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBe(7);
    })
})