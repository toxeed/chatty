# Examples - API Testing & Code Examples

This folder contains practical examples for testing and using the Supabase integration.

## 📚 Files in This Folder

### SUPABASE_API_EXAMPLES.md
**Purpose**: Practical API testing examples
**Read Time**: 10-15 minutes
**Best For**:
- Testing the API with curl
- JavaScript/Fetch examples
- Postman setup
- Understanding API responses
- Error handling examples

**Contents**:
- Create user examples
- Get user examples (by ID, username, email)
- Update user examples
- Delete user examples
- Error response examples
- JavaScript/Fetch code
- Postman setup guide

## 🎯 Quick Examples

### Create a User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "hashed_password",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get All Users
```bash
curl http://localhost:8080/api/users
```

### Get User by ID
```bash
curl http://localhost:8080/api/users/1
```

### Update User
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Jonathan"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:8080/api/users/1
```

## 🧪 Testing Tools

### Using curl
- Simple command-line testing
- No additional setup required
- See SUPABASE_API_EXAMPLES.md for commands

### Using JavaScript/Fetch
- Browser-based testing
- Integration with frontend
- See SUPABASE_API_EXAMPLES.md for code

### Using Postman
- GUI-based testing
- Save and organize requests
- See SUPABASE_API_EXAMPLES.md for setup

## 📖 Reading Order

1. Start with `../getting-started/SUPABASE_QUICK_START.md`
2. Then read `SUPABASE_API_EXAMPLES.md` to test the API
3. Verify with `../checklists/SUPABASE_CHECKLIST.md`

## 🔗 Related Documents

- **Getting Started**: See `../getting-started/` for setup
- **Guides**: See `../guides/` for detailed information
- **Reference**: See `../reference/` for quick lookups
- **Checklists**: See `../checklists/` for verification

---

**Ready to test? → Open `SUPABASE_API_EXAMPLES.md`**

