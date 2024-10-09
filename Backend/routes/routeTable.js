const express = require("express");
const multer = require("multer");
const { uploadCsv, getData } = require("../controllers/controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/uploadCsv", upload.single("file"), uploadCsv);
router.get("/getData", getData);

module.exports = router;
