const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// AI Ask Endpoint
router.post("/ai/ask", aiController.askAI);

module.exports = router;
