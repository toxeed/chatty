# Supabase PostgreSQL Integration for Chatty Backend

## 🎯 Overview

The Chatty backend has been fully integrated with PostgreSQL/Supabase support. The application now supports:
- **H2 Database** (default, in-memory for development)
- **PostgreSQL** (via Supabase or any PostgreSQL instance)

## 📦 What's Included

### Dependencies
- PostgreSQL JDBC Driver (org.postgresql:postgresql)

### Configuration
- `application.properties` - Main config with environment variable support
- `application-supabase.properties` - Supabase-specific Spring profile

### Code
- `User.java` - JPA entity with automatic timestamp management
- `UserRepository.java` - Spring Data JPA repository with custom queries
- `UserController.java` - REST API with full CRUD operations

### Documentation
- `SUPABASE_SETUP.md` - Detailed setup guide
- `SUPABASE_QUICK_START.md` - Quick reference
- `SUPABASE_API_EXAMPLES.md` - API testing examples
- `SUPABASE_CHECKLIST.md` - Implementation checklist
- `SUPABASE_INTEGRATION_SUMMARY.md` - Complete technical overview

## 🚀 Quick Start

### 1. Get Supabase Credentials
From your Supabase project dashboard (Settings → Database):
```
Host: your-project.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: your-password
```

### 2. Run Backend
```bash
cd backend/chatty-backend

export SPRING_PROFILES_ACTIVE=supabase
export SUPABASE_HOST=your-project.supabase.co
export SUPABASE_PORT=5432
export SUPABASE_DB=postgres
export SUPABASE_USER=postgres
export SUPABASE_PASSWORD=your-password

mvn spring-boot:run
```

### 3. Test Connection
```bash
# Health check
curl http://localhost:8080/api/health

# Create user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "hashed_password",
    "firstName": "Test",
    "lastName": "User"
  }'

# Get user
curl http://localhost:8080/api/users/1
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| GET | /api/users/{id} | Get user by ID |
| GET | /api/users/username/{username} | Get user by username |
| GET | /api/users/email/{email} | Get user by email |
| POST | /api/users | Create new user |
| PUT | /api/users/{id} | Update user |
| DELETE | /api/users/{id} | Delete user |

## 🔧 Configuration Options

### Environment Variables
```bash
SPRING_PROFILES_ACTIVE=supabase
SUPABASE_HOST=your-project.supabase.co
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-password
```

### Docker Compose
Edit `docker-compose.yml` and set environment variables in the backend service.

### Direct File Edit
Edit `application-supabase.properties` with your credentials.

## 📚 Documentation Files

- **SUPABASE_SETUP.md** - Comprehensive setup guide with troubleshooting
- **SUPABASE_QUICK_START.md** - Quick reference for getting started
- **SUPABASE_API_EXAMPLES.md** - curl and JavaScript examples
- **SUPABASE_CHECKLIST.md** - Step-by-step implementation checklist
- **SUPABASE_INTEGRATION_SUMMARY.md** - Technical details of all changes

## ✅ Verification

Check backend logs for:
```
HikariPool-1 - Starting...
HikariPool-1 - Pool initialized with X connections
```

## 🐛 Troubleshooting

**Connection refused?**
- Verify host/port are correct
- Check IP whitelist in Supabase settings

**Authentication failed?**
- Verify username and password
- Check for special characters in password

**SSL errors?**
- PostgreSQL driver handles SSL automatically
- No additional configuration needed

## 📖 Next Steps

1. Create additional entities (Message, Room, etc.)
2. Implement authentication/authorization
3. Add service layer for business logic
4. Write integration tests
5. Set up database migrations (Flyway/Liquibase)
6. Configure for production deployment

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/)

