# Chatty - Monorepo Chat Application

A modern chat application built with a monorepo structure containing backend, frontend, mobile, and microservices.

## Project Structure

```
chatty/
├── backend/              # Java Spring Boot backend service
│   └── chatty-backend/   # Main backend application
├── frontend/             # React frontend application
│   └── chatty-frontend/  # Main React app with Vite
├── mobile/               # Mobile application (future)
├── services/             # Additional microservices (future)
└── README.md
```

## Tech Stack

### Backend
- **Java 21** with Spring Boot 3.3.4
- **Spring Data JPA** for database operations
- **H2 Database** for development (in-memory)
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

### Frontend
- **React 18** with Vite
- **Node.js** and npm for package management
- **Hot Module Replacement (HMR)** for fast development

## Prerequisites

- Java 21 or higher
- Node.js 18+ and npm
- Maven 3.6+

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/chatty-backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

4. Check health endpoint:
   ```bash
   curl http://localhost:8080/api/health
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/chatty-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## Available Scripts

### Backend
- `mvn clean install` - Build the project
- `mvn spring-boot:run` - Run the application
- `mvn test` - Run tests
- `mvn clean package` - Create JAR file

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Health Check
- `GET /api/health` - Check if backend is running

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Real-time messaging with WebSockets
- [ ] Message persistence
- [ ] User profiles
- [ ] Mobile application
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Contributing

Please follow the project structure and coding standards when contributing.

## License

MIT

