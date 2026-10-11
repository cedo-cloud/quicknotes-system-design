# QuickNotes Data Model

## Entities and Relationships
* **users**: The owner of the notes. (1-to-Many with notes)
* **notes**: The core content.
* **tags**: Labels that can be applied to notes.
* **note_tags**: Junction table resolving the Many-to-Many relationship between notes and tags.

## CREATE TABLE Statements

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(20) DEFAULT '#000000'
);

CREATE TABLE note_tags (
    note_id INT REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

```
## Example Queries
- **List all notes for a user:**
  SELECT id, title, body FROM notes WHERE user_id = 1 ORDER BY created_at DESC; 

- **Get all tags for a specific note (JOIN):**
``` SELECT t.name, t.color 
    FROM tags t 
    JOIN note_tags nt ON t.id = nt.tag_id 
    WHERE nt.note_id = 101;
```

- Count notes per user:
 ```SELECT u.username, COUNT(n.id) 
    FROM users u 
    LEFT JOIN notes n ON u.id = n.user_id 
    GROUP BY u.id;
```

## Indexes
```
    CREATE INDEX idx_notes_user_id_created_at ON notes(user_id, created_at DESC);
```
**Reason:** Users frequently request their own notes sorted by recency. This composite index allows the database to filter by user and sort by date without scanning the entire table.

## SQL vs NoSQL Decision
I chose SQL because the data is highly structured and requires strict ACID compliance for user management. The many-to-many relationship between notes and tags is efficiently handled via JOINs in SQL. In NoSQL, we would either have to embed tags (leading to data duplication) or perform complex application-side joins, which hurts read performance at scale.