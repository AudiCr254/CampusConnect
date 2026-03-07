const { pool } = require('../config/db');

/**
 * Get all topics
 * GET /api/topics
 */
exports.getAllTopics = async (req, res) => {
  try {
    const [topics] = await pool.query(`
      SELECT t.*, COUNT(n.id) as note_count
      FROM topics t
      LEFT JOIN notes n ON t.id = n.topic_id
      GROUP BY t.id
      ORDER BY t.name ASC
    `);

    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics'
    });
  }
};

/**
 * Get topic by ID with its notes
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
        message: 'Topic not found'
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
    console.error('Error fetching topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic'
    });
  }
};

/**
 * Create a new topic (Admin only)
 * POST /api/topics
 */
exports.createTopic = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Topic name is required'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO topics (name, description, color, icon, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [name, description || null, color || '#3b82f6', icon || 'BookOpen']);

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: {
        id: result.insertId,
        name,
        description,
        color,
        icon
      }
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create topic'
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
    const { name, description, color, icon } = req.body;

    const [existing] = await pool.query('SELECT * FROM topics WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    await pool.query(`
      UPDATE topics 
      SET name = ?, description = ?, color = ?, icon = ?
      WHERE id = ?
    `, [
      name || existing[0].name,
      description !== undefined ? description : existing[0].description,
      color || existing[0].color,
      icon || existing[0].icon,
      id
    ]);

    res.json({
      success: true,
      message: 'Topic updated successfully'
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update topic'
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

    const [existing] = await pool.query('SELECT * FROM topics WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    await pool.query('DELETE FROM topics WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Topic deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete topic'
    });
  }
};
