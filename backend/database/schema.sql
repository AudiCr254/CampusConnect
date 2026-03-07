-- CampusConnect Database Schema
-- Run this SQL to set up the database

-- Create database
CREATE DATABASE IF NOT EXISTS campusconnect_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campusconnect_db;

-- Units table (formerly topics)
CREATE TABLE IF NOT EXISTS units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3b82f6',
  icon VARCHAR(50) DEFAULT 'BookOpen',
  file_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Topics table (new, child of units)
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  unit_id INT NOT NULL,
  file_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content LONGTEXT,
  topic_id INT,
  file_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
);

-- Insert default units (formerly topics)
INSERT INTO units (name, description, color, icon) VALUES
('Introduction to Accounting', 'Learn the fundamentals of accounting, its nature, purpose, and the accounting equation.', '#3b82f6', 'BookOpen'),
('Recording Transactions', 'Master source documents, journals, and the recording process.', '#10b981', 'FileText'),
('Financial Statements', 'Understand income statements, balance sheets, and cash flow statements.', '#8b5cf6', 'BarChart3'),
('Assets & Liabilities', 'Learn about depreciation, property, plant, equipment, and liability management.', '#f97316', 'Building2'),
('Partnership Accounts', 'Study partnership agreements, profit sharing, and partnership financial statements.', '#ec4899', 'Users'),
('Company Accounts', 'Explore share capital, company financial statements, and corporate accounting.', '#6366f1', 'Building'),
('Manufacturing Accounts', 'Learn cost classification, manufacturing accounts, and production costing.', '#14b8a6', 'Factory'),
('Non-Profit Organizations', 'Understand receipts and payments accounts, income and expenditure accounts.', '#ef4444', 'Heart'),
('Correction of Errors', 'Master suspense accounts and different types of accounting errors.', '#eab308', 'AlertCircle');

-- Create indexes for better performance
CREATE INDEX idx_notes_topic_id ON notes(topic_id);
CREATE INDEX idx_notes_title ON notes(title);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_topics_unit_id ON topics(unit_id);
