# Supabase API Examples

## Testing the User API

### 1. Create a New User

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "hashed_password_123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password_123",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### 2. Get All Users

```bash
curl http://localhost:8080/api/users
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    ...
  }
]
```

### 3. Get User by ID

```bash
curl http://localhost:8080/api/users/1
```

### 4. Get User by Username

```bash
curl http://localhost:8080/api/users/username/john_doe
```

### 5. Get User by Email

```bash
curl http://localhost:8080/api/users/email/john@example.com
```

### 6. Update User

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "lastName": "Smith"
  }'
```

### 7. Delete User

```bash
curl -X DELETE http://localhost:8080/api/users/1
```

**Response (204 No Content)** - No body returned

## Error Responses

### User Not Found (404)
```bash
curl http://localhost:8080/api/users/999
```

**Response:**
```
404 Not Found
```

### Duplicate Username/Email (409)
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "duplicate@example.com",
    "password": "password"
  }'
```

**Response (409 Conflict):**
```
409 Conflict
```

## Using with Postman

1. Import these requests into Postman
2. Set base URL: `http://localhost:8080`
3. Create a collection for User API endpoints
4. Test each endpoint with sample data

## Using with JavaScript/Fetch

```javascript
// Create user
const response = await fetch('http://localhost:8080/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'jane_doe',
    email: 'jane@example.com',
    password: 'hashed_password',
    firstName: 'Jane',
    lastName: 'Doe'
  })
});

const user = await response.json();
console.log('Created user:', user);

// Get user
const getResponse = await fetch(`http://localhost:8080/api/users/${user.id}`);
const userData = await getResponse.json();
console.log('User data:', userData);
```

## Verify Database Connection

Check backend logs for successful connection:
```
HikariPool-1 - Starting...
HikariPool-1 - Pool initialized with 5 connections
```

If you see connection errors, verify your Supabase credentials in environment variables.

