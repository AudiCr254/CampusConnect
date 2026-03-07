const { pool } = require("../config/db");
const fs = require("fs");
const path = require("path");

/**
 * Get all units
 * GET /api/units
 */
exports.getAllUnits = async (req, res) => {
  try {
    const [units] = await pool.query(`
      SELECT u.*, COUNT(t.id) as topic_count
      FROM units u
      LEFT JOIN topics t ON u.id = t.unit_id
      GROUP BY u.id
      ORDER BY u.name ASC
    `);
    res.json({
      success: true,
      count: units.length,
      data: units
    });
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch units"
    });
  }
};

/**
 * Get unit by ID with its topics
 * GET /api/units/:id
 */
exports.getUnitById = async (req, res) => {
  try {
    const { id } = req.params;

    const [units] = await pool.query(`
      SELECT u.*, COUNT(t.id) as topic_count
      FROM units u
      LEFT JOIN topics t ON u.id = t.unit_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [id]);
    if (units.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
      });
    }

    // Get topics for this unit
    const [topics] = await pool.query(`
      SELECT id, name, description, file_path, created_at
      FROM topics
      WHERE unit_id = ?
      ORDER BY created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        ...units[0],
        topics
      }
    });
  } catch (error) {
    console.error("Error fetching unit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unit"
    });
  }
};

/**
 * Create a new unit (Admin only)
 * POST /api/units
 */
exports.createUnit = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Unit name is required"
      });
    }

    const [result] = await pool.query(`
      INSERT INTO units (name, description, color, icon, file_path, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [name, description || null, color || "#3b82f6", icon || "BookOpen", filePath]);

    res.status(201).json({
      success: true,
      message: "Unit created successfully",
      data: {
        id: result.insertId,
        name,
        description,
        color,
        icon,
        file_path: filePath
      }
    });
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create unit"
    });
  }
};

/**
 * Update a unit (Admin only)
 * PUT /api/units/:id
 */
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon } = req.body;
    const [existing] = await pool.query("SELECT * FROM units WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
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
      UPDATE units 
      SET name = ?, description = ?, color = ?, icon = ?, file_path = ?
      WHERE id = ?
    `, [
        name || existing[0].name,
        description !== undefined ? description : existing[0].description,
        color || existing[0].color,
        icon || existing[0].icon,
        filePath,
        id
      ]
    );

    res.json({
      success: true,
      message: "Unit updated successfully"
    });
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update unit"
    });
  }
};

/**
 * Delete a unit (Admin only)
 * DELETE /api/units/:id
 */
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query("SELECT file_path FROM units WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
      });
    }

    // Delete associated file if exists
    if (existing[0].file_path && fs.existsSync(existing[0].file_path)) {
      fs.unlinkSync(existing[0].file_path);
    }

    await pool.query("DELETE FROM units WHERE id = ?", [id]);
    res.json({
      success: true,
      message: "Unit deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete unit"
    });
  }
};
