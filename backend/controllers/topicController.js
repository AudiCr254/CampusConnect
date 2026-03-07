const { pool } = require("../config/db");
const fs = require("fs");
const path = require("path");

/**
 * Get all topics for a specific unit
 * GET /api/units/:unitId/topics
 */
exports.getTopicsByUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const [topics] = await pool.query(`
      SELECT t.*, COUNT(n.id) as note_count
      FROM topics t
      LEFT JOIN notes n ON t.id = n.topic_id
      WHERE t.unit_id = ?
      GROUP BY t.id
      ORDER BY t.name ASC
    `, [unitId]);
    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error("Error fetching topics by unit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch topics"
    });
  }
};

/**
 * Get single topic by ID
 * GET /api/topics/:id
 */
exports.getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const [topics] = await pool.query(`
      SELECT t.*, COUNT(n.id) as note_count
      FROM topics t
      LEFT JOIN notes n ON t.id = n.topic_id
      WHERE t.id = ?
      GROUP BY t.id
    `, [id]);
    if (topics.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Topic not found"
      });
    }

    // Get notes for this topic
    const [notes] = await pool.query(`
      SELECT id, title, description, created_at
      FROM notes
      WHERE topic_id = ?
      ORDER BY created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        ...topics[0],
        notes
      }
    });
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch topic"
    });
  }
};

/**
 * Create a new topic (Admin only)
 * POST /api/topics
 */
exports.createTopic = async (req, res) => {
  try {
    const { name, description, unit_id } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!name || !unit_id) {
      return res.status(400).json({
        success: false,
        message: "Topic name and unit_id are required"
      });
    }

    const [result] = await pool.query(`
      INSERT INTO topics (name, description, unit_id, file_path, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [name, description || null, unit_id, filePath]);

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: {
        id: result.insertId,
        name,
        description,
        unit_id,
        file_path: filePath
      }
    });
  } catch (error) {
    console.error("Error creating topic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create topic"
    });
  }
};

/**
 * Update a topic (Admin only)
 * PUT /api/topics/:id
 */
exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, unit_id } = req.body;
    const [existing] = await pool.query("SELECT * FROM topics WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Topic not found"
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

    await pool.query(
      `
      UPDATE topics 
      SET name = ?, description = ?, unit_id = ?, file_path = ?
      WHERE id = ?
    `, [
        name || existing[0].name,
        description !== undefined ? description : existing[0].description,
        unit_id || existing[0].unit_id,
        filePath,
        id
      ]
    );

    res.json({
      success: true,
      message: "Topic updated successfully"
    });
  } catch (error) {
    console.error("Error updating topic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update topic"
    });
  }
};

/**
 * Delete a topic (Admin only)
 * DELETE /api/topics/:id
 */
exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT file_path FROM topics WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Topic not found"
      });
    }

    // Delete associated file if exists
    if (existing[0].file_path && fs.existsSync(existing[0].file_path)) {
      fs.unlinkSync(existing[0].file_path);
    }

    await pool.query("DELETE FROM topics WHERE id = ?", [id]);
    res.json({
      success: true,
      message: "Topic deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete topic"
    });
  }
};
