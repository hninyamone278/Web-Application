# HninYmo Jewellery Shop

A full-stack jewellery shop web application with appointment booking, product browsing, shopping cart, and admin dashboard.

## Tech Stack

**Frontend:** React, Vite, Material UI, Tailwind CSS, React Router  
**Backend:** Express, Sequelize, MySQL, JWT Authentication, Multer  
**Testing:** Jest, Supertest (backend), Vitest, React Testing Library (frontend)  
**Deployment:** Docker, Docker Compose, Nginx, GitHub Actions CI/CD

## Project Structure

```
├── frontend/              # React client app
├── backend/               # Express API server
├── docker-compose.yml     # Docker orchestration
├── .github/workflows/     # CI/CD pipeline
├── .vscode/launch.json    # Debug configurations
└── package.json           # Root scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL (or Docker for containerised deployment)

### Installation

1. Install dependencies
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Configure environment variables  
   Copy `.env.example` to `backend/.env` and fill in your values:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=jewellery_shop
   JWT_SECRET=your_secure_random_secret
   JWT_EXPIRES_IN=7d
   ```

3. Seed the database
   ```bash
   cd backend && npm run seed
   ```

4. Run the application
   ```bash
   # From the root directory
   npm run dev:server   # Start backend on port 5000
   npm run dev:client   # Start frontend on port 5173
   ```

## Testing

The project includes comprehensive automated tests for both backend and frontend.

### Backend Tests (Jest + Supertest)
Tests use an **in-memory SQLite database** so no MySQL instance is needed.

```bash
npm run test:backend       # Run backend tests
cd backend && npm test     # Same from backend directory
```

**Test suites:**
- `auth.test.js` — Registration, login, token validation (9 tests)
- `products.test.js` — Product listing, filtering, search, categories (8 tests)
- `orders.test.js` — Order creation, stock management, user isolation (8 tests)
- `auth.middleware.test.js` — JWT verification, admin access control (5 tests)

### Frontend Tests (Vitest + React Testing Library)

```bash
npm run test:frontend          # Run frontend tests
cd frontend && npm test        # Same from frontend directory
cd frontend && npm run test:watch  # Watch mode during development
```

**Test suites:**
- `Navbar.test.jsx` — Navigation rendering, auth-based UI (4 tests)
- `LoginPage.test.jsx` — Form rendering, submission, error handling (5 tests)
- `CartContext.test.jsx` — Add/remove/update cart items, total calculation (8 tests)

### Run All Tests

```bash
npm test   # Runs both backend and frontend tests
```

## Deployment

### Docker Deployment (Recommended)

The application can be deployed using Docker Compose with three services: MySQL, Express backend, and Nginx frontend.

```bash
# Start all services
npm run docker:up
# or
docker compose up --build -d

# Stop all services
npm run docker:down
# or
docker compose down
```

Once running, the application is accessible at **http://localhost**.

**Services:**
| Service    | Port | Description                        |
|------------|------|------------------------------------|
| `frontend` | 80   | Nginx serving React SPA + API proxy |
| `backend`  | 5000 | Express API server                  |
| `db`       | 3306 | MySQL 8 database                    |

### Environment Variables

See `.env.example` for all required variables. For Docker deployment, set them in a `.env` file at the project root or pass them directly to `docker compose`.

## CI/CD Pipeline

GitHub Actions runs on every push/PR to `main`:

1. **Backend Tests** — Installs deps, runs Jest test suite
2. **Frontend Tests** — Installs deps, runs linter, runs Vitest suite
3. **Build Verification** — Builds frontend, validates Docker Compose config

## Debugging

VS Code launch configurations are provided in `.vscode/launch.json`:

- **Debug Backend** — Launches backend with nodemon (auto-restart on changes)
- **Debug Backend Tests** — Runs Jest with debugger attached
- **Debug Frontend (Chrome)** — Opens Chrome with source maps to frontend
- **Full Stack Debug** — Launches backend + Chrome simultaneously

To use: Open the **Run and Debug** panel (Ctrl+Shift+D) and select a configuration.

## Features

- Product browsing and search with filters
- Shopping cart and checkout
- User authentication (register/login)
- Appointment booking for jewellery services
- Order management
- Admin dashboard (products, orders, appointments, reports)
