# MapApi

A monorepo containing a Clean Architecture .NET 10 Map API (backend) and a React + TypeScript frontend.

## Repository Structure

```
MapApi/
├── .github/workflows/
│   ├── backend-ci.yml        # Backend build & test
│   ├── backend-deploy.yml    # Backend deploy to VPS
│   ├── frontend-ci.yml       # Frontend build & test
│   └── frontend-deploy.yml   # Frontend deploy to VPS
├── backend/
│   ├── src/
│   │   ├── MapApi.Api/
│   │   ├── MapApi.Application/
│   │   ├── MapApi.Domain/
│   │   └── MapApi.Infrastructure/
│   ├── tests/
│   │   ├── MapApi.Api.Tests/
│   │   ├── MapApi.Application.Tests/
│   │   ├── MapApi.Domain.Tests/
│   │   └── MapApi.Infrastructure.Tests/
│   ├── .dockerignore
│   ├── Dockerfile
│   └── MapApi.slnx
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

## Prerequisites

- .NET 10 SDK (backend)
- Node.js 20+ (frontend)
- Docker & Docker Compose

## Backend

The backend follows Clean Architecture principles with strict separation of concerns:

```
src/
├── MapApi.Domain/          # Innermost layer - zero external dependencies
├── MapApi.Application/     # Use cases, DTOs, interfaces, mapping
├── MapApi.Infrastructure/  # MongoDB implementation (adapter)
└── MapApi.Api/             # Presentation - Minimal API endpoints
tests/
├── MapApi.Domain.Tests/
├── MapApi.Application.Tests/
├── MapApi.Infrastructure.Tests/
└── MapApi.Api.Tests/
```

### Running the Backend Locally

1. Start MongoDB:
```bash
docker compose up -d mongodb
```

2. Run the API:
```bash
cd backend/src/MapApi.Api
dotnet run
```

3. Open the OpenAPI document at `http://localhost:8080/openapi/v1.json`

### Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/map-objects?longitude={lon}&latitude={lat}&radiusInMeters={r}` | Get map objects in area |
| GET | `/api/map-objects/filter?longitude={lon}&latitude={lat}&radiusInMeters={r}&name={n}&description={d}&id={id}` | Filter map objects in area by name, description, or ID |
| GET | `/api/map-objects/{id}` | Get map object by ID |
| POST | `/api/map-objects` | Create a new map object |

## Frontend

React 18 + TypeScript + Vite app with a service layer architecture. All API calls go through `frontend/src/services/`.

### Running the Frontend Locally

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The dev server proxies `/api` requests to `http://localhost:8080`.

## Running Everything Together

```bash
docker compose up -d --build
```

This starts:
- `mongodb` on port 27017
- `api` (backend) on port 8080
- `frontend` on port 3000

## CI/CD

Each app has completely independent pipelines. A change in `backend/` never triggers frontend workflows and vice versa.

| Workflow | Trigger | Scope |
|----------|---------|-------|
| `backend-ci.yml` | Push/PR to main/develop with `backend/**` changes | Build & test backend |
| `backend-deploy.yml` | Push to main with `backend/**` changes (or manual) | Deploy backend to VPS |
| `frontend-ci.yml` | Push/PR to main/develop with `frontend/**` changes | Build & test frontend |
| `frontend-deploy.yml` | Push to main with `frontend/**` changes (or manual) | Deploy frontend to VPS |

On the VPS, each service is built and deployed independently. The root `docker-compose.yml` ties everything together for local development only.

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | Hostinger VPS IP address or hostname |
| `VPS_USERNAME` | SSH username (e.g., `root`) |
| `VPS_SSH_KEY` | Private SSH key for authentication |
| `VPS_PORT` | SSH port (optional, defaults to `22`) |

**VPS prerequisites:**
- Docker and Docker Compose installed
- SSH access configured with the key stored in secrets

## Technology Stack

- **.NET 10** Minimal API
- **MongoDB** with GeoJSON & Geospatial Indexes (2dsphere)
- **xUnit** for testing
- **Docker** for containerization
- **GitHub Actions** for CI/CD
- No AutoMapper (manual static mappers)
- No FluentValidation (System.ComponentModel.DataAnnotations)
