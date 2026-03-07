const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const unitController = require("../controllers/unitController");
const adminKey = require("../middleware/adminKey");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, and TXT are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Public routes
router.get("/units", unitController.getAllUnits);
router.get("/units/:id", unitController.getUnitById);

// Admin-protected routes
router.post("/units", adminKey, upload.single("file"), unitController.createUnit);
router.put("/units/:id", adminKey, upload.single("file"), unitController.updateUnit);
router.delete("/units/:id", adminKey, unitController.deleteUnit);

module.exports = router;
