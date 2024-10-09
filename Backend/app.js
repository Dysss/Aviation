require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const routeTable = require("./routes/routeTable.js");
const app = express();

const upload = multer({ dest: "uploads/" });

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
