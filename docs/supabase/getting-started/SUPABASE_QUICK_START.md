# Supabase Quick Start

## 1. Get Your Supabase Credentials

From your Supabase project dashboard (Settings → Database):
- Host: `your-project.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: `your-password`

## 2. Run Backend with Supabase

### Option A: Using Environment Variables

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

### Option B: Using Docker Compose

Edit `docker-compose.yml` and update the backend service:

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

## 3. Verify Connection

Check the logs for:
```
HikariPool-1 - Starting...
HikariPool-1 - Pool initialized with X connections
```

## 4. Test with Sample User Entity

The backend includes a `User` entity. You can test it by creating a REST endpoint:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
    
    @GetMapping("/{id}")
    public Optional<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id);
    }
}
```

## Files Modified/Created

- ✅ `pom.xml` - Added PostgreSQL driver
- ✅ `application.properties` - Updated with environment variable support
- ✅ `application-supabase.properties` - New Supabase configuration
- ✅ `User.java` - Sample entity
- ✅ `UserRepository.java` - Sample repository
- ✅ `docker-compose.yml` - Updated with Supabase environment variables

## Troubleshooting

**Connection refused?**
- Check host/port are correct
- Verify IP is whitelisted in Supabase

**Auth failed?**
- Verify username and password
- Check for special characters in password

**SSL errors?**
- PostgreSQL driver handles SSL automatically
- No additional configuration needed

