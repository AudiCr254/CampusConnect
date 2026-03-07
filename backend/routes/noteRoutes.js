const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const noteController = require('../controllers/noteController');
const adminKey = require('../middleware/adminKey');
const noDownload = require('../middleware/noDownload');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, and TXT are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Public routes
router.get('/notes', noteController.getAllNotes);
router.get('/notes/search', noteController.searchNotes);
router.get('/notes/topic/:topicId', noteController.getNotesByTopic);
router.get('/notes/view/:id', noDownload, noteController.viewNote);
router.get('/notes/:id', noteController.getNoteById);

// Admin-protected routes
router.post('/notes', adminKey, upload.single('file'), noteController.createNote);
router.put('/notes/:id', adminKey, upload.single('file'), noteController.updateNote);
router.delete('/notes/:id', adminKey, noteController.deleteNote);

module.exports = router;
