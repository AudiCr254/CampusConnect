const { pool } = require("../config/db");
const fs = require("fs");
const path = require("path");

/**
 * Get all notes
 * GET /api/notes
 */
exports.getAllNotes = async (req, res) => {
  try {
    const [notes] = await pool.query(`
      SELECT n.id, n.title, n.description, n.created_at, n.topic_id,
             t.name as topic_name, t.description as topic_description, t.unit_id,
             u.name as unit_name
      FROM notes n
      LEFT JOIN topics t ON n.topic_id = t.id
      LEFT JOIN units u ON t.unit_id = u.id
      ORDER BY n.created_at DESC
    `);
    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes"
    });
  }
};

/**
 * Get notes by topic
 * GET /api/notes/topic/:topicId
 */
exports.getNotesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const [notes] = await pool.query(`
      SELECT n.id, n.title, n.description, n.created_at, n.topic_id,
             t.name as topic_name, t.description as topic_description, t.unit_id,
             u.name as unit_name
      FROM notes n
      LEFT JOIN topics t ON n.topic_id = t.id
      LEFT JOIN units u ON t.unit_id = u.id
      WHERE n.topic_id = ?
      ORDER BY n.created_at DESC
    `, [topicId]);
    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error("Error fetching notes by topic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes"
    });
  }
};

/**
 * Search notes
 * GET /api/notes/search?q=query
 */
exports.searchNotes = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }
    const searchQuery = `%${q}%`;
    
    const [notes] = await pool.query(`
      SELECT n.id, n.title, n.description, n.created_at, n.topic_id,
             t.name as topic_name, t.description as topic_description, t.unit_id,
             u.name as unit_name
      FROM notes n
      LEFT JOIN topics t ON n.topic_id = t.id
      LEFT JOIN units u ON t.unit_id = u.id
      WHERE n.title LIKE ? OR n.description LIKE ? OR n.content LIKE ?
      ORDER BY n.created_at DESC
    `, [searchQuery, searchQuery, searchQuery]);
    res.json({
      success: true,
      count: notes.length,
      query: q,
      data: notes
    });
  } catch (error) {
    console.error("Error searching notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search notes"
    });
  }
};

/**
 * Get single note by ID
 * GET /api/notes/:id
 */
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [notes] = await pool.query(`
      SELECT n.*, t.name as topic_name, t.description as topic_description, t.unit_id,
             u.name as unit_name
      FROM notes n
      LEFT JOIN topics t ON n.topic_id = t.id
      LEFT JOIN units u ON t.unit_id = u.id
      WHERE n.id = ?
    `, [id]);
    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    res.json({
      success: true,
      data: notes[0]
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch note"
    });
  }
};

/**
 * View note file
 * GET /api/notes/view/:id
 */
exports.viewNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [notes] = await pool.query(
      "SELECT file_path, title FROM notes WHERE id = ?",
      [id]
    );
    if (!notes.length || !notes[0].file_path) {
      return res.status(404).json({
        success: false,
        message: "Note file not found"
      });
    }
    const filePath = path.resolve(notes[0].file_path);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server"
      });
    }
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error viewing note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to view note"
    });
  }
};

/**
 * Create a new note (Admin only)
 * POST /api/notes
 */
exports.createNote = async (req, res) => {
  try {
    const { title, description, content, topic_id } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!title || !topic_id) {
      return res.status(400).json({
        success: false,
        message: "Note title and topic_id are required"
      });
    }

    const [result] = await pool.query(`
      INSERT INTO notes (title, description, content, topic_id, file_path, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [title, description || null, content || null, topic_id, filePath]);

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: {
        id: result.insertId,
        title,
        description,
        content,
        topic_id,
        file_path: filePath
      }
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create note"
    });
  }
};

/**
 * Update a note (Admin only)
 * PUT /api/notes/:id
 */
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, topic_id } = req.body;
    const [existing] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    let filePath = existing[0].file_path;
    if (req.file) {
      // Delete old file if exists
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      filePath = req.file.path;
    }
    const sql = `UPDATE notes 
                 SET title = ?, description = ?, content = ?, topic_id = ?, file_path = ?
                 WHERE id = ?`;
    await pool.query(sql, [
      title || existing[0].title,
      description !== undefined ? description : existing[0].description,
      content !== undefined ? content : existing[0].content,
      topic_id !== undefined ? topic_id : existing[0].topic_id,
      filePath,
      id
    ]);
    res.json({
      success: true,
      message: "Note updated successfully"
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update note"
    });
  }
};

/**
 * Delete a note (Admin only)
 * DELETE /api/notes/:id
 */
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT file_path FROM notes WHERE id = ?", [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    // Delete associated file if exists
    if (existing[0].file_path && fs.existsSync(existing[0].file_path)) {
      fs.unlinkSync(existing[0].file_path);
    }
    await pool.query("DELETE FROM notes WHERE id = ?", [id]);
    res.json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete note"
    });
  }
};
