# Supabase PostgreSQL Setup Guide

This guide explains how to connect the Chatty backend to a PostgreSQL database running in Supabase.

## Prerequisites

- A Supabase account (https://supabase.com)
- A Supabase project created
- Your Supabase connection credentials

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" → "Database"
3. You'll find:
   - **Host**: `your-project.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Your database password

## Configuration Methods

### Method 1: Environment Variables (Recommended for Production)

Set these environment variables before running the application:

```bash
export SPRING_PROFILES_ACTIVE=supabase
export SUPABASE_HOST=your-project.supabase.co
export SUPABASE_PORT=5432
export SUPABASE_DB=postgres
export SUPABASE_USER=postgres
export SUPABASE_PASSWORD=your-password
```

Then run:
```bash
cd backend/chatty-backend
mvn spring-boot:run
```

### Method 2: Docker Compose

Edit `docker-compose.yml` and uncomment the Supabase environment variables:

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=supabase
  - SUPABASE_HOST=your-project.supabase.co
  - SUPABASE_PORT=5432
  - SUPABASE_DB=postgres
  - SUPABASE_USER=postgres
  - SUPABASE_PASSWORD=your-password
```

Then run:
```bash
docker-compose up --build
```

### Method 3: application-supabase.properties

Edit `backend/chatty-backend/src/main/resources/application-supabase.properties` directly with your credentials.

## Database Entities

The backend includes a sample `User` entity that demonstrates how to use the database:

- **Entity**: `com.chatty.entity.User`
- **Repository**: `com.chatty.repository.UserRepository`

### Using the User Repository

```java
@Autowired
private UserRepository userRepository;

// Save a user
User user = User.builder()
    .username("john_doe")
    .email("john@example.com")
    .password("hashed_password")
    .firstName("John")
    .lastName("Doe")
    .build();
userRepository.save(user);

// Find by username
Optional<User> user = userRepository.findByUsername("john_doe");

// Find by email
Optional<User> user = userRepository.findByEmail("john@example.com");
```

## Verifying the Connection

1. Start the backend with Supabase configuration
2. Check the logs for successful connection messages
3. The application should start without database errors

## Troubleshooting

### Connection Refused
- Verify your Supabase host and port are correct
- Check if your IP is whitelisted in Supabase (Settings → Database → Connection pooling)

### Authentication Failed
- Double-check your username and password
- Ensure special characters in password are properly escaped

### SSL Connection Issues
- Supabase requires SSL connections
- The PostgreSQL driver handles this automatically

## Next Steps

1. Create additional entities for your chat application (Message, Room, etc.)
2. Create corresponding repositories
3. Build your API endpoints using Spring REST controllers
4. Add service layer for business logic

