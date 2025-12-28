# Project Structure

This document describes the complete structure of the Chatty monorepo.

## Directory Layout

```
chatty/
├── backend/                          # Java Spring Boot backend
│   └── chatty-backend/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/chatty/
│       │   │   │   ├── App.java                    # Spring Boot entry point
│       │   │   │   └── controller/
│       │   │   │       └── HealthController.java   # Health check endpoint
│       │   │   └── resources/
│       │   │       └── application.properties      # Spring Boot config
│       │   └── test/
│       │       └── java/com/chatty/
│       │           └── AppTest.java                # Unit tests
│       ├── pom.xml                                 # Maven configuration
│       ├── Dockerfile                              # Docker build config
│       └── target/                                 # Build output (generated)
│
├── frontend/                         # React frontend with Vite
│   └── chatty-frontend/
│       ├── src/
│       │   ├── App.jsx                             # Main React component
│       │   ├── App.css                             # App styles
│       │   ├── main.jsx                            # Entry point
│       │   ├── index.css                           # Global styles
│       │   └── assets/                             # Static assets
│       ├── public/                                 # Public assets
│       ├── package.json                            # npm configuration
│       ├── package-lock.json                       # npm lock file
│       ├── vite.config.js                          # Vite configuration
│       ├── Dockerfile                              # Docker build config
│       ├── dist/                                   # Build output (generated)
│       └── node_modules/                           # Dependencies (generated)
│
├── mobile/                           # Mobile app (future)
│   └── README.md                     # Mobile app placeholder
│
├── services/                         # Microservices (future)
│   └── README.md                     # Services placeholder
│
├── README.md                         # Main project README
├── DEVELOPMENT.md                    # Development guide
├── PROJECT_STRUCTURE.md              # This file
├── docker-compose.yml                # Docker Compose configuration
└── .gitignore                        # Git ignore rules
```

## Backend Structure Details

### Java Package Structure
```
com.chatty/
├── App.java                          # Spring Boot application class
├── controller/                       # REST controllers
│   └── HealthController.java         # Health check endpoint
├── service/                          # Business logic (future)
├── repository/                       # Data access layer (future)
├── model/                            # Entity models (future)
├── config/                           # Configuration classes (future)
└── exception/                        # Custom exceptions (future)
```

### Key Files
- **pom.xml**: Maven configuration with Spring Boot 3.3.4, Java 21, and dependencies
- **application.properties**: Spring Boot configuration (port, database, logging)
- **Dockerfile**: Multi-stage Docker build for production deployment

## Frontend Structure Details

### React Component Structure
```
src/
├── App.jsx                           # Root component
├── main.jsx                          # React DOM render entry
├── App.css                           # App component styles
├── index.css                         # Global styles
├── components/                       # Reusable components (future)
├── pages/                            # Page components (future)
├── services/                         # API services (future)
├── hooks/                            # Custom React hooks (future)
└── utils/                            # Utility functions (future)
```

### Key Files
- **package.json**: npm configuration with React, Vite, and dev dependencies
- **vite.config.js**: Vite bundler configuration
- **Dockerfile**: Multi-stage Docker build for production deployment

## Configuration Files

### Root Level
- **.gitignore**: Ignores build artifacts, dependencies, IDE files
- **docker-compose.yml**: Orchestrates backend, frontend, and PostgreSQL services
- **README.md**: Main project documentation
- **DEVELOPMENT.md**: Development setup and workflow guide
- **PROJECT_STRUCTURE.md**: This file

## Build Artifacts (Generated)

### Backend
- **target/**: Maven build output
  - `chatty-backend-1.0-SNAPSHOT.jar`: Executable Spring Boot JAR

### Frontend
- **dist/**: Vite build output (production build)
- **node_modules/**: npm dependencies

## Environment Configuration

### Backend (application.properties)
```properties
spring.application.name=chatty-backend
server.port=8080
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update
```

### Frontend (vite.config.js)
```javascript
export default {
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
}
```

## Dependencies

### Backend
- Spring Boot 3.3.4
- Spring Data JPA
- H2 Database
- Lombok
- JUnit 5

### Frontend
- React 18
- Vite 7
- ESLint
- Vitest (for testing)

## Future Structure Additions

### Mobile App
```
mobile/
├── android/              # Android app
├── ios/                  # iOS app
└── shared/               # Shared code
```

### Microservices
```
services/
├── notification-service/
├── auth-service/
└── file-service/
```

## Development Workflow

1. **Backend Development**: Edit files in `backend/chatty-backend/src/`
2. **Frontend Development**: Edit files in `frontend/chatty-frontend/src/`
3. **Build Backend**: `mvn clean install` in backend directory
4. **Build Frontend**: `npm run build` in frontend directory
5. **Run Locally**: Use `mvn spring-boot:run` and `npm run dev`
6. **Docker**: Use `docker-compose up` for containerized deployment

## Adding New Features

### Adding a Backend Endpoint
1. Create a new controller in `backend/chatty-backend/src/main/java/com/chatty/controller/`
2. Add service logic in `backend/chatty-backend/src/main/java/com/chatty/service/`
3. Add tests in `backend/chatty-backend/src/test/java/com/chatty/`

### Adding a Frontend Component
1. Create component in `frontend/chatty-frontend/src/components/`
2. Import and use in `App.jsx` or other components
3. Add styles in component CSS file

## Deployment

### Docker Deployment
```bash
docker-compose up --build
```

### Manual Deployment
- Backend: `java -jar target/chatty-backend-1.0-SNAPSHOT.jar`
- Frontend: `npm run build && serve -s dist`

