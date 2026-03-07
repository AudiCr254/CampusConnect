# CampusConnect Backend

Backend API for CampusConnect - Accounting Study Platform

## Features

- **RESTful API** for managing accounting notes and topics
- **File Upload** support for PDF, DOC, DOCX, TXT, PPT, PPTX files
- **MySQL Database** for persistent storage
- **Admin Authentication** via API key
- **Search Functionality** for notes
- **View-Only Mode** for documents (no downloads)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campusconnect_db
PORT=5000
ADMIN_KEY=your_secure_admin_key
FRONTEND_URL=http://localhost:5173
```

### 3. Set Up Database

1. Make sure MySQL is running
2. Create the database using the schema:

```bash
mysql -u root -p < database/schema.sql
```

Or manually run the SQL commands in `database/schema.sql`

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID with notes
- `POST /api/topics` - Create new topic (Admin)
- `PUT /api/topics/:id` - Update topic (Admin)
- `DELETE /api/topics/:id` - Delete topic (Admin)

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `GET /api/notes/search?q=query` - Search notes
- `GET /api/notes/topic/:topicId` - Get notes by topic
- `GET /api/notes/view/:id` - View note file (inline, no download)
- `POST /api/notes` - Upload new note (Admin)
- `PUT /api/notes/:id` - Update note (Admin)
- `DELETE /api/notes/:id` - Delete note (Admin)

## Admin Authentication

Protected routes require the `x-admin-key` header:

```bash
curl -H "x-admin-key: your_admin_key" \
     -F "title=New Note" \
     -F "description=Description" \
     -F "topic_id=1" \
     -F "file=@document.pdf" \
     http://localhost:5000/api/notes
```

## File Upload

Supported file types:
- PDF (.pdf)
- Word Documents (.doc, .docx)
- PowerPoint (.ppt, .pptx)
- Text files (.txt)

Maximum file size: 10MB

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── noteController.js  # Note CRUD operations
│   └── topicController.js # Topic CRUD operations
├── middleware/
│   ├── adminKey.js        # Admin authentication
│   ├── errorHandler.js    # Global error handler
│   └── noDownload.js      # View-only middleware
├── routes/
│   ├── noteRoutes.js      # Note API routes
│   └── topicRoutes.js     # Topic API routes
├── uploads/               # Uploaded files storage
├── database/
│   └── schema.sql         # Database schema
├── .env.example           # Environment variables template
├── app.js                 # Express app configuration
├── package.json           # Dependencies
├── server.js              # Server entry point
└── README.md              # This file
```

## License

MIT License - Developed by Audi Godfrey
