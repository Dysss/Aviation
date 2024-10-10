const csv = require("csv-parser");
const stripBomStream = require("strip-bom-stream");
const csvModel = require("../models/DataModel.js");
const fs = require("fs");
const path = require("path")

exports.uploadCsv = async (req, res) => {
    const data = [];
    const file = req.file;
    
    // Check if file exists
    if (!file) {
        return res.status(400).json({ message: "Error: No file received" })
    }
    
    // Parse CSV
    try {
        // Check if file is csv
        if (path.extname(file.originalname) !== ".csv") {
            return res.status(400).json({ message: "Error: Invalid file type" })
        }

        // Parse and load csv data to data array
        await new Promise((resolve, reject) => {
            fs.createReadStream(file.path)
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
        // Delete uploaded file from local directory
        fs.unlink(file.path, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error: Failed to delete file" });
            }
        });
    }

    // Insert to DB
    let result;
    try {
        await csvModel.deleteMany({});      // Clear old data
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
        const query = req.query.search  // Search name/email/body if search query exist, else fetch all
            ? {
                  $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }, { body: { $regex: req.query.search, $options: "i" } }],
              }
            : {};

        const data = await csvModel
            .find(query)
            .skip((page - 1) * pageItems)
            .limit(pageItems);

        return res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch data" });
    }
};
