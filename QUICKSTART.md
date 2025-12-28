# Quick Start Guide

Get the Chatty application running in minutes!

## Prerequisites

- Java 21 (install via SDKMAN: `sdk install java 21.0.4-tem`)
- Node.js 18+ and npm
- Maven 3.6+

## Option 1: Run Locally (Recommended for Development)

### Terminal 1 - Start Backend

```bash
cd backend/chatty-backend
mvn spring-boot:run
```

Expected output:
```
Started App in X.XXX seconds
```

Backend will be available at: **http://localhost:8080**

### Terminal 2 - Start Frontend

```bash
cd frontend/chatty-frontend
npm install  # Only needed first time
npm run dev
```

Expected output:
```
VITE v7.1.10  ready in XXX ms
➜  Local:   http://localhost:5173/
```

Frontend will be available at: **http://localhost:5173**

## Option 2: Run with Docker

```bash
docker-compose up --build
```

This will start:
- Backend: http://localhost:8080
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432

To stop:
```bash
docker-compose down
```

## Verify Everything is Working

### Test Backend Health
```bash
curl http://localhost:8080/api/health
```

Expected response:
```
Backend is running!
```

### Test Frontend
Open your browser and navigate to: **http://localhost:5173**

You should see the React Vite welcome page.

## Project Structure

```
chatty/
├── backend/chatty-backend/     # Java Spring Boot backend
├── frontend/chatty-frontend/   # React frontend
├── mobile/                     # Mobile app (future)
└── services/                   # Microservices (future)
```

## Common Commands

### Backend
```bash
cd backend/chatty-backend

# Build
mvn clean install

# Run
mvn spring-boot:run

# Run tests
mvn test

# Create JAR
mvn clean package
```

### Frontend
```bash
cd frontend/chatty-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Port Already in Use

**Backend (8080)**
```bash
lsof -i :8080
kill -9 <PID>
```

**Frontend (5173)**
```bash
lsof -i :5173
kill -9 <PID>
```

### Java Version Issues

Verify Java 21 is installed:
```bash
java -version
```

If not, install via SDKMAN:
```bash
sdk install java 21.0.4-tem
sdk default java 21.0.4-tem
```

### npm Issues

Clear cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Maven Issues

Clear Maven cache:
```bash
rm -rf ~/.m2/repository
mvn clean install
```

## Next Steps

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development guide
2. Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for project layout
3. Review [README.md](README.md) for full documentation

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if backend is running

More endpoints coming soon!

## Need Help?

- Check [DEVELOPMENT.md](DEVELOPMENT.md) for troubleshooting
- Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for project layout
- Check backend logs: `mvn spring-boot:run` output
- Check frontend logs: Browser console (F12)

Happy coding! 🚀

