require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const csvModel = require("./models/DataModel.js");
const routeTable = require("./routes/routeTable.js");
const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT",
    allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => console.error("Failed to connect to MongoDB: \n", err));

app.use("/api", routeTable);

let server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

async function handleShutdown () {
    console.log("Shutting down server");
    try {
        await csvModel.deleteMany({});
    } catch (err) {
        console.log(err)
    }
    console.log("Server shut down");
    server.close((err) => {
        process.exit(err ? 1 : 0);
    })
}

process.on('SIGTERM', async () => await handleShutdown())
process.on('SIGINT', async () => {
    console.log("Shutting down server")
    await csvModel.deleteMany({});
    console.log("Data deleted");
    server.close((err) => err ? process.exit(1) : process.exit(0))
})