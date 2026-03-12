# Link Vault API Server

RESTful API backend for the Link Vault application built with Express.js and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory (copy from `.env.example`):

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/linksave
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Environment Variables:**

- `MONGODB_URI`: MongoDB connection string (supports local MongoDB or MongoDB Atlas)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment type (development/production)
- `CLIENT_URL`: Frontend URL for CORS (default: http://localhost:3000)

### 3. MongoDB Setup

**Option A: Local MongoDB**

```bash
# Make sure MongoDB is running on your system
# Default: mongodb://localhost:27017/linksave
```

**Option B: MongoDB Atlas (Cloud)**

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/linksave?retryWrites=true&w=majority
```

Use your actual Atlas cluster hostname. The placeholder `cluster.mongodb.net` value is only an example and will fail DNS lookup in deployment.

### 4. Start the Server

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Before deploying, set `MONGODB_URI` in your hosting provider to a real MongoDB connection string. In production the server will stop immediately if `MONGODB_URI` is missing or still uses the placeholder example value.

The API will be accessible at `http://localhost:5000`

## API Endpoints

### 1. Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running"
}
```

### 2. Create a Link

```http
POST /api/links
Content-Type: application/json

{
  "url": "https://example.com",
  "description": "Example website"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "url": "https://example.com",
    "description": "Example website",
    "createdAt": "2024-03-12T10:30:00.000Z"
  },
  "message": "Link saved successfully"
}
```

### 3. Get All Links (with optional search)

```http
GET /api/links
GET /api/links?search=example
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "url": "https://example.com",
      "description": "Example website",
      "createdAt": "2024-03-12T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Query Parameters:**

- `search` (optional): Search term to filter by description or URL (case-insensitive)

### 4. Delete a Link

```http
DELETE /api/links/:id
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "url": "https://example.com",
    "description": "Example website",
    "createdAt": "2024-03-12T10:30:00.000Z"
  },
  "message": "Link deleted successfully"
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Link not found"
}
```

## Project Structure

```
server/
├── server.js           # Main Express application
├── package.json        # Project dependencies
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── models/
│   └── Link.js        # Mongoose Link model
└── routes/
    └── links.js       # API route handlers
```

## Error Handling

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful GET, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Missing or invalid parameters
- `404 Not Found`: Link not found
- `500 Internal Server Error`: Server error

## Testing with cURL

```bash
# Create a link
curl -X POST http://localhost:5000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "description": "Test link"}'

# Get all links
curl http://localhost:5000/api/links

# Search links
curl "http://localhost:5000/api/links?search=example"

# Delete a link
curl -X DELETE http://localhost:5000/api/links/507f1f77bcf86cd799439011
```

## Frontend Integration

Make sure your Next.js frontend is configured with the correct API base URL:

```typescript
// Example: In your frontend API utility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

fetch(`${API_BASE_URL}/api/links`, ...)
```

## Dependencies

- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **cors**: Enable cross-origin requests
- **dotenv**: Load environment variables
- **nodemon**: Auto-restart server during development (dev only)

## License

ISC
