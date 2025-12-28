# Supabase Quick Reference Card

## 🚀 Start Backend (3 Commands)

```bash
# 1. Set environment variables
export SPRING_PROFILES_ACTIVE=supabase
export SUPABASE_HOST=your-project.supabase.co
export SUPABASE_PORT=5432
export SUPABASE_DB=postgres
export SUPABASE_USER=postgres
export SUPABASE_PASSWORD=your-password

# 2. Navigate to backend
cd backend/chatty-backend

# 3. Run
mvn spring-boot:run
```

## 🐳 Start with Docker

```bash
# Edit docker-compose.yml with your credentials, then:
docker-compose up --build
```

## 🧪 Test API

```bash
# Create user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass","firstName":"Test","lastName":"User"}'

# Get all users
curl http://localhost:8080/api/users

# Get user by ID
curl http://localhost:8080/api/users/1

# Get by username
curl http://localhost:8080/api/users/username/test

# Get by email
curl http://localhost:8080/api/users/email/test@example.com

# Update user
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Updated"}'

# Delete user
curl -X DELETE http://localhost:8080/api/users/1
```

## 📚 Documentation Files

| File | Purpose | Time |
|------|---------|------|
| SUPABASE_INDEX.md | Start here | 2 min |
| SUPABASE_README.md | Overview | 5 min |
| SUPABASE_QUICK_START.md | Setup | 10 min |
| SUPABASE_API_EXAMPLES.md | Testing | 5 min |
| SUPABASE_SETUP.md | Detailed | 15 min |

## 🔧 Configuration Files

**Main Config**: `application.properties`
- Uses environment variables
- Defaults to H2 database

**Supabase Config**: `application-supabase.properties`
- PostgreSQL-specific settings
- Connection pooling
- Performance tuning

## 📝 Code Files

**Entity**: `User.java`
- Fields: id, username, email, password, firstName, lastName, createdAt, updatedAt
- Auto-timestamps with @PrePersist/@PreUpdate

**Repository**: `UserRepository.java`
- Methods: findByUsername, findByEmail, existsByUsername, existsByEmail

**Controller**: `UserController.java`
- Endpoints: GET, POST, PUT, DELETE
- Error handling: 404, 409 Conflict

## 🔑 Environment Variables

```
SPRING_PROFILES_ACTIVE=supabase
SUPABASE_HOST=your-project.supabase.co
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-password
```

## ✅ Verify Connection

Look for in logs:
```
HikariPool-1 - Starting...
HikariPool-1 - Pool initialized with X connections
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check host/port, verify IP whitelist |
| Auth failed | Verify username/password |
| SSL errors | PostgreSQL driver handles automatically |
| Port 8080 in use | `lsof -i :8080` then `kill -9 <PID>` |

## 📊 API Response Examples

**Create User (201)**
```json
{
  "id": 1,
  "username": "test",
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

**Not Found (404)**
```
404 Not Found
```

**Conflict (409)**
```
409 Conflict
```

## 🎯 Next Steps

1. Test with sample data
2. Create Message entity
3. Create Room entity
4. Add authentication
5. Deploy to production

## 📞 Resources

- Supabase: https://supabase.com/docs
- Spring Boot: https://spring.io/projects/spring-boot
- PostgreSQL: https://www.postgresql.org/docs/

---

**Print this card for quick reference!**

