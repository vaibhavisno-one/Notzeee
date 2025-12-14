# Notzeee Backend Server

Production-grade Express + MongoDB backend for Notzeee notes application.

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Google OAuth authentication
- **JWT** - Session management
- **Security**: Helmet, CORS, Rate Limiting, Mongo Sanitization

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # Google OAuth config
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Note.js            # Note model
│   │   └── Notebook.js        # Notebook model
│   ├── routes/
│   │   ├── auth.routes.js     # Auth endpoints
│   │   ├── note.routes.js     # Note CRUD
│   │   └── notebook.routes.js # Notebook CRUD
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── note.controller.js
│   │   └── notebook.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT verification
│   │   └── error.middleware.js
│   ├── utils/
│   │   └── token.js           # JWT utilities
│   └── app.js                 # Express app
├── server.js                  # Entry point
├── .env                       # Environment variables
└── package.json
```

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/notzeee
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notzeee

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d

# Frontend
CLIENT_URL=http://localhost:3000

# Session
SESSION_SECRET=your_session_secret
```

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/auth/google` | Initiate Google OAuth | Public |
| GET | `/auth/google/callback` | OAuth callback | Public |
| GET | `/auth/me` | Get current user | Private |
| POST | `/auth/logout` | Logout user | Private |

### Notebooks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/notebooks` | Create notebook | Private |
| GET | `/api/notebooks` | Get all notebooks | Private |
| PUT | `/api/notebooks/:id` | Update notebook | Private |
| DELETE | `/api/notebooks/:id` | Delete notebook | Private |

### Notes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/notes` | Create note | Private |
| GET | `/api/notes` | Get all notes | Private |
| GET | `/api/notes/:id` | Get single note | Private |
| PUT | `/api/notes/:id` | Update note | Private |
| DELETE | `/api/notes/:id` | Delete note | Private |

#### Query Parameters for GET /api/notes

- `notebookId` - Filter by notebook
- `isPinned` - Filter pinned notes (true/false)
- `isArchived` - Filter archived notes (true/false)

Example: `/api/notes?notebookId=123&isPinned=true`

## Frontend Integration

### Authentication Flow

```javascript
// 1. Redirect to Google OAuth
window.location.href = 'http://localhost:5000/auth/google';

// 2. After successful auth, user is redirected to CLIENT_URL/dashboard
// with JWT set as HTTP-only cookie

// 3. Check authentication status
const response = await fetch('http://localhost:5000/auth/me', {
  credentials: 'include', // Important: send cookies
});
const { data } = await response.json();
console.log(data); // User object
```

### Making API Calls

```javascript
// Always include credentials: 'include' to send cookies
const response = await fetch('http://localhost:5000/api/notebooks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Send JWT cookie
  body: JSON.stringify({
    name: 'My Notebook',
    color: '#3B82F6',
  }),
});

const { data } = await response.json();
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Send cookies
});

// Create notebook
const { data } = await api.post('/api/notebooks', {
  name: 'My Notebook',
  color: '#3B82F6',
});

// Get notes
const { data } = await api.get('/api/notes?notebookId=123');
```

## Data Models

### User
```javascript
{
  googleId: String,
  email: String,
  name: String,
  avatar: String,
  createdAt: Date
}
```

### Notebook
```javascript
{
  userId: ObjectId,
  name: String,
  color: String,
  createdAt: Date
}
```

### Note
```javascript
{
  userId: ObjectId,
  notebookId: ObjectId,
  title: String,
  content: Object, // Rich text JSON
  pageType: 'default' | 'ruled' | 'grid' | 'dotted',
  pageColor: String,
  margins: 'narrow' | 'normal' | 'wide',
  isPinned: Boolean,
  isArchived: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ HTTP-only cookies for JWT
- ✅ CORS configured for frontend origin
- ✅ Rate limiting on write endpoints (100 req/15min)
- ✅ MongoDB injection prevention
- ✅ Helmet security headers
- ✅ User-scoped queries (no cross-user access)
- ✅ MongoDB ObjectId validation
- ✅ Input sanitization

## Error Handling

All endpoints return consistent error responses:

```javascript
{
  success: false,
  message: "Error description",
  stack: "..." // Only in development
}
```

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/health

# Get current user (after authentication)
curl http://localhost:5000/auth/me \
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Create notebook
curl -X POST http://localhost:5000/api/notebooks \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{"name":"Work Notes","color":"#3B82F6"}'
```

### Using Postman

1. Set request method and URL
2. Go to Headers → Add `Content-Type: application/json`
3. Go to Body → Select `raw` → Enter JSON
4. After authentication, cookies are automatically managed

## Production Deployment

### Environment Variables

Update `.env` for production:
- Set `NODE_ENV=production`
- Use MongoDB Atlas connection string
- Generate secure JWT_SECRET (32+ characters)
- Update `CLIENT_URL` to production frontend URL
- Update Google OAuth callback URL

### Recommended Hosting

- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Database**: MongoDB Atlas (free tier available)

### Production Checklist

- [ ] Set secure JWT_SECRET
- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Update Google OAuth redirect URIs
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Set up monitoring and logging
- [ ] Configure environment variables on hosting platform

## License

ISC
