const mongoose = require("mongoose");

const csvSchema = new mongoose.Schema(
    {
        postId: Number,
        id: Number,
        name: String,
        email: String,
        body: String,
    },
    { collection: "user_csv" }
);

const csvModel = mongoose.model("user_csv", csvSchema);

module.exports = csvModel;
