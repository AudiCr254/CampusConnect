# CampusConnect - Full Stack Application

A comprehensive accounting study platform for students with a React frontend and Express.js backend.

## Project Structure

```
campusconnect/
├── app/                    # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── sections/       # Page sections
│   │   ├── services/       # API services
│   │   └── data/           # Static data fallback
│   ├── public/images/      # Static images
│   └── dist/               # Production build
├── backend/                # Express.js Backend
│   ├── config/             # Database config
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads
│   └── database/           # SQL schema
└── package.json            # Root package.json
```

## Features

### Frontend
- Modern React + TypeScript + Vite
- Responsive design with Tailwind CSS
- shadcn/ui components
- React Router for navigation
- Search functionality
- AI-powered study assistant

### Backend
- Express.js REST API
- MySQL database
- File upload support (PDF, DOC, DOCX, PPT, PPTX, TXT)
- Admin authentication
- View-only document access (no downloads)
- Search functionality

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### 1. Install All Dependencies

```bash
npm run install:all
```

Or manually:
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd app && npm install
```

### 2. Set Up Database

1. Create a MySQL database:
```bash
mysql -u root -p
```

2. Run the schema:
```bash
npm run setup:db
```

Or manually:
```sql
CREATE DATABASE campusconnect_db;
USE campusconnect_db;
-- Run backend/database/schema.sql
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campusconnect_db
PORT=5000
ADMIN_KEY=your_secure_admin_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`app/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Servers

```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### 5. Build for Production

```bash
npm run build
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
- `GET /api/notes/view/:id` - View note file (inline)
- `POST /api/notes` - Upload new note (Admin)
- `PUT /api/notes/:id` - Update note (Admin)
- `DELETE /api/notes/:id` - Delete note (Admin)

## Admin Operations

Upload a note (requires admin key):

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "x-admin-key: your_admin_key" \
  -F "title=Accounting Basics" \
  -F "description=Introduction to accounting" \
  -F "topic_id=1" \
  -F "file=@document.pdf"
```

## Deployment

### Frontend
The frontend is a static build in `app/dist/`. Deploy to any static hosting service.

### Backend
The backend requires:
- Node.js runtime
- MySQL database
- File storage for uploads

Set environment variables for production:
```env
NODE_ENV=production
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=campusconnect_db
PORT=5000
ADMIN_KEY=your_secure_admin_key
FRONTEND_URL=https://yourdomain.com
```

## License

MIT License - Developed by Audi Godfrey
\n\n---\n*Last updated: Sun Mar  8 06:11:44 EDT 2026*
