# Development Guide

This guide provides instructions for setting up and running the Chatty application in development mode.

## Prerequisites

- Java 21 or higher
- Node.js 18+ and npm
- Maven 3.6+
- Git

## Local Development Setup

### 1. Backend Development

#### First Time Setup
```bash
cd backend/chatty-backend
mvn clean install
```

#### Running the Backend
```bash
cd backend/chatty-backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### Backend Structure
```
backend/chatty-backend/
├── src/
│   ├── main/
│   │   ├── java/com/chatty/
│   │   │   ├── App.java                 # Main Spring Boot application
│   │   │   └── controller/
│   │   │       └── HealthController.java # Health check endpoint
│   │   └── resources/
│   │       └── application.properties    # Spring Boot configuration
│   └── test/
├── pom.xml                              # Maven configuration
└── Dockerfile                           # Docker configuration
```

#### Useful Backend Commands
- `mvn clean install` - Clean build
- `mvn spring-boot:run` - Run application
- `mvn test` - Run tests
- `mvn clean package` - Create JAR file
- `mvn dependency:tree` - View dependency tree

### 2. Frontend Development

#### First Time Setup
```bash
cd frontend/chatty-frontend
npm install
```

#### Running the Frontend
```bash
cd frontend/chatty-frontend
npm run dev
```

The frontend will start on `http://localhost:5173` with hot reload enabled.

#### Frontend Structure
```
frontend/chatty-frontend/
├── src/
│   ├── App.jsx                  # Main React component
│   ├── App.css                  # App styles
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json                 # npm configuration
├── vite.config.js              # Vite configuration
└── Dockerfile                   # Docker configuration
```

#### Useful Frontend Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### 3. Running Both Services

#### Terminal 1 - Backend
```bash
cd backend/chatty-backend
mvn spring-boot:run
```

#### Terminal 2 - Frontend
```bash
cd frontend/chatty-frontend
npm run dev
```

Both services will now be running:
- Backend: http://localhost:8080
- Frontend: http://localhost:5173

### 4. Docker Development

To run the entire stack with Docker:

```bash
docker-compose up --build
```

This will start:
- Backend on http://localhost:8080
- Frontend on http://localhost:5173
- PostgreSQL on localhost:5432

To stop:
```bash
docker-compose down
```

## Testing

### Backend Tests
```bash
cd backend/chatty-backend
mvn test
```

### Frontend Tests
```bash
cd frontend/chatty-frontend
npm run test
```

## API Documentation

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `"Backend is running!"`
- **Example**: `curl http://localhost:8080/api/health`

## Troubleshooting

### Backend Issues

**Port 8080 already in use**
```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

**Maven build fails**
```bash
# Clear Maven cache
rm -rf ~/.m2/repository
mvn clean install
```

### Frontend Issues

**Port 5173 already in use**
```bash
# Find process using port 5173
lsof -i :5173
# Kill the process
kill -9 <PID>
```

**npm install fails**
```bash
# Clear npm cache
npm cache clean --force
npm install
```

## Code Style

### Backend
- Follow Google Java Style Guide
- Use Lombok annotations to reduce boilerplate
- Write unit tests for new features

### Frontend
- Use ES6+ syntax
- Follow React best practices
- Use functional components with hooks

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request

## Next Steps

- [ ] Set up authentication
- [ ] Create database models
- [ ] Implement WebSocket for real-time messaging
- [ ] Add frontend components
- [ ] Set up CI/CD pipeline

