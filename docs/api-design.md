# QuickNotes API Design

## REST Endpoints

| Method | Path | Description | Success Status |
|--------|------|-------------|----------------|
| GET | `/api/v1/users/:userId/notes` | Retrieve paginated notes for a user | 200 OK |
| POST | `/api/v1/users/:userId/notes` | Create a new note | 201 Created |
| GET | `/api/v1/notes/:id` | Retrieve a specific note | 200 OK |
| PUT | `/api/v1/notes/:id` | Replace an existing note | 200 OK |
| PATCH | `/api/v1/notes/:id` | Partially update a note | 200 OK |
| DELETE | `/api/v1/notes/:id` | Delete a specific note | 204 No Content |

## Request & Response Examples

### Creating a Note (POST)
**Request:**
```json
POST /api/v1/users/1/notes
{
  "title": "Grocery List",
  "body": "Milk, Eggs, Bread"
}
```
**Response:**
```json
HTTP/1.1 201 Created
{
  "id": 101,
  "userId": 1,
  "title": "Grocery List",
  "body": "Milk, Eggs, Bread",
  "createdAt": "2023-10-27T10:00:00Z"
}
```

## Listing Notes (GET)
**Request:**
```json
GET /api/v1/users/1/notes?limit=10
```
**Response:**
```json
HTTP/1.1 200 OK
{
  "data": [
    { "id": 101, "title": "Grocery List", "body": "Milk, Eggs, Bread" }
  ],
  "pagination": { "total": 1, "limit": 10 }
}
```

## Error Codes

| Code | Description | Example Error Body |
| :--- | :--- | :--- |
| **400** | Bad Request (Validation) | `{ "error": "VALIDATION_ERROR", "message": "Title is required." }` |
| **401** | Unauthorized | `{ "error": "UNAUTHORIZED", "message": "Invalid token." }` |
| **403** | Forbidden | `{ "error": "FORBIDDEN", "message": "Access denied." }` |
| **404** | Not Found | `{ "error": "NOT_FOUND", "message": "Note ID 999 not found." }` |
| **500** | Internal Server Error | `{ "error": "SERVER_ERROR", "message": "Database timeout." }` |