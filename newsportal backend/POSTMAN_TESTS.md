# Postman API Testing Guide

Complete guide to test all News Portal API endpoints using Postman.

## Base URL
```
http://localhost:3000
```

---

## 1. Homepage / Welcome

**Endpoint:** `GET /`

**Method:** GET

**Response:**
```json
{
  "message": "Welcome to News Portal API",
  "status": "running",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "users": "GET /users",
    "news": "GET /news",
    "singleNews": "GET /news/:id",
    "createNews": "POST /news",
    "updateNews": "PATCH /news/:id",
    "deleteNews": "DELETE /news/:id"
  }
}
```

---

## 2. Health Check

**Endpoint:** `GET /health`

**Method:** GET

**Response:**
```json
{
  "status": "OK",
  "message": "News Portal API is running"
}
```

---

## 3. Get All Users

**Endpoint:** `GET /users`

**Method:** GET

**Response:**
```json
[
  {
    "id": 1,
    "name": "Alice Rahman",
    "email": "alice@example.com"
  },
  {
    "id": 2,
    "name": "Karim Hossain",
    "email": "karim@example.com"
  },
  {
    "id": 3,
    "name": "Nusrat Jahan",
    "email": "nusrat@example.com"
  }
]
```

---

## 4. Get Single User

**Endpoint:** `GET /users/:id`

**Method:** GET

**Example:** `GET /users/1`

**Response:**
```json
{
  "id": 1,
  "name": "Alice Rahman",
  "email": "alice@example.com"
}
```

**Error Case (User Not Found):**
```
GET /users/999
```
Response:
```json
{
  "error": "User not found"
}
```

---

## 5. Get All News

**Endpoint:** `GET /news`

**Method:** GET

**Optional Query Parameters:**
- `title` - Search by title (case-insensitive)
- `_page` - Page number (default: 1)
- `_limit` - Items per page (default: 10)

**Examples:**

Basic request:
```
GET /news
```

With search:
```
GET /news?title=tech
```

With pagination:
```
GET /news?_page=1&_limit=5
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Govt Announces New Tech Park",
    "body": "A new state-of-the-art tech park will be established in Dhaka to boost the IT sector...",
    "author_id": 1,
    "comments": [
      {
        "id": 1,
        "text": "Great initiative!",
        "user_id": 2,
        "timestamp": "2025-12-04T10:30:00Z"
      },
      {
        "id": 2,
        "text": "Hope this brings more jobs.",
        "user_id": 3,
        "timestamp": "2025-12-04T11:00:00Z"
      }
    ]
  },
  {
    "id": 2,
    "title": "Local Startup Wins Innovation Award",
    "body": "A Dhaka-based startup has won an international innovation award for AI-driven solutions...",
    "author_id": 2,
    "comments": []
  }
]
```

**Response Headers:**
- `X-Total-Count` - Total number of items
- `X-Page` - Current page
- `X-Per-Page` - Items per page

---

## 6. Get Single News

**Endpoint:** `GET /news/:id`

**Method:** GET

**Example:** `GET /news/1`

**Response:**
```json
{
  "id": 1,
  "title": "Govt Announces New Tech Park",
  "body": "A new state-of-the-art tech park will be established in Dhaka to boost the IT sector...",
  "author_id": 1,
  "comments": [
    {
      "id": 1,
      "text": "Great initiative!",
      "user_id": 2,
      "timestamp": "2025-12-04T10:30:00Z"
    },
    {
      "id": 2,
      "text": "Hope this brings more jobs.",
      "user_id": 3,
      "timestamp": "2025-12-04T11:00:00Z"
    }
  ]
}
```

**Error Case:**
```
GET /news/999
```
Response:
```json
{
  "error": "News not found"
}
```

---

## 7. Create News Article

**Endpoint:** `POST /news`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Breaking: New Technology Innovation",
  "body": "This is a detailed news article about the latest technology innovation that will change the industry.",
  "author_id": 1
}
```

**Success Response (201):**
```json
{
  "id": 3,
  "title": "Breaking: New Technology Innovation",
  "body": "This is a detailed news article about the latest technology innovation that will change the industry.",
  "author_id": 1,
  "comments": []
}
```

**Validation Errors:**

Empty title:
```json
{
  "title": "",
  "body": "Some content here that is long enough",
  "author_id": 1
}
```
Response (400):
```json
{
  "error": "News title cannot be empty"
}
```

Body too short:
```json
{
  "title": "Test",
  "body": "Short text",
  "author_id": 1
}
```
Response (400):
```json
{
  "error": "News body must be at least 20 characters"
}
```

Invalid author:
```json
{
  "title": "Test Article",
  "body": "This is a test article with enough content.",
  "author_id": 999
}
```
Response (404):
```json
{
  "error": "Author not found"
}
```

---

## 8. Update News Article (Edit)

**Endpoint:** `PATCH /news/:id`

**Method:** PATCH

**Headers:**
```
Content-Type: application/json
```

**Example:** `PATCH /news/1`

**Body (JSON):**
```json
{
  "title": "Updated: Govt Announces New Tech Park",
  "body": "An updated version of the news article with more details about the tech park announcement.",
  "author_id": 1
}
```

**Success Response:**
```json
{
  "id": 1,
  "title": "Updated: Govt Announces New Tech Park",
  "body": "An updated version of the news article with more details about the tech park announcement.",
  "author_id": 1,
  "comments": [
    {
      "id": 1,
      "text": "Great initiative!",
      "user_id": 2,
      "timestamp": "2025-12-04T10:30:00Z"
    }
  ]
}
```

**Error Case (Wrong Author):**
```json
{
  "title": "Trying to edit",
  "author_id": 2
}
```
Response (403):
```json
{
  "error": "You can only edit your own news"
}
```

---

## 9. Add Comment to News

**Endpoint:** `PATCH /news/:id`

**Method:** PATCH

**Headers:**
```
Content-Type: application/json
```

**Example:** `PATCH /news/1`

**Body (JSON):**
```json
{
  "comments": [
    {
      "id": 1,
      "text": "Great initiative!",
      "user_id": 2,
      "timestamp": "2025-12-04T10:30:00Z"
    },
    {
      "id": 2,
      "text": "Hope this brings more jobs.",
      "user_id": 3,
      "timestamp": "2025-12-04T11:00:00Z"
    },
    {
      "text": "This is my new comment on this news article.",
      "user_id": 1
    }
  ]
}
```

**Success Response:**
```json
{
  "id": 1,
  "title": "Govt Announces New Tech Park",
  "body": "A new state-of-the-art tech park will be established in Dhaka to boost the IT sector...",
  "author_id": 1,
  "comments": [
    {
      "id": 1,
      "text": "Great initiative!",
      "user_id": 2,
      "timestamp": "2025-12-04T10:30:00Z"
    },
    {
      "id": 2,
      "text": "Hope this brings more jobs.",
      "user_id": 3,
      "timestamp": "2025-12-04T11:00:00Z"
    },
    {
      "id": 3,
      "text": "This is my new comment on this news article.",
      "user_id": 1,
      "timestamp": "2025-12-07T12:34:56.789Z"
    }
  ]
}
```

**Note:** The system automatically adds `id` and `timestamp` to new comments.

**Error Case (Empty Comment):**
```json
{
  "comments": [
    {
      "text": "",
      "user_id": 1
    }
  ]
}
```
Response (400):
```json
{
  "error": "Comment text cannot be empty"
}
```

---

## 10. Delete News Article

**Endpoint:** `DELETE /news/:id?author_id={id}`

**Method:** DELETE

**Example:** `DELETE /news/3?author_id=1`

**Success Response (204):**
No content (empty response)

**Error Case (Wrong Author):**
```
DELETE /news/1?author_id=2
```
Response (403):
```json
{
  "error": "You can only delete your own news"
}
```

**Error Case (News Not Found):**
```
DELETE /news/999?author_id=1
```
Response (404):
```json
{
  "error": "News not found"
}
```

---

## 11. Get Comments Count

**Endpoint:** `GET /news/:id/comments-count`

**Method:** GET

**Example:** `GET /news/1/comments-count`

**Response:**
```json
{
  "count": 2
}
```

**Error Case:**
```
GET /news/999/comments-count
```
Response (404):
```json
{
  "error": "News not found"
}
```

---

## Testing Flow Suggestions

### Complete Testing Sequence:

1. **Check API Status**
   - `GET /` - Welcome page
   - `GET /health` - Health check

2. **View Existing Data**
   - `GET /users` - See all users
   - `GET /news` - See all news

3. **Create New Article**
   - `POST /news` - Create with author_id=1

4. **Read Single Article**
   - `GET /news/{new_id}` - Get the article you just created

5. **Update Article**
   - `PATCH /news/{new_id}` - Edit title/body with correct author_id

6. **Add Comment**
   - `PATCH /news/{new_id}` - Add a comment to the article

7. **Check Comment Count**
   - `GET /news/{new_id}/comments-count` - Verify comment was added

8. **Search & Filter**
   - `GET /news?title=tech` - Search by title
   - `GET /news?_page=1&_limit=2` - Test pagination

9. **Delete Article**
   - `DELETE /news/{new_id}?author_id=1` - Delete with correct author

10. **Test Error Cases**
    - Try creating with empty title
    - Try editing someone else's article
    - Try accessing non-existent IDs

---

## Postman Collection Import

You can create a Postman collection with all these requests. Here's how:

1. Open Postman
2. Click "New" → "Collection"
3. Name it "News Portal API"
4. Add requests for each endpoint above
5. Set the base URL as a collection variable: `{{baseUrl}}` = `http://localhost:3000`

---

## Expected Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PATCH requests |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Validation errors |
| 403 | Forbidden | Author verification failed |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## Tips for Testing

- Always check response status codes
- Verify response headers for pagination endpoints
- Test both success and error cases
- Keep track of IDs created during testing
- Test with valid and invalid author_ids
- Test edge cases (empty strings, very long text, special characters)
- Verify timestamps are automatically generated for comments
- Check that auto-increment IDs work correctly

---

**API Version:** 1.0.0  
**Last Updated:** December 7, 2025
