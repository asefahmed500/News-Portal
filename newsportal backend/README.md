# News Portal API

A RESTful API for managing news articles and user interactions built with Node.js and Express.

## Features

- ✅ Complete CRUD operations for news articles
- ✅ User management endpoints
- ✅ Comment system for news articles
- ✅ Search and pagination support
- ✅ Input validation and error handling
- ✅ Author verification for edit/delete operations
- ✅ CORS enabled for cross-origin requests

## Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

## Running the Server

**Start the server:**
```bash
npm start
```

**Development mode (with auto-restart):**
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health` - Check if API is running

### Users

- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get a specific user

### News Articles

#### Get News
- **GET** `/news` - Get all news articles
  - Query Parameters:
    - `title` - Search by title (case-insensitive)
    - `_page` - Page number (default: 1)
    - `_limit` - Items per page (default: 10)
  - Response Headers:
    - `X-Total-Count` - Total number of items
    - `X-Page` - Current page
    - `X-Per-Page` - Items per page

- **GET** `/news/:id` - Get a single news article with comments

#### Create News
- **POST** `/news` - Create a new news article
  - Request Body:
    ```json
    {
      "title": "Article Title",
      "body": "Article content (min 20 characters)",
      "author_id": 1
    }
    ```
  - Validations:
    - Title cannot be empty
    - Body must be at least 20 characters
    - Author must exist

#### Update News
- **PATCH** `/news/:id` - Update news article or add comments
  - Edit article (author verification required):
    ```json
    {
      "title": "Updated Title",
      "body": "Updated content",
      "author_id": 1
    }
    ```
  - Add comment:
    ```json
    {
      "comments": [
        ...existing_comments,
        {
          "text": "New comment",
          "user_id": 2
        }
      ]
    }
    ```

#### Delete News
- **DELETE** `/news/:id?author_id=1` - Delete a news article
  - Query Parameter: `author_id` - For author verification

### Utility

- **GET** `/news/:id/comments-count` - Get comment count for a news article

## Example Usage

### Using PowerShell

**Get all news:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/news | Select-Object -ExpandProperty Content
```

**Create a news article:**
```powershell
$body = @{
    title = "Breaking News"
    body = "This is a very important news article with sufficient content."
    author_id = 1
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/news -Method POST -Body $body -ContentType "application/json"
```

**Search news:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/news?title=tech" | Select-Object -ExpandProperty Content
```

**Add a comment:**
```powershell
$body = @{
    comments = @(
        @{ id = 1; text = "Great initiative!"; user_id = 2; timestamp = "2025-12-04T10:30:00Z" },
        @{ text = "New comment here"; user_id = 3 }
    )
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri http://localhost:3000/news/1 -Method PATCH -Body $body -ContentType "application/json"
```

### Using curl (if installed)

**Get all users:**
```bash
curl http://localhost:3000/users
```

**Create news:**
```bash
curl -X POST http://localhost:3000/news \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"News Title\",\"body\":\"News body with at least 20 characters\",\"author_id\":1}"
```

## Testing

Run the included test script to verify all endpoints:
```powershell
.\test-api.ps1
```

## Database

The API uses a JSON file-based database located at `data/db.json`. The database includes:
- **users**: List of users with id, name, and email
- **news**: News articles with id, title, body, author_id, and comments array

### Sample Data Structure

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice Rahman",
      "email": "alice@example.com"
    }
  ],
  "news": [
    {
      "id": 1,
      "title": "Article Title",
      "body": "Article content...",
      "author_id": 1,
      "comments": [
        {
          "id": 1,
          "text": "Comment text",
          "user_id": 2,
          "timestamp": "2025-12-04T10:30:00Z"
        }
      ]
    }
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation errors)
- `403` - Forbidden (unauthorized action)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a JSON object with an `error` field:
```json
{
  "error": "Error message description"
}
```

## Project Structure

```
newsportal/
├── data/
│   └── db.json          # JSON database
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── test-api.ps1         # API test script
└── README.md            # Documentation
```

## Dependencies

- **express** (^4.18.2) - Web framework
- **cors** (^2.8.5) - CORS middleware
- **nodemon** (^3.0.2) - Development auto-restart (dev dependency)

## Features & Validations

### News Article Validation
- Title: Cannot be empty
- Body: Minimum 20 characters
- Author: Must exist in users table

### Comment Validation
- Text: Cannot be empty
- Automatically adds:
  - Comment ID (auto-increment)
  - Timestamp (ISO format)

### Author Verification
- Only the original author can edit or delete their news articles
- Pass `author_id` in request body (PATCH) or query parameter (DELETE)

## License

ISC

## Author

News Portal API v1.0.0
