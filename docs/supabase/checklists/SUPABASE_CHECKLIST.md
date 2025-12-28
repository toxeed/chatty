# Supabase Integration Checklist

## Pre-Setup
- [ ] Create a Supabase account at https://supabase.com
- [ ] Create a new Supabase project
- [ ] Note your project credentials:
  - [ ] Host: `your-project.supabase.co`
  - [ ] Port: `5432`
  - [ ] Database: `postgres`
  - [ ] User: `postgres`
  - [ ] Password: (your database password)

## Backend Configuration
- [x] PostgreSQL JDBC driver added to pom.xml
- [x] application.properties updated with environment variable support
- [x] application-supabase.properties created with Supabase config
- [x] User entity created (JPA)
- [x] UserRepository created (Spring Data JPA)
- [x] UserController created (REST API)
- [x] docker-compose.yml updated with Supabase environment variables

## Running the Backend

### Option 1: Direct Execution
- [ ] Set environment variables:
  ```bash
  export SPRING_PROFILES_ACTIVE=supabase
  export SUPABASE_HOST=your-project.supabase.co
  export SUPABASE_PORT=5432
  export SUPABASE_DB=postgres
  export SUPABASE_USER=postgres
  export SUPABASE_PASSWORD=your-password
  ```
- [ ] Navigate to backend directory: `cd backend/chatty-backend`
- [ ] Run: `mvn spring-boot:run`
- [ ] Verify backend starts on http://localhost:8080

### Option 2: Docker Compose
- [ ] Edit docker-compose.yml with your Supabase credentials
- [ ] Run: `docker-compose up --build`
- [ ] Verify backend starts on http://localhost:8080

## Testing the Connection
- [ ] Check logs for "HikariPool-1 - Pool initialized"
- [ ] Test health endpoint: `curl http://localhost:8080/api/health`
- [ ] Create a test user: `curl -X POST http://localhost:8080/api/users ...`
- [ ] Retrieve the user: `curl http://localhost:8080/api/users/1`
- [ ] Verify data in Supabase dashboard (SQL Editor)

## Troubleshooting
- [ ] Connection refused? Check host/port and IP whitelist in Supabase
- [ ] Auth failed? Verify username/password
- [ ] SSL errors? PostgreSQL driver handles SSL automatically
- [ ] Check backend logs for detailed error messages

## Documentation
- [x] SUPABASE_SETUP.md - Detailed setup guide
- [x] SUPABASE_QUICK_START.md - Quick reference
- [x] SUPABASE_INTEGRATION_SUMMARY.md - Complete overview
- [x] SUPABASE_API_EXAMPLES.md - API testing examples
- [x] SUPABASE_CHECKLIST.md - This checklist

## Next Steps
- [ ] Create additional entities (Message, Room, etc.)
- [ ] Implement authentication/authorization
- [ ] Add service layer for business logic
- [ ] Write integration tests
- [ ] Set up database migrations (Flyway/Liquibase)
- [ ] Configure SSL certificates for production
- [ ] Set up CI/CD pipeline
- [ ] Monitor database performance in Supabase dashboard

## Useful Commands

```bash
# Build backend
cd backend/chatty-backend && mvn clean install

# Run backend with Supabase
export SPRING_PROFILES_ACTIVE=supabase && mvn spring-boot:run

# Run with Docker
docker-compose up --build

# View backend logs
docker logs chatty-backend

# Test health endpoint
curl http://localhost:8080/api/health

# Test user API
curl http://localhost:8080/api/users
```

## Support Resources
- Supabase Docs: https://supabase.com/docs
- Spring Boot Docs: https://spring.io/projects/spring-boot
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- PostgreSQL JDBC: https://jdbc.postgresql.org/

