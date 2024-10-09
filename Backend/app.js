require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
