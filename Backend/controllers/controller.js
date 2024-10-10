const csv = require("csv-parser");
const stripBomStream = require("strip-bom-stream");
const csvModel = require("../models/DataModel.js");
const fs = require("fs");

exports.uploadCsv = async (req, res) => {
    const data = [];

    // Parse CSV
    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(stripBomStream()) // Handle byte-order marks
                .pipe(csv())
                .on("data", (row) => {
                    data.push(row)
                })
                .on("end", resolve)
                .on("error", reject);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error: Invalid csv file" });
    } finally {
        // Delete upploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error: Failed to delete file" });
            }
        });
    }

    // Insert to DB
    let result;
    try {
        await csvModel.deleteMany({});
        result = await csvModel.insertMany(data);

        console.log("Data inserted successfully");
    } catch (err) {
        console.log("Failed to upload data \n", err);
        return res.status(500).json({ message: "Error: Failed to upload file" });
    }

    // Return success
    return res.status(200).json({
        message: "File successfully uploaded and saved.",
        data: `Inserted ${result.length} rows`,
    });
};

exports.getData = async (req, res) => {
    const page = req.query.page || 1;
    const pageItems = 10;

    try {
        const query = req.query.search
            ? {
                  $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }, { body: { $regex: req.query.search, $options: "i" } }],
              }
            : {};

        const data = await csvModel
            .find(query)
            .skip((page - 1) * pageItems)
            .limit(pageItems);

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch data" });
    }
};
